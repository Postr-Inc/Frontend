import { createSignal, For } from "solid-js";
import useTheme from "../../Utils/Hooks/useTheme";
import { api } from "@/src";
import { joinClass } from "@/src/Utils/Joinclass";
import { Portal, Show, Switch, Match } from "solid-js/web";
import Post from "../PostRelated/Post";
import Media from "../Icons/Media";
import Dropdown, { DropdownHeader } from "../UI/UX/dropdown";
import World from "../Icons/World";
import Users from "../Icons/Users";
export default function CreatePostModal() {
  const { theme } = useTheme();
  let [params, setParams] = createSignal<any>(null);
  const [toNextSection, setToNextSection] = createSignal(false);
  let [postData, setPostData] = createSignal<any>({
    content: "",
    links: [],
    tags: [],
    files: [],
    isRepost: false,
    isPoll: false,
    whoCanSee: "everyone",
  });
  //@ts-ignore
  window.setParams = (params: any) => {
    setParams(params);
  };
  return (
    <dialog id="createPostModal" class="modal z-[-1]">
      <div class="modal-box scroll p-3 z-[-1] overflow-hidden">
        <div class="flex flex-row justify-between  ">
          <button
            class="btn btn-sm btn-circle btn-ghost  "
            onClick={() => document.getElementById("createPostModal")?.close()}
          >
            ✕
          </button>
          <p
            onClick={() => {
              if (!toNextSection()) setToNextSection(true);
              else setToNextSection(false);
            }}
            class="text-blue-500 btn btn-sm rounded-full"
          >
            {!toNextSection() ? "Continue" : "Back"}
          </p>
        </div>
        <Show when={!toNextSection()}>
          <div class="flex flex-row mt-5">
            <img
              src={api.cdn.getUrl(
                "users",
                api.authStore.model.id,
                api.authStore.model.avatar
              )}
              class="w-10 h-10 rounded-full"
              alt="logo"
            />
            <textarea
              class={joinClass(
                "w-full h-32 p-2 rounded-lg resize-none outline-none scroll",
                theme() === "dark" ? "bg-black text-white" : "bg-white"
              )}
              placeholder="What's on your mind?"
              onInput={(e: any) => {
                setPostData({ ...postData(), content: e.target.value });
              }}
              value={postData().content}
            ></textarea>
            <For each={postData().files}>
              {(item) => {
                console.log(item);
                return <img src=""></img>;
              }}
            </For>

            <Show when={postData().isRepost}>
              <Post {...postData().repost} />
            </Show>
          </div>
          <div class="divider  rounded-full h-1"></div>
          <div class="flex flex-row justify-between ">
            <input type="file" hidden id="files" onChange={(file: any)=> setPostData({...postData(), files: postData().files.push(file.target.files)})} />
            <label for="files">
              <Media class="w-6 h-6 cursor-pointer" />
            </label>
          </div>
        </Show>
        <Show when={toNextSection()}>
          <div class="flex flex-col">
            <p>Set visibility</p>
          </div>
        </Show>
      </div>
    </dialog>
  );
}
