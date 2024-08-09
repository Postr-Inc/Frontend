import { api } from "@/src";
import ArrowLeft from "@/src/components/Icons/ArrowLeft";
import LoadingIndicator from "@/src/components/Icons/loading";
import Post from "@/src/components/PostRelated/Post";
import useDevice from "@/src/Utils/Hooks/useDevice";
import useNavigation from "@/src/Utils/Hooks/useNavigation";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass";

import Page from "@/src/Utils/Shared/Page";
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createSignal, Match, onMount, Show, Switch } from "solid-js";
export default function View(props: any) {
  let { route, params, navigate, goBack } = useNavigation(
    "/view/:collection/:id"
  );
  let { id, collection } = useParams()
  console.log(params())
  let [post, setPost] = createSignal<any>(null);
  if (!api.authStore.isValid()) navigate("/auth/login", null);
  let {  mobile } = useDevice();
  
  onMount(()=>{
    api
    .collection("posts")
    .get(id, {
      expand: [
        "comments",
        "comments.likes",
        "author",
        "likes",
        "repost",
        "repost.likes",
        "repost.author",
      ],
    })
    .then((data) => {
      console.log(data);
      setPost(data);
    })
    .catch((err) => {
      console.log(err);
    });
  })
  
 
  let { theme } =  useTheme();
  return (
    <Page {...{ params: useParams, route, navigate: props.navigate }} id="view">
      <div class={joinClass("flex flex-col w-full h-full h-screen", theme() === "dark" ? "border border-[#1c1c1c]" : "border")}>
      <div class="flex flex-row gap-5 p-2">
        <ArrowLeft class="w-6 h-6 cursor-pointer"  onClick={() => goBack()} stroke-width="2"  fill={theme() === "dark" ? "#fff" : "#000"} />
        <h1 class="font-bold">Post</h1>
      </div>
      <div class="flex flex-col">
        <Switch fallback={<div>Something went wrong</div>}>
          <Match when={post() === null}>
            <LoadingIndicator />
          </Match>
          <Match when={post() !== null}>
            <Post {...{ ...post(), page: route(), navigate }} />
          </Match>
        </Switch>
      </div>
      <Show when={post() && post().author === api.authStore.model.id}>
        <div class="flex flex-row gap-5 p-5 mt-2 border  border-[#f3f3f3] boder-b-0 border-r-0 border-l-0">
        <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              class={joinClass(
                "cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20  size-6 hover:p-2 hover:text-sky-500 ",
                theme() === "dark" ? "fill-white" : "fill-black"
              )}
            >
              <g>
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
              </g>
            </svg>
            View Post Engagements
        </div>
      </Show>
      <div class={joinClass(post() && post().comments.length < 1  && "mb-[120px]", "     border-l-0 border-r-0 p-3 sm:hidden ", theme()  === "dark" ? "border border-[#1c1c1c]" : " border border-[#f3f3f3]" )}>
        <div class="flex flex-row gap-5">
          <img
            src={api.cdn.getUrl(
              "users",
              api.authStore.model.id,
              api.authStore.model.avatar
            )}
            class="w-10 h-10 rounded-full"
            alt="logo"
          />
          <p>Post your reply</p>
        </div>
      </div>
       <Show when={mobile()}>
        <div class="fixed bottom-0 w-full">
          peeeee
        </div>
      </Show>
      </div>
      
    </Page>
  );
}
