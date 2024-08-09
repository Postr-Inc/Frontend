import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass";
import { createEffect } from "solid-js";

export default function Modal( { children , id , className, bottom }: { children: any, bottom?: boolean,  id: string, className?: string }) {
    const { theme } = useTheme();
    createEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.getElementById(id)?.close();
            }
        });
        window.addEventListener("click", (e) => {
            if (e.target === document.getElementById(id)) {
                document.getElementById(id)?.close();
            }
        });
    });
    return (
        <dialog class={joinClass("modal   focus:outline-none",className, theme() == "light"  ? "bg-white" : "bg-[#121212]")} id={id}>
        <label  class="drawer-overlay" onClick={() => document.getElementById(id)?.close()}></label>
            {children}
        </dialog>
    )
}

export   function ModalContent({ children, className }: { children: any, className?: string }) {
    return (
        <div class={joinClass(className, "fixed top-0 left-0 ")}>
            {children}
        </div>
    )
}


Modal.Content = ModalContent;

export { Modal };