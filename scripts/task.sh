#!/usr/bin/env bash
set -uo pipefail

# Usage: task.sh {command} {target[:container]}...
# Runs the command for all targets together quietly, showing a spinner for each target while running and ✔, ✘ or - when done, and the outputs of the failed targets.

# Workspace root is one level above this script (scripts).
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

command="$1"
shift

targets=()
containers=()
names=()
for item in "$@"; do
  targets+=("${item%%:*}")
  containers+=("${item#*:}")
  names+=("oreamo-${item#*:}")
done

# Statuses of the command while running and when done.
case "$command" in
  up) active="Starting" complete="Started" ;;
  down) active="Removing" complete="Removed" ;;
  lint | format) active="Checking" complete="Passed" ;;
  lint-fix | format-fix) active="Fixing" complete="Fixed" ;;
  build) active="Building" complete="Built" ;;
  run) active="Starting" complete="Running" ;;
  stop) active="Stopping" complete="Stopped" ;;
esac

# Exit code of the task which has nothing to do.
skipped=10

# Print the current time in tenths of a second.
now() {
  perl -MTime::HiRes=time -e 'printf "%d\n", time * 10'
}

start="$(now)"

# Results of the targets are written as files named by their indexes, with the exit code and the end time.
results="$(mktemp -d)"

# Outputs of the targets are kept while running, to show them when the targets failed.
outputs="$(mktemp -d)"

# Phases of the targets are written as files named by their indexes while running, to show them instead of the status of the command, such as stopping the other run first.
phases="$(mktemp -d)"

# Notes of the targets are written as files named by their indexes, to show what was done besides the command next to the names.
notes="$(mktemp -d)"

# Print the processes run by the given process and their descendants.
descendants() {
  for child in $(pgrep -P "$1" || true); do
    descendants "$child"
    echo "$child"
  done
}

# Hide the cursor and keep the long lines from wrapping while running, and stop the running tasks with their processes when interrupted.
[ -t 1 ] && printf '\033[?25l\033[?7l'
trap '[ -t 1 ] && printf "\033[?25h\033[?7h"; rm -rf "$results" "$outputs" "$phases" "$notes"' EXIT
trap 'kill $(descendants $$) 2> /dev/null; exit 130' INT TERM

# Write the result of the target by the given exit code.
finish() {
  echo "$2 $(now)" > "$results/$1.tmp"
  mv "$results/$1.tmp" "$results/$1"
}

# Count the targets which are done.
done_count() {
  ls "$results" | grep -vc '\.tmp$'
}

# Run the command for the target.
task() {
  case "$command:$1" in
    lint:web) pnpm --dir oreamo-web lint ;;
    lint:agent) uv run --directory oreamo-agent ruff check . ;;
    lint-fix:web) pnpm --dir oreamo-web lint:fix ;;
    lint-fix:agent) uv run --directory oreamo-agent ruff check --fix . ;;
    format:web) pnpm --dir oreamo-web format:check ;;
    format:api) oreamo-api/gradlew -p oreamo-api spotlessCheck ;;
    format:agent) uv run --directory oreamo-agent ruff format --check . ;;
    format-fix:web) pnpm --dir oreamo-web format ;;
    format-fix:api) oreamo-api/gradlew -p oreamo-api spotlessApply ;;
    format-fix:agent) uv run --directory oreamo-agent ruff format . ;;
    build:web) pnpm --dir oreamo-web build ;;
    build:api) oreamo-api/gradlew -p oreamo-api build ;;
    build:agent) uv run --directory oreamo-agent ty check ;;
    run:*) bash scripts/run.sh "$1" ;;
    stop:*) bash scripts/stop.sh "$1" ;;
  esac
}

case "$command" in
  up | down)
    # Fail all targets if docker is not running.
    if ! docker info > /dev/null 2>&1; then
      echo "Docker is not running." > "$outputs/compose"
      for i in "${!targets[@]}"; do
        finish "$i" 1
      done
    else
      # Print the state of the container as "{running} {started at}", or nothing if it does not exist.
      state() {
        docker inspect -f '{{.State.Running}} {{.State.StartedAt}}' "$1" 2> /dev/null
      }

      # Keep the states of the containers before running, to find the containers started by this run.
      before=()
      for i in "${!targets[@]}"; do
        before+=("$(state "${names[$i]}")")

        # Skip removing the container which does not exist.
        if [ "$command" = "down" ] && [ -z "${before[$i]}" ]; then
          finish "$i" "$skipped"
        fi
      done

      # Run docker compose once for all targets so that it handles the dependencies.
      (
        if [ "$command" = "up" ]; then
          # Stop the services run directly first, so that the containers can use their ports.
          for i in "${!targets[@]}"; do
            case "${targets[$i]}" in
              web | api | agent)
                if [ -n "$(bash scripts/find-process.sh "${targets[$i]}")" ]; then
                  echo "Stopping (local)" > "$phases/$i"
                  bash scripts/stop.sh "${targets[$i]}" && echo "local stopped" > "$notes/$i"
                  rm -f "$phases/$i"
                fi
                ;;
            esac
          done

          docker compose up -d --build "${containers[@]}"
        else
          # Remove the network too once no container is left on it, which docker refuses while any container uses it.
          docker compose down "${containers[@]}" && { docker network rm oreamo-network > /dev/null 2>&1 || true; }
        fi > "$outputs/compose" 2>&1
        echo "$?" > "$results/.compose"
      ) < /dev/null > /dev/null 2>&1 &

      # Judge each target by its container while docker compose is running, and the rest when it is done.
      (
        while [ "$(done_count)" -lt "${#targets[@]}" ]; do
          code="$(cat "$results/.compose" 2> /dev/null || true)"

          for i in "${!targets[@]}"; do
            if [ -f "$results/$i" ]; then
              continue
            fi

            current="$(state "${names[$i]}")"
            if [ "$command" = "up" ]; then
              # Started by this run, or running when docker compose is done.
              if [ "${current%% *}" = "true" ] && { [ "$current" != "${before[$i]}" ] || [ "$code" = "0" ]; }; then
                finish "$i" 0
              elif [ -n "$code" ]; then
                finish "$i" 1
              fi
            else
              # Removed by this run.
              if [ -z "$current" ]; then
                finish "$i" 0
              elif [ -n "$code" ]; then
                finish "$i" 1
              fi
            fi
          done

          sleep 0.5
        done
      ) < /dev/null > /dev/null 2>&1 &
    fi
    ;;
  *)
    for i in "${!targets[@]}"; do
      (
        # Let the scripts of the target write its phase and note.
        export PHASE_FILE="$phases/$i" NOTE_FILE="$notes/$i"
        task "${targets[$i]}" > "$outputs/$i" 2>&1
        finish "$i" "$?"
      ) < /dev/null > /dev/null 2>&1 &
    done
    ;;
