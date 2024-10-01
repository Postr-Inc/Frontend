//@ts-nocheck
import { api } from "@/src";
import ArrowLeft from "@/src/components/Icons/ArrowLeft";
import LoadingIndicator from "@/src/components/Icons/loading";
import Media from "@/src/components/Icons/Media";
import Post from "@/src/components/PostRelated/Post"; 
import useDevice from "@/src/Utils/Hooks/useDevice";
import useNavigation from "@/src/Utils/Hooks/useNavigation";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass"; 
import Page from "@/src/Utils/Shared/Page"; 
import { Index } from "solid-js"
 
 
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createSignal, Match, onMount, Show, Switch, For } from "solid-js";
import Carousel, {  CarouselItem } from "@/src/components/UI/UX/Carousel";
export default function View(props: any) {
  var { route, params, searchParams, navigate, goBack } = useNavigation(
    "/view/:collection/:id"
  );
  let { id, collection } = useParams();
  const [isReplying, setIsReplying] = createSignal(false);
  let [post, setPost] = createSignal<any>(null, { equals: false });
  let [comments, setComments] = createSignal<any[]>([]);
   
  let [comment, setComment] = createSignal<any>({
    content: "",
    media: [],
    likes:[],
    author: api.authStore.model.id,  
    ...(collection === "comments" ? { mainComment: id } : {  post: id }),
  });
 
  // Ensure auth check on every render
  if (!api.authStore.isValid()) navigate("/auth/login", null);

  let { mobile } = useDevice();

  function createComment() {  
    
    Object.assign(post().expand, { comments: post().expand.comments || []  }); 
    api.collection("comments").create(comment(), {
      expand: ["author"],
    }).then((data : any) => {
      let author = api.authStore.model;
      delete author.token
      delete author.email;
      Object.assign(data, {expand: { author: api.authStore.model }}); 
      if(post().expand.comments){
        post().expand.comments.push(data);
      }
      post().comments.push(data?.id); 
      if(!post().expand.comments.find((c: any) => c.id === data.id)){
        post().expand.comments.push(data);
      } 
      let Updatedata = { 
        comments: post().comments,
        expand: {
          comments: post().expand.comments,
          ...post().expand
        }
      }
      setPost({
        ...Updatedata,
        ...post(),
      });
      setComment({ content: "", media: [], author: api.authStore.model.id, post: null });
      api.collection(collection === "comments" ? "comments" : "posts").update(post().id, Updatedata).then((data) => {
        console.log(data);
      });
    })
  }

  function fetchP() {
    let { params } = useNavigation("/view/:collection/:id");
    let { id, collection } = params();
    console.log({ id, collection });
    setPost(null);
    api
      .collection(collection)
      .get(id, {
        cacheKey: `post-${id}`,
        expand: [
          "comments",
          "comments.likes",
          "comments.author",
          "author",
          "likes",
          "repost",
          "repost.likes",
          "repost.author",
        ],
      })
      .then((data) => { 
        setPost(data);
      })
      .catch((err) => {
        console.log(err);
      });


      api.collection("comments").list(1, 10, {
        filter:  collection === "comments" ? `mainComment="${id}"` : `post="${id}"`,
        expand: ["author", "likes", "comments"],
        cacheKey: `${collection}-${id}-comments`,
      }).then((data) => {  
        setComments(data.items);
      });
  }

  // CreateEffect to trigger refetching when the `id` changes
  createEffect(() => {
    window.addEventListener("popstate", fetchP);
    fetchP();
  }, params()); // Depend on the `id` parameter

  let { theme } = useTheme();

  return (
    <Page {...{ params: useParams, route, navigate: props.navigate }} id={id}>
      <div class={joinClass("flex flex-col w-full   ", theme() === "dark" ? "border border-[#1c1c1c]" : "border")}>
        <div class="flex flex-row gap-5 p-2">
          <ArrowLeft class="w-6 h-6 cursor-pointer" onClick={() => goBack()} stroke-width="2" fill={theme() === "dark" ? "#fff" : "#000"} />
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
          <div class="flex flex-row gap-5 p-5 mt-2 border border-[#f3f3f3] border-b-0 border-r-0 border-l-0">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              class={joinClass(
                "cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20 size-6 hover:p-2 hover:text-sky-500",
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
        <div class={joinClass(post() && post().comments.length < 1 && "mb-[120px]", "relative border-l-0 border-r-0 p-3 sm:hidden", theme() === "dark" ? "border border-[#1c1c1c]" : "border border-[#dadada]")}>
          <div class="flex flex-row gap-5">
            <Show when={api.authStore.model.avatar}>
              <img
                src={api.cdn.getUrl("users", api.authStore.model.id, api.authStore.model.avatar)}
                class="w-10 h-10 rounded-full"
                alt="logo"
              />
            </Show>
            <Show when={!api.authStore.model.avatar}>
              <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {api.authStore.model.username[0].toUpperCase()}
              </div>
            </Show>
            <div
              onClick={(e) => {
                e.currentTarget.querySelector("p").focus();
                e.currentTarget.querySelector("p").innerText = "";  
              }}
              contentEditable="true"
              class="input border-none focus:outline-none p-2 w-full"
              onInput={(e) => {
                if (e.currentTarget.textContent.length > 0) {
                  setIsReplying(true);
                } else {
                  setIsReplying(false);
                  e.currentTarget.innerText = `Reply to ${post() && post().expand.author.username}`;
                }
                setComment({ ...comment(), content: e.currentTarget.textContent });
              }}
            >
              <p>Reply to {post() && post().expand.author.username}</p>
            </div>
          </div>
          {isReplying() && (
            <div class="relative flex p-2">
              <input type="file" id="media" class="hidden" accept="image/*,video/*" multiple onChange={(e) => setComment({ ...comment(), media: e.target.files })} />
              <label for="media" class="cursor-pointer">



                <Media class="w-6 h-6 cursor-pointer mb-5 mt-2" />
              </label>
              <button 
               onClick={createComment}
               class={joinClass("btn btn-sm rounded-full right-0 absolute mb-5 mt-2", theme() === "dark" ? "bg-white text-black hover:bg-black" : "bg-black text-white")}>
                Post
              </button>
            </div>
          )}
          <Show when={comment() && comment().media}>
            <Carousel class="h-[200px]" >
              <For each={comment() && comment().media}>
                {(file, index) => (
                  <CarouselItem 
                  showDelete={true}
                  id={index()} 
                  onDelete={() =>  {
                     if("media" in comment()){
                       // media is a file list
                       let media = comment().media;
                       media = Array.from(media);
                       media.splice(index(), 1);
                       setComment({ ...comment(), media: media });
                     }
                  }}>
                    <img src={URL.createObjectURL(file)} class="w-full h-full object-cover" />
                  </CarouselItem>
                )}
              </For>
            </Carousel>
          </Show>
        </div>
        <div>
          <For each={comments()}>
            {(comment, index) => (
              <Post {...{ ...comment, page: route(), navigate, isComment: true }} />
            )}
          </For>
        </div>
      </div>
    </Page>
  );
}
