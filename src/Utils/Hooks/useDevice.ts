//@ts-nocheck
import { createSignal } from "solid-js";

function checker() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android|tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return { isMobile, isTablet, isDesktop };
}

export default function useDevice() {
    let [mobile, setMobile] = createSignal(checker().isMobile);
    let [tablet, setTablet] = createSignal(checker().isTablet);
    let [desktop, setDesktop] = createSignal(checker().isDesktop); 
    window.addEventListener("resize", () => {
        const { isMobile, isTablet, isDesktop } =  checker();
        setMobile(isMobile);
        setTablet(isTablet);
        setDesktop(isDesktop);
    });
 
    return { mobile,tablet,desktop };
}
