import { createEffect, createSignal, onCleanup } from "solid-js";
export default function useScrollingDirection() {
    const [scrollingDirection, setScrollingDirection] = createSignal("up"); 
    const [lastScroll, setLastScroll] = createSignal(0);
    createEffect(() => { 
        window.addEventListener("scroll", (e) => {
          if (window.scrollY < lastScroll()) {
            setScrollingDirection("up");
          } else {
            setScrollingDirection("down");
          } 
            setLastScroll(window.scrollY);
        });
        onCleanup(() => { window.removeEventListener("scroll", () => {}); });
      })
    return { scrollingDirection };
}