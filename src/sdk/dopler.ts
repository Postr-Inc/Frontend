class Dopler{
    constructor(strict = false){
        this.strict = strict
    }

    isDesktop: boolean = false;
    isMobile: boolean = false;

    checkDevice: Function = ()=>{
        let hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        let ua = navigator.userAgent.toLowerCase();
        let object = {
            devicePlatform: "unknown",
            isDesktop: false,
            isMobile: hasTouch ? true : false,
        }
 
         switch (true) {
            case /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua):
                object.devicePlatform = "mobile"
                object.isMobile = true;
                object.isDesktop = false;
                break;
            case /chrome|safari|firefox|msie|trident|edge|opera/i.test(ua):
                object.devicePlatform = "desktop"
                object.isMobile = false;
                object.isDesktop = true;
                break;
            default:
                object.devicePlatform = "unknown"
                object.isMobile = false;
                object.isDesktop = false;
                break;

         }
    }
}