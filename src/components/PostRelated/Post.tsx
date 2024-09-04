import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/src";
import usePost from "@/src/Utils/Hooks/usePost";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { joinClass } from "@/src/Utils/Joinclass";
import { For, Match, Show, Switch } from "solid-js";
import Heart from "../Icons/heart";
import Dropdown, { DropdownHeader, DropdownItem } from "../UI/UX/dropdown";
import Carousel, { CarouselItem } from "../UI/UX/Carousel";
import StringJoin from "@/src/Utils/StringJoin";
import { A } from "@solidjs/router";
import Verified from "../Icons/Verified";
import Bookmark from "../Icons/Bookmark";
import Share from "../Icons/Share";
const created = (created: any) => {
  let date = new Date(created);
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let seconds = diff / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let weeks = days / 7;
  let months = weeks / 4;
  let years = months / 12;
  switch (true) {
    case seconds < 60:
      return `${Math.floor(seconds)}s`;
      break;
    case minutes < 60:
      return `${Math.floor(minutes)}m`;
      break;
    case hours < 24:
      return `${Math.floor(hours)}h`;
      break;
    case days < 7:
      return `${Math.floor(days)}d`;
      break;
    case weeks < 4:
      return `${Math.floor(weeks)}w`;
      break;
    case months < 12:
      return `${Math.floor(months)}mo`;
      break;
    case years > 1:
      return `${Math.floor(years)}y`;
      break;
    default:
      break;
  }
};
type Props = {
  author?: string | any;
  id?: string | any;
  content?: string;
  created?: Date;
  updated?: Date;
  expand?: { [key: string]: any } | any;
  comments?: string[];
  file?: string[]; 
  isRepost?: boolean;
  disabled?: boolean;
  isComment?: boolean;
  [key: string]: any;
};

export default function Post(props: Props) {
  console.log(props);
  let { theme } = useTheme();
  let { likes, updateLikes, comments } = usePost(props);

  api.collection("posts").subscribe(props.id, {
    cb: (data: any) => {
       console.log(data);
    },
  })
  
  return (
    <Card
      class={joinClass( 
   theme() === "dark"
        ? "bg-black text-white border-[#1c1c1c]  "
        : "  border-gray-200 border   ",
       theme() === "dark" && !props.page ? "hover:bg-[#121212]" : theme() === "light" && !props.page ? "hover:bg-[#faf9f9]" : "",
      "z-10  relative",  
        "p-1 text-md shadow-none ",
        props.disabled
          ? "rounded "
          : `   rounded-none shadow-none${
              theme() === "dark" && !props.page ? "hover:bg-[#121212]" : theme() === "light" && !props.page ? "hover:bg-[#faf9f9]" : ""
            }`
      )}
    >
      <CardHeader class="flex p-[0.3rem]   mt-2 flex-row gap-3 space-y-0  relative ">
        <Switch fallback={<></>}>
          <Match when={!props.expand.author.avatar}>
            <div
              class={joinClass(
                "w-10 h-10  text-center p-2 rounded ",
                theme() === "dark"
                  ? "bg-[#121212] text-white"
                  : "bg-[#e2e1e1] text-black"
              )}
            >
              {props.expand.author.username.slice(0, 1).charAt(0).toUpperCase()}
            </div>
          </Match>
          
          <Match when={props.expand.author.avatar}>
            <img
              src={api.cdn.getUrl(
                "users",
                props.author,
                props.expand.author.avatar
              )}
              alt={props.author}
              class="w-10 h-10 rounded object-cover"
            />
          </Match>
        </Switch>
        
         
         <div class="flex gap-2">
        <div class="flex">
        <CardTitle
          class="cursor-pointer items-center gap-5 "
          onClick={() => props.navigate(StringJoin("/u/", props.expand.author.username))}
        >
          {props.expand.author.username}
        </CardTitle>
        <Show when={props.expand.author.validVerified}>
          <Verified class="w-5  h-5 mx-1 text-blue-500 fill-blue-500 stroke-white " />
        </Show>
        </div>
        <CardTitle class="text-sm opacity-50"> @{props.expand.author.username}</CardTitle>
        <CardTitle class="text-sm opacity-50">·</CardTitle>
        <CardTitle class="text-sm opacity-50">{created(props.created)}</CardTitle>
         </div>
       
        
        <Show when={!props.disabled}>
          <CardTitle class="absolute right-5">
            <Dropdown direction="left" point="start">
              <DropdownHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 " 
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </DropdownHeader>
              <DropdownItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>

                <p class="font-bold"> Embed Post</p>
              </DropdownItem>
              <DropdownItem>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>

                <p class="font-bold"> Block @{props.expand.author.username}</p>
              </DropdownItem>
              <DropdownItem>
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
              <p class="font-bold w-full"> View Post Engagement </p>
              </DropdownItem>
            </Dropdown>
          </CardTitle>
        </Show>
      </CardHeader>
      <CardContent class="p-1 cursor-pointer">
        <A href={StringJoin("/view/", "post/", props.id,
          props.isComment ? "?comment=true" : ""
        )} class="z-[99999]">
        {props.content}
        </A>
      </CardContent>
      <Show when={props.files && props.files.length > 0}>
      
      <CardContent class="p-1   h-[300px]">
        
        <Carousel >
        <For each={props.files} fallback={<></>}>
          {(item) => (
             <CarouselItem>
              <img
              src={api.cdn.getUrl("posts", props.id, item)}
              class={joinClass(
                "w-full h-[400px]  object-cover rounded-xl",
                "cursor-pointer",
                theme() === "dark"
                  ? "border-[#121212] border"
                  : "border-[#cacaca] border"
              )}
            />
             </CarouselItem>
          )}
        </For>
        </Carousel>
      </CardContent>
      </Show>
       
      {/**
       * @search - repost section
       */}
      <CardContent class="p-1">
        
        <Show when={props.isRepost}>
          <Post  
           author={props.expand.repost.author}
           id={props.expand.repost.id}
           content={props.expand.repost.content}
           disabled={true}
           created={props.expand.repost.created}
           updated={props.expand.repost.updated}
           expand={props.expand.repost.expand}
           comments={props.expand.repost.comments}
           files={props.expand.repost.files}
          />
        </Show>
      </CardContent>

      {/**
       * @search - footer section
       */}
      <Show when={!props.disabled}>
        <CardFooter class="p-1 flex gap-3 relative items-start">
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              onClick={() => updateLikes(props.expand.author.id, props.isComment)}
              class={joinClass(
                "w-6 h- cursor-pointer",
                likes().includes(props.expand.author.id)
                  ? "fill-red-500 stroke-red-500"
                  : ""
              )}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span class="countdown">  <span style={{"--value": Math.abs(likes().length)}}></span></span> 
          </div>
          <div class="flex items-center gap-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 cursor-pointer"
              onClick={() => props.navigate(StringJoin("/view/", "post/", props.id))}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
              />
            </svg>
            {comments() && comments().length}
          </div>
          <div class="flex hero gap-2">
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
            {props.views && props.views.length || 0}
          </div>
          <div class="flex absolute right-5 gap-5">
            <Bookmark class="w-6 h-6" />
            <Share class="w-6 h-6" />
          </div>
        </CardFooter>
      </Show>
    </Card>
  );
}