esac

frames=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
frame=0

# Align the statuses after the longest name.
width=0
for name in "${names[@]}"; do
  if [ "${#name}" -gt "$width" ]; then
    width="${#name}"
  fi
done

# Fit the statuses to the longest one, such as "Removing (docker)".
status_width=17

# Push the statuses to the right end of the terminal, leaving the columns for the wide icons.
if [ -t 1 ]; then
  columns="$(stty size < /dev/tty 2> /dev/null | cut -d ' ' -f 2)"
  columns="${columns:-0}"
  if [ $((columns - status_width - 13)) -gt "$width" ]; then
    width=$((columns - status_width - 13))
  fi
fi

# Fill the progress bar in the room left in the line after the name, the count and the time.
bar=$((width + status_width - 14))
if [ "$bar" -lt 10 ]; then
  bar=10
fi

# Print the seconds of the given tenths of a second.
seconds() {
  echo "$(($1 / 10)).$(($1 % 10))s"
}

# Print the progress bar of the app, and the line of each target with its spinner or result, status and elapsed time.
render() {
  local current lines="" count=0 failed=0 last="$start"
  current="$(now)"

  for i in "${!targets[@]}"; do
    local icon status color end code

    if [ ! -f "$results/$i" ]; then
      icon="${frames[frame % ${#frames[@]}]}" status="$active" color="0" end="$current"

      # Show the phase of the target instead if it is written.
      if [ -s "$phases/$i" ]; then
        status="$(cat "$phases/$i" 2> /dev/null || echo "$active")"
      fi
    else
      read -r code end < "$results/$i"
      count=$((count + 1))
      if [ "$code" = "0" ]; then
        icon="✔" status="$complete" color="32"
      elif [ "$code" = "$skipped" ]; then
        icon="-" status="Skipped" color="33"
      else
        icon="✘" status="Failed" color="31"
        failed=1
      fi
    fi

    if [ "$end" -gt "$last" ]; then
      last="$end"
    fi

    # Show the note in gray after the name, filling the rest of the name column.
    local note="" pad
    if [ -s "$notes/$i" ]; then
      note=" ($(cat "$notes/$i" 2> /dev/null))"
    fi
    pad=$((width - ${#names[$i]} - ${#note}))
    if [ "$pad" -lt 0 ]; then
      pad=0
    fi

    lines+="$(printf "\033[K\033[${color}m%s\033[0m %s\033[90m%s\033[0m%${pad}s  \033[${color}m%-${status_width}s\033[0m %6s" \
      "$icon" "${names[$i]}" "$note" "" "$status" "$(seconds $((end - start)))")"$'\n'
  done

  # Fill the bar by the count of the targets done, in red if any target failed.
  local filled=$((bar * count / ${#targets[@]})) fill="" rest="" color="32"
  if [ "$failed" = "1" ]; then
    color="31"
  fi
  for ((j = 0; j < bar; j++)); do
    if [ "$j" -lt "$filled" ]; then
      fill+="━"
    else
      rest+="─"
    fi
  done

  printf "\033[Koreamo-app  \033[${color}m%s\033[90m%s\033[0m %5s %6s\n" \
    "$fill" "$rest" "$count/${#targets[@]}" "$(seconds $((last - start)))"
  printf "%s" "$lines"
}

if [ -t 1 ]; then
  # Count the targets done before rendering, so that the last render shows all of them done.
  while true; do
    finished="$(done_count)"
    render
    if [ "$finished" -ge "${#targets[@]}" ]; then
      break
    fi

    sleep 0.1
    frame=$((frame + 1))
    printf '\033[%dA' $((${#targets[@]} + 1))
  done
else
  wait
  render
fi
wait

# Show the outputs of the failed targets, and the output of docker compose once for up and down.
shown_compose=0
for i in "${!targets[@]}"; do
  read -r code end < "$results/$i"
  if [ "$code" = "0" ] || [ "$code" = "$skipped" ]; then
    continue
  fi

  if [ -f "$outputs/$i" ]; then
    printf '\n\033[31m%s\033[0m\n' "${names[$i]}"
    cat "$outputs/$i"
  elif [ "$shown_compose" = "0" ] && [ -f "$outputs/compose" ]; then
    printf '\n\033[31m%s\033[0m\n' "docker compose"
    cat "$outputs/compose"
    shown_compose=1
  fi
done

# Fail if any target failed.
! grep -qvE "^(0|$skipped) " "$results"/*
