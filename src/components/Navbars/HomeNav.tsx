import useTheme from "../../Utils/Hooks/useTheme";
import { api } from "../..";
import { joinClass } from "@/src/Utils/Joinclass";
import { Accessor, Show } from "solid-js";
import logo from "@/src/assets/icon_transparent.png";
import { createSignal, createEffect } from "solid-js";
import useScrollingDirection from "@/src/Utils/Hooks/useScrollingDirection";
import useDevice from "@/src/Utils/Hooks/useDevice";
import { Portal } from "solid-js/web";
export default function HomeNav({
  navigate,
  page,
  swapFeed,
}: {
  navigate: any;
  page: Accessor<string>;
  swapFeed: any;
}) {
  const { theme } = useTheme();
  let { scrollingDirection } = useScrollingDirection();
  let { mobile } = useDevice();

  console.log(mobile() && scrollingDirection() === "up");
  return (
    <div
      class={joinClass(
        " flex flex-col sticky top-0  sm:p-0  z-[9999]",
        theme() === "dark"
          ? "bg-black z-[99999] text-white  border-[#121212] border-2 border-b-none "
          : "bg-white  border   border-[#e0e0e0] bg-opacity-75 bg-white ",
        " backdrop-blur-sm ", 
        mobile() && scrollingDirection() === "up" ? "slide-up-active slide-up  " :  mobile()  ? "slide-up" : ""
      )}
    >  
      <div class="flex flex-row hero p-2">
      <Show when={mobile()}>
       <div class={joinClass("rounded-full border-base-200")}>
          <img src={api.cdn.getUrl("users", api.authStore.model.id, api.authStore.model.avatar)} class="w-10 h-10 rounded" alt="logo" />
        </div> 
       </Show>
       <Show when={mobile()}>
         <div class={joinClass("flex justify-center w-full")}>
          <img src={logo} class="w-12 h-12 rounded" alt="logo" /> 
         </div>
       </Show>
      </div> 
      <div class={joinClass("flex hero sm:p-3 xl:p-2    text-sm   xl:mt-0 justify-evenly ", )}>
        <div class="flex flex-col">
          <p
            class={joinClass("cursor-pointer", page() !== "recommended" ? "text-gray-500" : "")}
            onClick={() => {
              swapFeed("recommended", 0);
            }}
          >
            Recommended
          </p>
          {page() === "recommended" ? (
            <div class=" rounded-full   h-1 bg-blue-500"></div>
          ) : (
            ""
          )}
        </div>
        <div class="flex flex-col text-sm">
          <p
            class={joinClass("cursor-pointer", page() !== "following" ? "text-gray-500" : "")}
            onClick={() => {
              swapFeed("following", 0);
            }}
          >
            Following
          </p>
          {page() === "following" ? (
            <div class=" rounded-full   h-1 bg-blue-500"></div>
          ) : (
            ""
          )}
        </div>

        
      </div>
    </div>
  );
}
