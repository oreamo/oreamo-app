import { useEffect, useRef } from "react";

const SCROLL_FADE_SIZE = 24;

type ScrollFadeDirection = "horizontal" | "vertical";

interface UseScrollFadeEffectOptions {
  direction?: ScrollFadeDirection;
  value?: unknown;
}

const getScrollFadeMaskImage = (
  element: HTMLElement,
  direction: ScrollFadeDirection,
) => {
  const isVertical = direction === "vertical";
  const scrollPosition = isVertical ? element.scrollTop : element.scrollLeft;
  const clientSize = isVertical ? element.clientHeight : element.clientWidth;
  const scrollSize = isVertical ? element.scrollHeight : element.scrollWidth;

  const hasStartOverflow = scrollPosition > 1;
  const hasEndOverflow = scrollPosition + clientSize < scrollSize - 1;

  if (!hasStartOverflow && !hasEndOverflow) {
    return "";
  }

  const style = getComputedStyle(element);
  const paddingStart = parseFloat(
    isVertical ? style.paddingTop : style.paddingLeft,
  );
  const paddingEnd = parseFloat(
    isVertical ? style.paddingBottom : style.paddingRight,
  );

  return `linear-gradient(${isVertical ? "to bottom" : "to right"}, ${
    hasStartOverflow ? "transparent" : "black"
  } ${paddingStart}px, black ${paddingStart + SCROLL_FADE_SIZE}px, black calc(100% - ${
    paddingEnd + SCROLL_FADE_SIZE
  }px), ${hasEndOverflow ? "transparent" : "black"} calc(100% - ${paddingEnd}px))`;
};

export function useScrollFadeEffect<TElement extends HTMLElement>({
  direction = "horizontal",
  value,
}: UseScrollFadeEffectOptions = {}) {
  const scrollFadeRef = useRef<TElement>(null);

  useEffect(() => {
    const element = scrollFadeRef.current;

    if (!element) {
      return;
    }

    let animationFrameId = 0;

    const updateScrollFade = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const maskImage = getScrollFadeMaskImage(element, direction);

        element.style.setProperty("mask-image", maskImage);
        element.style.setProperty("-webkit-mask-image", maskImage);
      });
    };

    updateScrollFade();

    const observer = new ResizeObserver(updateScrollFade);
    observer.observe(element);
    element.addEventListener("scroll", updateScrollFade);
    element.addEventListener("input", updateScrollFade);
    element.addEventListener("keyup", updateScrollFade);
    element.addEventListener("mouseup", updateScrollFade);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      element.removeEventListener("scroll", updateScrollFade);
      element.removeEventListener("input", updateScrollFade);
      element.removeEventListener("keyup", updateScrollFade);
      element.removeEventListener("mouseup", updateScrollFade);
    };
  }, [direction, value]);

  return {
    scrollFadeRef,
  };
}
