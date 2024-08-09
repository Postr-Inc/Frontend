import { ErrorBoundary, Show } from "solid-js";
import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SideBarLeft } from "@/src/components/Navbars/Sidebars/left";
import { SideBarRight } from "@/src/components/Navbars/Sidebars/right";
import BottomNav from "@/src/components/Navbars/BottomNav";
import useTheme from "../Hooks/useTheme";
import { joinClass } from "../Joinclass";
import { api } from "@/src";
import CreatePostModal from "@/src/components/Modals/CreatePostModal";
export default function Page(props: { children: any , params: ()=> any, route: () => string, navigate: any, id: string }) { ; 
    return <ErrorBoundary fallback={
        <div class="flex justify-center items-center h-screen">
            <h1 class="text-3xl">Something went wrong</h1>
        </div>
    }>
         <div id={props.id} class={joinClass("relative xl:flex xl:w-[30rem]  md:w-[50vw]  xl:p-0  lg:flex   2xl:w-[64vw]    justify-center xl:mx-auto ")}>
         <Show when={props.route() !== "/auth/login" && props.route() !== "/auth/signup" && props.route() !== "/auth/forgot"}>
         <SideBarLeft {...{
             params: props.params,
             route: props.route,
             navigate: props.navigate,
        }} />
        </Show>
        
        <div class="flex flex-col  h-full w-full  ">
            
        {props.children}
        </div>

        <Show when={props.route() !== "/auth/login" && props.route() !== "/auth/signup" && props.route() !== "/auth/forgot"}>
        <SideBarRight {...{
             params: props.params,
             route: props.route,
             navigate: props.navigate,
        }} />
        </Show> 

        
       <BottomNav />
    </div>
    
    <CreatePostModal />
    </ErrorBoundary>
}