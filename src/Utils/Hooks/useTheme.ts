import { createSignal } from "solid-js";

export default function useTheme() {
    const [theme, setTheme] = createSignal(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); 
    const toggleTheme = () => {
        setTheme(theme() === "dark" ? "light" : "dark");
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        setTheme(e.matches ? "dark" : "light");
    });
    return { theme, toggleTheme }
}