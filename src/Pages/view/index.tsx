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
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
export default function View(props: any) {
  let { route, params, navigate, goBack } = useNavigation(
    "/view/:collection/:id"
  );
  let { id, collection } = params();
  let [post, setPost] = createSignal<any>(null);
  if (!api.authStore.isValid()) navigate("/auth/login", null);
  let {  mobile } = useDevice();
  switch (collection) {
    case "post":
      console.log("Post");
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
      break;
  }
 
  let { theme } =  useTheme();
  return (
    <Page {...{ params: useParams, route, navigate: props.navigate }} id="view">
      <div class={joinClass("flex flex-col w-full h-full", theme() === "dark" ? "border border-[#1c1c1c]" : "border")}>
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
            <Post {...{ ...post(), page: route() }} />
          </Match>
        </Switch>
      </div>
      <Show when={post() && post().author === api.authStore.model.id}>
        <div class="flex flex-row gap-5 p-2">
          View Post Engagements
        </div>
      </Show>
      <div class={joinClass(post() && post().comments.length < 1  && "mb-[120px]", "   border-t-0  border-l-0 border-r-0 p-3 sm:hidden ", theme()  === "dark" ? "border border-[#1c1c1c]" : "border" )}>
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
