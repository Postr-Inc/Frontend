"use client";
import { useEffect, useState } from "react";
import { api } from "../api/api";
export default function Comment(props: {
  id: string;
  text: string;
  deleteComment?: any;
  user: any;
  post: any;
  created: string;
  expand: any;
  swapPage?: any;
  setParams?: any;
  setComments?: any;
  comments?: any;
  likes: any;
  level: number;
  updateCache?: any;
  setComment?: any;
  comment?: any;
  mentions?: any;
  setMentions?: any;
  isUserReplyPage?: any;
}) {
  let [likes, setLikes] = useState([props.likes]);
  useEffect(() => {
    setLikes(likes.flat());
  }, []);
  async function likeComment() {
    switch (likes.includes(api.authStore.model().id)) {
      case true:
        console.log("unliking", likes);
        setLikes(likes.filter((id: any) => id != api.authStore.model().id));
        await api.update({
          collection: "comments",
          cacheKey: `comments-${props.id}`,
          id: props.id,
          record: {
            likes: likes.filter((id: any) => id != api.authStore.model().id),
          },
        });
        // up
        props.updateCache(props.id, {
          ...props,
          likes: likes.filter((id: any) => id != api.authStore.model().id),
        });
        break;

      default:
        setLikes([...likes, api.authStore.model().id]);
        await api.update({
          collection: "comments",
          cacheKey: `comments-${props.id}`,
          id: props.id,
          record: { likes: [...likes, api.authStore.model().id] },
        });
        props.updateCache(props.id, {
          ...props,
          likes: [...likes, api.authStore.model().id],
        });
        break;
    }
  }
  const created = () => {
    let date = new Date(props.created);
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
  return (
    <div
      className={`flex flex-col w-full  
     ${props.level == 2 ? "p-5" : ""} 
    `}
    >
      <div className="flex flex-col relative  gap-2 p-2 w-full  ">
        <div className="flex flex-row">
          <img
            src={api.cdn.url({
              id: props.user?.id,
              collection: "users",
              file: props.user?.avatar,
            })}
            alt="profile"
            className="rounded object-cover w-12 h-12 cursor-pointer"
          ></img>
          <div className="flex h-0 mt-2 mx-2 gap-2 hero ">
            <p>{props.user?.username}</p>
            <p
              onClick={() => {
                props.setParams({ user: props.post?.expand.author });
                props.swapPage("user");
              }}
              className="  text-sm opacity-60
              cursor-pointer sm:hidden
            "
            >
              @{props.expand.user.username}
            </p>
            {likes.includes(props.post.expand.author.id) ? (
              <div className="flex  flex-row gap-2 p-2 text-sm">
                <div className="hero flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.2}
                    stroke="currentColor"
                    className={`w-4 h-4 fill-rose-500 stroke-rose-500`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  by{" "}
                  {props.post.author == api.authStore.model().id
                    ? "you"
                    : props.post.expand.author.username}
                </div>
              </div>
            ) : null}
            {props.expand.user.validVerified ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 fill-blue-500 text-white h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                ></path>
              </svg>
            ) : null}
            <p>·</p>
            <p className="opacity-50 font-semibold text-sm"> {created()}</p>
            <div className="justify-between flex flex-row w-full  absolute end-0">
              <div className="flex flex-row gap-5"></div>
              <details className="dropdown dropdown-left">
                <summary className="m-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                  {props.user.id == api.authStore.model().id ? (
                    <li>
                      <a onClick={props.deleteComment}>Delete</a>
                    </li>
                  ) : null}
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </details>
            </div>
          </div>
        </div>
        <p className=" overflow-hidden break-words ">{props.text}</p>
      </div>
      <div className="flex flex-row gap-5 p-2">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`
          hover:bg-rose-500 hover:rounded-full hover:bg-opacity-20   hover:p-2 hover:text-[#f57288]
          focus:bg-rose-500 focus:rounded-full focus:bg-opacity-20   focus:p-2 focus:text-[#f57288]
           w-6 h-6 cursor-pointer ${
             likes.includes(api.authStore.model().id)
               ? "fill-rose-500 text-rose-500"
               : "  text-gray"
           }
          `}
            onClick={likeComment}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          ></path>
        </svg>
      </div>
      {
        !props.isUserReplyPage ?  <p
        onClick={() => {
          props.setComment(props?.comment + `@${props.user.username} `);
          props.setMentions([...props?.mentions, props.user.username]);
        }}
        className="mx-2 text-sm"
      >
        Reply
      </p>
      : ""
      }
    </div>
  );
}
