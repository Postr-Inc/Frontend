"use client";
import { useEffect, useState, useRef } from "react";
import Modal from "./Modal";
import BottomModal from "./Bottomupmodal"; 
import CommentModal from "./modals/CommentModal";
import { DeleteModal } from "./modals/DeletePost";
import { LazyImage } from "./Image";
import Bookmark from "./icons/bookmark";
import { api } from "../api/api";
import Repost from "./icons/repost";

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

 

export default function Post(props: any) {
  let [likes, setLikes] = useState(props.likes);
  let [comments, setComments] = useState(props.expand?.comments || []);
  let [comment, setComment] = useState("");
  let [refresh, setRefresh] = useState(false);
  let [bookmarked, setBookmarked] = useState(
    api.authStore.model().bookmarks.includes(props.id) ? true : false
  );
  let hasInitialized = useRef(false);

  async function handleLike() {
    switch (likes.includes(api.authStore.model().id)) {
      case true:
        setLikes(likes.filter((id: any) => id != api.authStore.model().id));
        await api.update({
          collection: "posts",
          cacheKey: props.cacheKey,
          expand: ["author", "likes", "comments", "comments.user"],
          id: props.id,
          record: {
            likes: likes.filter((id: any) => id != api.authStore.model().id),
          },
        });

        break;

      default:
        setLikes([...likes, api.authStore.model().id]);
        await api.update({
          collection: "posts",
          cacheKey: props.cacheKey,
          expand: ["author", "likes", "comments", "comments.user"],
          id: props.id,
          record: { likes: [...likes, api.authStore.model().id] },
        });

        break;
    }
  }

  return (
    <div
      key={props.id}
      id={props.id}
      className={`xl:mt-0 w-full h-fit  relative  xl:p-3 
        ${
          theme == 'dark' ? 'text-white' : 'text-black'
        }
        ${
          props.currentPage == 'view' ? 'p-2 xl:p-0' : ''
        }
        xl:mb-0 mb-6
        ${props.isLast ? "mb-[7rem]" : ""}
        ${
          props.page !== "user" &&
          props.page !== "bookmarks" &&
          props.page !== "home"
            ? "xl:p-5  "
            : props.page == "home"
            ? "xl:p-5  "
            : ""
        }`}
    >
      {props.pinned &&
      props.page == "user" &&
      props.params.user == props.author ? (
        <div className="flex hero   gap-5 mb-5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`w-4 h-4
              ${
                theme == 'dark' ? 'fill-white' : 'fill-black'
              }
        `}
          >
            <g>
              <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z"></path>
            </g>
          </svg>
          Pinned
        </div>
      ) : (
        ""
      )}
      <div className="flex   justify-between">
        <CommentModal
          id={props.id + "comments"}
          comments={comments}
          post={props}
          setComments={setComments}
          cacheKey={props.cacheKey}
          setParams={props.setParams}
          swapPage={props.swapPage}
          updateCache={props.updateCache}
        ></CommentModal>
        <div className="flex flex-row  gap-2   ">
          {props.expand?.author.avatar ? (
            <img
              onClick={() => {
                props.setParams({ user: props.author });
                props.swapPage("user");
              }}
              src={api.cdn.url({
                collection: "users",
                file: props.expand.author?.avatar,
                id: props.expand.author?.id,
              })}
              alt="profile"
              className="rounded object-cover w-12 h-12 cursor-pointer"
            ></img>
          ) : (
            <div className="avatar placeholder">
              <div
                onClick={() => {
                  props.setParams({ user: props.author });
                  props.swapPage("user");
                }}
                className="bg-base-200 text-black rounded w-12 h-12 avatar cursor-pointer   "
              >
                <span className="text-2xl">
                  {props.expand.author?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col   heros">
            <div className="flex flex-row h-0 mt-2 gap-2 hero">
              <p
                onClick={() => {
                  props.setParams({ user: props.author });
                  props.swapPage("user");
                }}
              >
                <span className="capitalize font-bold cursor-pointer">
                  {props.expand.author?.username}
                </span>
              </p>
              <p
                className="hover:underline opacity-50 text-sm md:hidden sm:hidden
              "
              >
                @{props.expand.author?.username}
              </p>
              {props.expand.author?.validVerified ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 fill-blue-500 text-white h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              ) : (
                ""
              )}
              {props.expand.author?.isDeveloper ? (
                <div
                  className="tooltip    rounded tooltip-left"
                  data-tip="Postr Developer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4   h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}
              {props.expand.author?.postr_plus ? (
                <div
                  className="tooltip tooltip-middle cursor-pointer"
                  data-tip={`Subscriber since ${new Date(
                    props.expand.author?.plus_subscriber_since
                  ).toLocaleDateString()}`}
                >
                  <span className="badge badge-outline badge-sm rounded-full  border-blue-500 z-[-1] text-sky-500">
                    Postr+ Sub
                  </span>
                </div>
              ) : (
                ""
              )}
              ·<span className="text-sm">{created(props.created)}</span>
              <div className="flex gap-2   absolute end-2 ">
                <div className="dropdown dropdown-left">
                  <div tabIndex={0} role="button" className="m-1">
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
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    style={{borderRadius: '10px',
                      border: theme == 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
                    }}
                    className="dropdown-content menu bg-base-100 rounded-box font-bold z-[1] w-64 p-2 shadow-xl"
                  >
                     {props.expand?.author &&
                    props.expand.author.id == api.authStore.model().id ? (
                      <li>
                        <a 
                          className="text-red-500 flex hero gap-2"
                          onClick={() => {
                            //@ts-ignore
                            document
                              .getElementById(props.id + "delete")
                              ?.showModal();
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

                          Delete
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                     
                    <li>
                      <a
                        className="hero flex gap-2"
                        onClick={() => {
                          document
                            .getElementById(props.id + "embed")
                            ?.showModal();
                        }}
                      >
                        <svg 
                        className="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
</svg>

                        Embed Post
                      </a>
                      
                    </li>
                     {
                      props.expand?.author &&
                      props.expand.author.id !== api.authStore.model().id && 
                      <li>
                        {
                          !api.authStore.model().blocked.includes(props.author) ? (
                            <a className="hero flex gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
</svg>

                              Block @{props.expand?.author?.username}
                            </a>
                          ) : (
                            <a className="hero flex gap-2"> 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
</svg>

                              Unblock @{props.expand?.author?.username}
                            </a>
                          )
                        }
                      </li>
                     }
                     <li>
                      <a className="hero flex gap-2">
                      <svg viewBox="0 0 24 24" aria-hidden="true" 
                      fill="currentColor"
                      className="cursor-pointer   w-4 h-4  "><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
                       View Post Engagement
                      </a>
                     </li>
                    {props.expand?.author &&
                    props.expand.author.id == api.authStore.model().id ? (
                      <li>
                        <a
                         className="hero flex gap-2"
                          onClick={() => {
                            props.pin(props.id);
                          }}
                        >
                           <svg
                           fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-4 h-4
         
        "
          >
            <g>
              <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z"></path>
            </g>
          </svg>
                          {props.pinned ? "Unpin" : "Pin"}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}

                    {
                      props.expand?.author &&
                      props.expand.author.id == api.authStore.model().id &&
                       <li>
                        <a className="hero flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
</svg>
                        Who can reply
                        </a>
                       </li>
                    }
                    
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4 ">
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.setParams({ post: props, type: "posts" });
            props.swapPage("view");
            window.history.pushState(
              {},
              "",
              "/?view=status&id=" + props.id + "&type=posts"
            );
          }}
          className="mt-2"
          ref={(e) => {
            if (e && props.content) {
              e.innerHTML = props.content;
            }
          }}
        ></p>

        {props.file.length > 0 ? (
          <div className="mt-2">
            <div
              className={` w-full 
           ${
             props.file.length > 2
               ? "grid grid-cols-2 gap-2"
               : props.file.length > 1
               ? "grid grid-cols-2 gap-2"
               : ""
           }
            col-span-2 grid-flow-dense  `}
            >
              {props.file.map((file: any, index: Number) => {
                return (
                  <img
                    onClick={() => {
                      document
                        .getElementById(props.id + "imageViewer" + index)
                        ?.showModal();
                    }}
                    className={` w-full object-cover
    
                    ${
                      props.file.length < 2
                        ? "rounded  h-96"
                        : "border h-64     border-[#f9f9f9]  rounded"
                    }
                    
                     ${
                       // last image colspan
                       props.file.length > 2 && index == props.file.length - 1
                         ? "col-span-2"
                         : ""
                     }
                     
                    
                    `}
                    src={api.cdn.url({
                      id: props.id || props.params.id,
                      collection: "posts",
                      file: file,
                    })}
                    alt="image"
                  ></img>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}

        {/**Heart Icon */}
        <div className="flex    mt-5">
          <div className="w-fit flex gap-2  hero">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`
            hover:rounded-full hover:bg-rose-500 hover:bg-opacity-20 hover:p-2   active:p-1  w-6 h-6 hover:text-rose-500
            cursor-pointer ${
              likes.includes(api.authStore.model().id)
                ? "fill-rose-500 text-rose-500"
                : ""
            }`}
              onClick={(e) => {
                console.log("clicked");
                handleLike();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            {likes.length}
          </div>

          <div className="flex gap-2 hero  p-2 w-fit ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20 p-1   w-8 h-8 hover:text-sky-500  "
              onClick={() => {
                //@ts-ignore
                document.getElementById(props.id + "comments")?.showModal();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            {comments.length}
          </div>
          <Repost
            originalAuthor={props.expand?.author?.username}
            originalPost={props}
            postID={props.id}
            cacheKey={props.cacheKey}
          />

          <span className="tooltip tooltip-bottom" data-tip="Post Views">
          <div className="w-fit p-2 hero flex">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20  p-1  w-7 h-7 hover:p-2 hover:text-sky-500
                ${
                  theme == 'dark' ? 'fill-white' : 'fill-black'
                }
                `}
            >
              <g>
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
              </g>
            </svg>
            <span>{props.views.length}</span>
          </div>
          </span>
          <div className="absolute end-5 flex  gap-2">
            <div className="w-fit p-2 hero flex">
              <span className="tooltip tooltip-bottom" data-tip="share">
                <svg
                  onClick={() => {
                    navigator.share({
                      title: props.expand.author.username + " on Postr ",
                      text: props.content.slice(0, 100),
                      url: `https://embedify-v1.vercel.app/embed/posts/${props.id}/meta`,
                    });
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20  p-1 w-7   h-7 hover:text-sky-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </span>
            </div>

            <div className="w-fit p-2 hero flex">
              <Bookmark
                id={props.id}
                className={`
            cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20  p-1  w-7 h-7 hover:p-2 hover:text-sky-500
            ${bookmarked ? "fill-blue-500 text-blue-500" : ""}`}
                onClick={() => {
                  if (bookmarked) {
                    api.update({
                      collection: "users",
                      cacheKey: `users-${api.authStore.model().id}`,
                      id: api.authStore.model().id,
                      record: {
                        bookmarks: api.authStore
                          .model()
                          .bookmarks.filter((id: any) => id != props.id),
                      },
                    });
                    api.update({
                      collection: "posts",
                      cacheKey: props.cacheKey,
                      invalidateCache: [
                        "bookmarks-" + api.authStore.model().id,
                      ],
                      id: props.id,
                      record: {
                        bookmarks: api.authStore
                          .model()
                          .bookmarks.filter((id: any) => id != props.id),
                      },
                    });
                    api.authStore.update();
                    setBookmarked(false);
                    if (props.deleteBookmark) {
                      props.deleteBookmark();
                    }
                  } else {
                    api.update({
                      collection: "users",
                      cacheKey: `users-${api.authStore.model().id}`,
                      id: api.authStore.model().id,
                      record: {
                        bookmarks: [
                          ...api.authStore.model().bookmarks,
                          props.id,
                        ],
                      },
                    });
                    api.update({
                      collection: "posts",
                      cacheKey: props.cacheKey,
                      invalidateCache: [
                        "bookmarks-" + api.authStore.model().id,
                      ],
                      id: props.id,
                      record: {
                        bookmarks: [
                          ...api.authStore.model().bookmarks,
                          props.id,
                        ],
                      },
                    });

                    api.authStore.update();
                    setBookmarked(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {props.file
        ? props.file.map((file: any, index: number) => {
            return (
              <Modal
                id={props.id + "imageViewer" + index}
                height="h-[100vw]"
                width="w-[100vw]"
              >
                <div className="flex flex-col overflow-hidden justify-center items-center    relative  ">
                  <svg
                    onClick={() => {
                      //@ts-ignore
                      document
                        .getElementById(props.id + "imageViewer" + index)
                        ?.close();
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="  bg-base-200 btn btn-sm btn-circle fixed left-2 top-2"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>

                  <img
                    src={api.cdn.url({
                      id: props.id || props.params.id,
                      collection: "posts",
                      file: file,
                    })}
                    alt={props.file}
                    className="object-cover  cursor-pointer"
                  ></img>
                </div>
              </Modal>
            );
          })
        : null}
      <DeleteModal id={props.id} {...props}></DeleteModal>
      <dialog
        id={props.id + "embed"}
        className="dialog sm:modal xl:shadow-none md:shadow-none lg:shadow-none bg-transparent focus:outline-none"
      >
        <div className="modal-box xl:shadow-none lg:shadow-none md:shadow-none">
          <h3 className="font-bold text-lg">Embed Post</h3>
          <p className="py-4">
            Embed this post on your website or blog by copying the code below.
          </p>
          <div className="modal-action gap-5">
            <div className="flex gap-5 justify-start  p-2">
              <input
                type="text"
                className="w-full p-2 rounded bg-base-200"
                value={`<iframe src="${window.location.origin}/embed/${props.id}" width="100%" height="100%" frameborder="0"></iframe>`}
              ></input>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<iframe src="${window.location.origin}/embed/${props.id}" width="100%" height="100%" frameborder="0"></iframe>`
                  );
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="flex gap-5">
          <textarea
            className="w-full p-2 rounded bg-base-200"
            rows={5}
            value={`<iframe src="${window.location.origin}/embed/${props.id}" width="100%" height="100%" frameborder="0"></iframe>`}
          ></textarea>
          <button className=" " data-close>
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
}
