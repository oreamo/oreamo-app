#!/usr/bin/env bash
set -uo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

command="$1"
shift

targets=("$@")
names=()
for target in "${targets[@]}"; do
  names+=("oreamo-$target")
done

case "$command" in
  up) active="Starting" complete="Started" ;;
  down) active="Removing" complete="Removed" ;;
  lint | format) active="Checking" complete="Passed" ;;
  lint-fix | format-fix) active="Fixing" complete="Fixed" ;;
  build) active="Building" complete="Built" ;;
  run) active="Starting" complete="Running" ;;
  stop) active="Stopping" complete="Stopped" ;;
esac

skipped=10

now() {
  perl -MTime::HiRes=time -e 'printf "%d\n", time * 10'
}

start="$(now)"

results="$(mktemp -d)"

outputs="$(mktemp -d)"

phases="$(mktemp -d)"

notes="$(mktemp -d)"

descendants() {
  for child in $(pgrep -P "$1" || true); do
    descendants "$child"
    echo "$child"
  done
}

[ -t 1 ] && printf '\033[?25l\033[?7l'
trap '[ -t 1 ] && printf "\033[?25h\033[?7h"; rm -rf "$results" "$outputs" "$phases" "$notes"' EXIT
trap 'kill $(descendants $$) 2> /dev/null; exit 130' INT TERM

finish() {
  echo "$2 $(now)" > "$results/$1.tmp"
  mv "$results/$1.tmp" "$results/$1"
}

done_count() {
  ls "$results" | grep -vc '\.tmp$'
}

task() {
  case "$command:$1" in
    lint:web) pnpm --dir web lint ;;
    lint:agent) uv run --directory agent ruff check . ;;
    lint-fix:web) pnpm --dir web lint:fix ;;
    lint-fix:agent) uv run --directory agent ruff check --fix . ;;
    format:web) pnpm --dir web format:check ;;
    format:api) api/gradlew -p api spotlessCheck ;;
    format:agent) uv run --directory agent ruff format --check . ;;
    format-fix:web) pnpm --dir web format ;;
    format-fix:api) api/gradlew -p api spotlessApply ;;
    format-fix:agent) uv run --directory agent ruff format . ;;
    build:web) pnpm --dir web build ;;
    build:api) api/gradlew -p api build ;;
    build:agent) uv run --directory agent ty check ;;
    run:*) bash scripts/run.sh "$1" ;;
    stop:*) bash scripts/stop.sh "$1" ;;
  esac
}

case "$command" in
  up | down)
    if ! docker info > /dev/null 2>&1; then
      echo "Docker is not running." > "$outputs/compose"
      for i in "${!targets[@]}"; do
        finish "$i" 1
      done
    else
      state() {
        docker inspect -f '{{.State.Running}} {{.State.StartedAt}}' "$1" 2> /dev/null
      }

      before=()
      for i in "${!targets[@]}"; do
        before+=("$(state "${names[$i]}")")

        if [ "$command" = "down" ] && [ -z "${before[$i]}" ]; then
          finish "$i" "$skipped"
        fi
      done

      (
        if [ "$command" = "up" ]; then
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

          BUILDX_NO_DEFAULT_ATTESTATIONS=1 docker compose up -d --build "${targets[@]}"
        else
          docker compose down "${targets[@]}" && { docker network rm oreamo-network > /dev/null 2>&1 || true; }
        fi > "$outputs/compose" 2>&1
        echo "$?" > "$results/.compose"
      ) < /dev/null > /dev/null 2>&1 &

      (
        while [ "$(done_count)" -lt "${#targets[@]}" ]; do
          code="$(cat "$results/.compose" 2> /dev/null || true)"

          for i in "${!targets[@]}"; do
            if [ -f "$results/$i" ]; then
              continue
            fi

            current="$(state "${names[$i]}")"
            if [ "$command" = "up" ]; then
              if [ "${current%% *}" = "true" ] && [ "$current" != "${before[$i]}" ]; then
                finish "$i" 0
              elif [ "${current%% *}" = "true" ] && [ "$code" = "0" ]; then
                finish "$i" "$skipped"
              elif [ -n "$code" ]; then
                finish "$i" 1
              fi
            else
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
        export PHASE_FILE="$phases/$i" NOTE_FILE="$notes/$i"
        task "${targets[$i]}" > "$outputs/$i" 2>&1
        finish "$i" "$?"
      ) < /dev/null > /dev/null 2>&1 &
    done
    ;;
esac

frames=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
frame=0

width=0
for name in "${names[@]}"; do
  if [ "${#name}" -gt "$width" ]; then
    width="${#name}"
  fi
done

status_width=17

if [ -t 1 ]; then
  columns="$(stty size < /dev/tty 2> /dev/null | cut -d ' ' -f 2)"
  columns="${columns:-0}"
  if [ $((columns - status_width - 13)) -gt "$width" ]; then
    width=$((columns - status_width - 13))
  fi
fi

bar=$((width + status_width - 14))
if [ "$bar" -lt 10 ]; then
  bar=10
fi

seconds() {
  echo "$(($1 / 10)).$(($1 % 10))s"
}

render() {
  local current lines="" count=0 failed=0 last="$start"
  current="$(now)"

  for i in "${!targets[@]}"; do
    local icon status color end code

    if [ ! -f "$results/$i" ]; then
      icon="${frames[frame % ${#frames[@]}]}" status="$active" color="0" end="$current"

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

! grep -qvE "^(0|$skipped) " "$results"/*
