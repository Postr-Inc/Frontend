import { createEffect, createSignal, onCleanup } from "solid-js";

export default function useScrollingDirection() {
  const [scrollingDirection, setScrollingDirection] = createSignal("up");
  const [lastScroll, setLastScroll] = createSignal(0);
  const threshold = 10; // Adjust the threshold as needed

  createEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
          const currentScroll = window.scrollY;

          if (Math.abs(currentScroll - lastScroll()) > threshold) {
            if (currentScroll < lastScroll()) {
              setScrollingDirection("up");
            } else {
              setScrollingDirection("down");
            }
            setLastScroll(currentScroll);
          }

          isScrolling = false;
        }, 50); // Throttle the updates (50ms delay)
      }
    };

    window.addEventListener("scroll", handleScroll);

    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
    });
  });

  return { scrollingDirection };
}
