import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass";
import useScrollingDirection from "@/src/Utils/Hooks/useScrollingDirection";
import Home from "../Icons/Home";
import Search from "../Icons/search";
import useNavigation from "@/src/Utils/Hooks/useNavigation";
import Heart from "../Icons/heart";
import Mail from "../Icons/Mail";
import Scissors from "../Icons/Scissors";

export default function BottomNav(){
    const { theme } = useTheme();
    const { route } = useNavigation()
    const { scrollingDirection } = useScrollingDirection();
    return (
        <div class={joinClass("fixed bottom-0 w-full", scrollingDirection() == "up" ? "backdrop-blur-lg" : "backdrop-blur-0 opacity-50", "xl:hidden lg:hidden 2xl:hidden")}>
            <ul class={joinClass(" flex justify-between p-5   h-full bg[#121212]   border border-l-0 border-b-0 border-r-0", theme() === "dark"  ? "text-white fill-white stroke-white border-t-[#53535322]" : "bg-white border-t-[#e0e0e0]")}>
                <li class="flex ">
                    <Home class={joinClass("w-7 h-7", route() == "/" ? theme() == "dark" ? "fill-white" : "fill-black" : "opacity-50")} />
                </li>
                <li>
                    <Search class={joinClass("w-7 h-7", route() === "/explore" ?  theme() == "dark" ? "fill-white" : "fill-black" : "opacity-50")} />
                </li>
                <li>
                    <Mail class={joinClass("w-7 h-7", route() === "/messages" ?  theme() == "dark" ? "fill-white" : "fill-black" : "opacity-50")} />
                </li>
                <li>
                    <Heart class={joinClass("w-7 h-7", route() === "/notifications" ? theme() == "dark" ? "fill-white" : "fill-black" : "opacity-50")} />
                </li>
                <li>
                    <Scissors class={joinClass("w-7 h-7", route() === "/create" ? theme() == "dark" ? "fill-white" : "fill-black" : "opacity-50")} />
                </li>
            </ul>
        </div>
    )
}