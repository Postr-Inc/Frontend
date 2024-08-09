import { api } from "@/src";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { createSignal, For, Match, Switch } from "solid-js";
export function SideBarRight(props:  {
    params: any;
    route: any;
    navigate: any;
}) { 
    const { theme } = useTheme();
  
    const [RelevantPeople, setRelevantPeople] = createSignal([]) as any[]; 
    //@ts-ignore
    window.setRelevantPeople = setRelevantPeople;

    return (
      <>
        <div class="xl:drawer   xl:w-[auto] xl:drawer-end xl:drawer-open lg:drawer-open  mx-5   ">
          <input id="my-drawer-2" type="checkbox" class="drawer-toggle" /> 
          <div class="drawer-side">
            <label
              for="my-drawer-2"
              aria-label="close sidebar"
              class="drawer-overlay"
            ></label>
            <ul class="p-2   w-80  min-h-full gap-5 flex flex-col   text-base-content">
              {/* Sidebar content here */}
              <li>
                  <input type="text" class="w-full input input-ghost rounded-full input-bordered" placeholder="Search" />
              </li>
              <li class={`
                ${
                  theme() == 'dark' ? 'xl:border xl:border-[#121212]' : 'xl:border xl:border-[#ecececd8]'
                }  p-5 rounded-lg`}>
                <a class="w-full relative">
                  <h1 class="font-bold text-lg">Relevant People</h1>
                  <div class="flex flex-col gap-5">
                  <For each={RelevantPeople()} >
                    {(item) => (
                      <div class="flex flex-row gap-5">
                       <Switch fallback={<></>}>
                       <Match when={!item.avatar}>
                        <div class="w-10 h-10 border  text-center p-2 rounded">
                          {item.username.slice(0, 1).charAt(0).toUpperCase()}
                        </div>
                       </Match>
                       <Match when={item.avatar}>
                       <img
                          class="w-10 h-10 rounded"
                          src={api.cdn.getUrl("users", item.id, item.avatar)}
                          alt={item.username}
                        />
                        </Match>
                       </Switch>
                        <div class="flex flex-col">
                          <a class="font-bold">{item.username}</a> 
                          <p class="text-sm">@{item.username}</p>
                        </div>
                      </div>
                    )}
                  </For>
                  </div>
                </a>
              </li>
              <div class="flex flex-col gap-5 mt-2 p-2 text-sm">
                <li class="flex flex-row gap-5">
                  <a class="cursor-pointer hover:underline">
                    Terms of service
                  </a>
                  <a
                    href="/information/privacy.pdf"
                    class="cursor-pointer hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li class="flex flex-row gap-5">
                  <a href="" class="cursor-pointer hover:underline">
                    Help and safety
                  </a>
                  <a class="cursor-pointer hover:underline">Accessibility</a>
                </li>
                <li>
                  <div
                    class="tooltip cursor-pointer"
                    data-tip="Your app version"
                  >
                    pkg version:{" "}
                    {
                      // @ts-ignore
                      window?.postr?.version
                    }
                  </div>
                </li>
                <li>
                  <a>
                    © 2022 - {new Date().getFullYear()} Pascal. All rights
                    reserved
                  </a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </>
    );
  }