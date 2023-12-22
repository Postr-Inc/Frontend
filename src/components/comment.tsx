"use client";
import { useState } from "react";
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
}) {
  let [likes, setLikes] = useState(props.likes);

  async function likeComment() {
    switch (likes.includes(api.authStore.model().id)) {
      case true:
        console.log("unlike");
        setLikes(likes.filter((id: any) => id != api.authStore.model().id));
        await api.update({
          collection: "comments",
          id: props.id,
          record: {
            likes: likes.filter((id: any) => id != api.authStore.model().id),
          },
        });
        break;

      default:
        setLikes([...likes, api.authStore.model().id]);
        await api.update({
          collection: "comments",
          id: props.id,
          record: { likes: [...likes, api.authStore.model().id] },
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
      <div className="flex flex-col   gap-2 p-2 w-full     scroll">
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
            
              props.setParams({user: props.post?.expand.author})
              props.swapPage("user")
            }}
            className="opacity-50 font-semibold text-sm
            text-blue-500 underline cursor-pointer
            ">
              @{props.post?.expand.author.username}
            </p>
            {props.post?.expand.author.validVerified ? (
               <img src="/icons/verified.svg" alt="verified" width={20} height={20}></img>
            ) : null}
            <p>·</p>
            <p className="opacity-50 font-semibold text-sm"> {created()}</p>
            <div className="justify-between flex flex-row w-full absolut end-5">
              <div className="flex flex-row gap-5"></div>
              <details className="dropdown dropdown-left">
                <summary className="m-1 ">
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
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                  <li>
                    <a>Item 1</a>
                  </li>
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
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </div>
    </div>
  );
}
