"use client";
import { useEffect, useState, useRef } from "react";
import Modal from "./Modal";
import BottomModal from "./Bottomupmodal";
import Comment from "./comment";
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
function CommentModal(props: any) {
  let [commentV, setComment] = useState("");
  let [mentions, setMentions] = useState([]);

  async function createComment() {
    switch (true) {
      case commentV.length < 1:
        break;
      default:
        try {
          let res: any = await api.create({
            collection: "comments",
            record: {
              user: api.authStore.model().id,
              post: props.post.id,
              text: commentV,
              cacheKey: props.cacheKey,
              likes: [],
            },
            expand: ["user"],
          });
          props.setComments([...props.comments, res]);

          api.update({
            collection: "posts",
            cacheKey: props.cacheKey,
            id: props.post.id,
            record: {
              comments: [...props.comments.map((e: any) => e.id), res.id],
            },
          });
          props.updateCache(props.post.id, {
            ...props.post,
            expand: {
              ...props.post.expand,
              comments: [...props.comments, res],
            },
          });
          setComment("");
        } catch (error) {
          console.log(error);
          return;
        }
        break;
    }
  }

  return (
    <dialog
      id={props.id}
      className="   fixed top-0 left-0 w-full sm:modal placeholder: xl:rounded-xl  m-auto   right-16  h-[80vh] f md:mt-5  md:rounded-xl  md:w-[40vw] xl:w-[30vw]     "
    >
      <div className="   xl:rounded-xl bg-base-100   scroll h-full w-full  shadow-none   ">
        <div className="flex flex-col   p-3 w-full  ">
          <div className="flex flex-row w-full justify-between absolute p-2    xl:p-6  z-[999] top-0 left-0   bg-white">
            <button
              className="btn btn-circle focus:outline-none btn-ghost btn-sm bg-none hover:bg-base-200"
              onClick={() => {
                //@ts-ignore
                document.getElementById(props.id)?.close();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div>Comments</div>
            <div></div>
          </div>
        </div>

        <div className={`flex flex-col lg:mb-32 md:mb-32 xl:mb-32 mb-32 mt-8  p-4 
        ${
          mentions.length > 0 ? "sm:mb-64" : ""
        }
        sm:p-2 gap-5`}>
          {props.comments.length > 0 ? (
            props.comments.map((comment: any) => {
              return (
                <Comment
                  id={comment.id}
                  key={comment.id}
                  expand={comment.expand}
                  comments={props.comments}
                  level={1}
                  likes={comment.likes}
                  post={props.post}
                  text={comment.text}
                  created={comment.created}
                  user={comment.expand.user}
                  setParams={props.setParams}
                  setComment={setComment}
                  comment={commentV}
                  setMentions={setMentions}
                  mentions={mentions}
                  swapPage={props.swapPage}
                  updateCache={props.updateCache}
                  deleteComment={() => {
                    props.setComments(
                      props.comments.filter((e: any) => e.id != comment.id)
                    );
                    props.updateCache(props.post.id, {
                      ...props.post,
                      expand: {
                        ...props.post.expand,
                        comments: props.comments.filter(
                          (e: any) => e.id != comment.id
                        ),
                      },
                    });

                    api.delete({
                      collection: "comments",
                      id: comment.id,
                      cacheKey: props.cacheKey,
                    });
                  }}
                ></Comment>
              );
            })
          ) : (
            <div className="mx-auto justify-center w-full flex mt-2 hero flex-col">
              <h1 className="text-2xl font-bold text-center">No Comments 😢</h1>

              <p
                className="text-gray-500 text-sm  text-center prose
                w-[300px] break-normal mt-6
                "
              >
                Be the first to comment on this post.
              </p>
            </div>
          )}
        </div>

        <div className={`flex flex-col  gap-5 w-full absolute    bottom-0   left-0   p-2  bg-white  
        
        ${
          mentions.length > 0 ? "sm:mt-32" : ""
        }
        `}>
        {
           mentions.length > 0  ?  <div className="flex gap-5 justify-start  p-2">
           <div className="flex flex-col">
           <p>
             Mentions
           </p>
            <div className="flex gap-5 mt-2">
            {
                 mentions.length > 0 ? mentions.map((mention: any) => {
                   return <p 
                   onClick={() => {
                     
                   }}
                   className="text-sm  btn rounded-full btn-sm text-sky-500">{mention}</p>
                 }) : ""
               }
               </div>
           </div>
           </div> : ""
        }
          <div className="flex flex-row  xl:hidden justify-between w-full  p-2 text-xl">
            <p
              onClick={() => {
                setComment(commentV + "❤️");
              }}
            >
              ❤️
            </p>
            <p
              onClick={() => {
                setComment(commentV + "🔥");
              }}
            >
              🔥
            </p>
            <p
              onClick={() => {
                setComment(commentV + "🥴");
              }}
            >
              🥴
            </p>
            <p
              onClick={() => {
                setComment(commentV + "👏");
              }}
            >
              👏
            </p>
            <p
              onClick={() => {
                setComment(commentV + "🐱‍💻");
              }}
            >
              🐱‍💻
            </p>
            <p
              onClick={() => {
                setComment(commentV + "👀");
              }}
            >
              👀
            </p>
            <p
              onClick={() => {
                setComment(commentV + "😂");
              }}
            >
              😂
            </p>
          </div>
          <div className="flex flex-row gap-5  mb-2 w-full items-center">
            <img
              src={api.authStore.img()}
              alt="profile"
              className="rounded object-cover w-12 h-12 cursor-pointer"
            ></img>
             
            <div className="relative rounded  w-full  border-slate-200 ">
              <input
                className="   input justify-start  hero    border-slate-200  border  border-l-full w-full rounded-full line-clamp-1  resize-none  focus:outline-none  
                text-sm  
                "
                placeholder={`Reply to ${props.post.expand?.author?.username}`}
                onChange={(e) => {
                  setComment(e.target.value);
                  // turn @mentions into links
                  let  mentions = e.target.value.match(/@\w+/g)
                  if(mentions){
                    setMentions(mentions as any)
                  }else{
                    setMentions([])
                  }
                }}
                value={commentV}
              />
              <button className="btn  hover:bg-white  bg-white border-start-0 rounded-full border-l-transparent border  rounded-l-none border-slate-200 absolute end-0 top-0 h-full  border-l-0 ">
                {commentV.length > 0 ? (
                  <p
                    className="text-sky-500"
                    onClick={() => {
                      createComment();
                    }}
                  >
                    Post
                  </p>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function DeleteModal(props: any) {
  return (
 
<dialog id={props.id + 'delete'} className="dialog sm:modal xl:shadow-none md:shadow-none lg:shadow-none bg-transparent focus:outline-none">
  <div className="modal-box xl:shadow-none lg:shadow-none md:shadow-none">
    <h3 className="font-bold text-lg">Delete Postr ?</h3>
    <p className="py-4">
      Are you sure you want to delete this postr? This action cannot be undone. This will permanently delete access accross the platform.
    </p>
    <div className="modal-action gap-5">
      <form method="dialog" className="flex gap-5">
        <button className="text-red-500"
        onClick={() => {
          api.delete({
            collection: "posts",
            id: props.id,
            cacheKey: props.cacheKey,
          });
          props.setArray(props.array.filter((e: any) => e.id != props.id));
          api.cacehStore.delete(props.cacheKey)
          //@ts-ignore
          document.getElementById(props.id + 'delete')?.close()
        }}
        >Delete</button>
        <button className=" " data-close>
          Cancel
        </button>
      </form>
    </div>
  </div>
</dialog>
  )
}

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
        console.log("unlike");
        setLikes(likes.filter((id: any) => id != api.authStore.model().id));
        await api.update({
          collection: "posts",
          cacheKey: props.cacheKey,
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
          collection: "posts",
          cacheKey: props.cacheKey,
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

  return (
    <div
      key={props.id}
      id={props.id}
      className={`xl:mt-0 w-full    xl:p-3  xl:mb-0 mb-6   ${
        props.page !== "user" &&
        props.page !== "bookmarks" &&
        props.page !== "home"
          ? "xl:p-5 sm:p-2"
          : props.page == "home"
          ? "xl:p-5  "
          : ""
      }`}
    >
      {props.pinned &&
      props.page == "user" &&
      props.params &&
      props.params.user.id == props.expand.author.id ? (
        <div className="flex hero gap-5 mb-5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-4 h-4
         
        "
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
          {
            props.expand.author.avatar ?  <img
            onClick={() => {
              console.log(props.expand.author);
              props.setParams({ user: props.expand.author });
              props.swapPage("user");
            }}
            src={api.cdn.url({collection: "users", file: props.expand.author?.avatar, id: props.expand.author?.id})}
            alt="profile"
            className="rounded object-cover w-12 h-12 cursor-pointer"
          ></img>
          :  <div className="avatar placeholder">
          <div className="bg-base-200 text-black rounded w-12 h-12 avatar  absolute bottom-[-3vh] left-2   border-2   shadow   border-white">
            <span className="text-2xl">
              {props.expand.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
          }
          <div className="flex flex-col   heros">
            <div className="flex flex-row h-0 mt-2 gap-2 hero">
              <p
                onClick={() => {
                  console.log(props.expand.author);
                  props.setParams({ user: props.expand.author });
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
                  className="tooltip tooltip-left "
                  data-tip={`Subscriber since ${new Date(
                    props.expand.author?.plus_subscriber_since
                  ).toLocaleDateString()}`}
                >
                  <span className="badge badge-outline badge-sm   border-blue-500 z-[-1] text-sky-500">
                    Postr+ Sub
                  </span>
                </div>
              ) : (
                ""
              )}
              ·<span className="text-sm">{created(props.created)}</span>
              <div className="flex gap-2   absolute end-2 ">
              <details className="dropdown dropdown-left">
  <summary className="m-1 cursor-pointer">
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
  </summary>
  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
    {
      props.expand?.author && props.expand.author.id == api.authStore.model().id
       ? 
      <li>
      <a onClick={() => {
         props.pin(props.id)
         props.updateCache(props.id, { ...props, pinned: props.pinned })
      }}>

        {
          props.pinned ? "Unpin" : "Pin"
        }
      </a>
      </li> : ""
    }
    {
      props.expand?.author && props.expand.author.id == api.authStore.model().id
       ? 
      <li>
      <a onClick={() => {
         //@ts-ignore
         document.getElementById(props.id + 'delete')?.showModal()
      }}>

        Delete
      </a>
      </li> : ""
    }
  </ul>
</details>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4 ">
        <p
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
             props.file.length > 2 ?  "grid grid-cols-2 gap-2" :  props.file.length > 1 ? "grid grid-cols-2 gap-2" : ""
           }
            col-span-2 grid-flow-dense  `}
            >
              {props.file.map((file: any, index: Number) => {
                return (
                  <img
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
                      id: props.id,
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
          <div className="w-fit   hero"> 
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
          </div>

          <div className="flex gap-2 hero  p-2 w-fit ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20 p-1   w-8 h-8 hover:text-sky-500  "
              onClick={(e: any) => {
                //@ts-ignore
                e.preventDefault(); e.stopPropagation();
                window.scrollTo(0,0); //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px.
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

          <div className="w-fit p-2 hero flex">
          <svg
            onClick={() => {
              navigator.share({
                title: "View " + props.expand.author?.username + "'s post",
                text: props.content.slice(0, 100),
                url: window.location.href,
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
          </div>

          <div className="w-fit p-2 hero flex">
          <Bookmark
            id={props.id}
            className={`
            cursor-pointer hover:rounded-full hover:bg-sky-500 hover:bg-opacity-20  p-1  w-7 h-7 hover:p-2 hover:text-sky-500
            ${
              bookmarked ? "fill-blue-500 text-blue-500" : ""
            }`}
            onClick={() => {
              if (!api.authStore.model().bookmarks.includes(props.id)) {
               
                api
                  .update({
                    collection: "users",
                    id: api.authStore.model().id,
                    cacheKey: "userBookmarks" + api.authStore.model().id,
                    expand: ["bookmarks", "bookmarks.author"],
                    record: {
                      bookmarks: [...api.authStore.model().bookmarks, props.id],
                    },
                  })
                  .then((res: any) => {
                    api.authStore.update();
                   
                    api.cacehStore.set(
                      "bookmarks",
                      res.expand.bookmarks || [],
                      1200
                    ); 
                  }); 
                setRefresh(!refresh);
              } else {
                console.log("unbookmark");
                api
                  .update({
                    collection: "users",
                    id: api.authStore.model().id,
                    cacheKey: "userBookmarks" + api.authStore.model().id,
                    expand: ["bookmarks", "bookmarks.author"],
                    record: {
                      bookmarks: api.authStore
                        .model()
                        .bookmarks.filter((e: any) => e != props.id),
                    },
                  })
                  .then((res: any) => {
                    api.authStore.update();
                    api.cacehStore.set(
                      "bookmarks",
                      res.expand ? res.expand.bookmarks : [],
                      1200
                    );
                    props.deleteBookmark && props.deleteBookmark();
                  });
                setRefresh(!refresh);
              } 
              setBookmarked(!bookmarked);
            }}
          />
          </div>
        </div>
      </div>
      <div className="flex gap-5 mt-5  ">
        {props.expand?.likes &&
        props.expand?.likes[0].id !== api.authStore.model().id &&
        props.expand.likes[0].avatar ? (
          <div className="flex gap-2">
            {
              <>
                <img
                  src={api.cdn.url({
                    id: props.expand?.likes[0].id,
                    collection: "users",
                    file: props.expand?.likes[0].avatar,
                  })}
                  alt={props.expand?.likes[0].avatar}
                  className="rounded-full w-6 h-6 cursor-pointer"
                ></img>
                Liked by{" "}
                <span className="font-bold hover:underline cursor-pointer">
                  {props.expand?.likes[0].username ==
                  api.authStore.model().username
                    ? "you"
                    : props.expand?.likes[0].username}
                </span>{" "}
                and {props.expand?.likes.length - 1} others
              </>
            }
          </div>
        ) : (
          <p>
            {likes.length} {likes.length == 1 ? "like" : "likes"}
          </p>
        )}
      </div>

      {props.file ? (
        <Modal id={props.id + "file"} height=" h-[100vh]">
          <div className="flex flex-col overflow-hidden justify-center items-center h-full bg-[#121212]  relative  ">
            <svg
              onClick={() => {
                //@ts-ignore
                document.getElementById(props.id + "file")?.close();
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="  bg-base-200 btn btn-sm btn-circle fixed left-2 top-2"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>

            <img
              src={`https://bird-meet-rationally.ngrok-free.app/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
              alt={props.file}
              className=" xl:w-[60vw] w-full h-full  object-cover  cursor-pointer"
            ></img>
          </div>
        </Modal>
      ) : null}
      <DeleteModal id={props.id} {...props}></DeleteModal>
    </div>
  );
}
