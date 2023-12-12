"use client";
import { api } from "@/app/app/page";
import { useEffect, useState, useRef } from "react";
import Modal from "./Modal";
import BottomModal from "./Bottomupmodal";
import Comment from "./comment";
import { LazyImage } from "./Image";
import Bookmark from "./icons/bookmark";
 
export default function Post(props: any) {
  let [likes, setLikes] = useState(props.likes);
  let [comments, setComments] = useState(props.expand.comments || []);
  let [comment, setComment] = useState("");
  let [refresh, setRefresh] = useState(false);
  let [bookmarked, setBookmarked] = useState(api.authStore.model.bookmarks.includes(props.id) ? true : false)
  async function handleLike() {
    switch (likes.includes(api.authStore.model.id)) {
      case true:
        console.log("unlike");
        setLikes(likes.filter((id: any) => id != api.authStore.model.id));
        await api.update({
          collection: "posts",
          id: props.id,
          record: {
            likes: likes.filter((id: any) => id != api.authStore.model.id),
          },
        });
        break;

      default:
        setLikes([...likes, api.authStore.model.id]);
        await api.update({
          collection: "posts",
          id: props.id,
          record: { likes: [...likes, api.authStore.model.id] },
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

  async function createComment() {
    switch (true) {
      case comment.length < 1:
        break;
      default:
        try {
          let res: any = await api.create({
            collection: "comments",
            record: {
              user: api.authStore.model.id,
              post: props.id,
              text: comment,
              likes: [],
            },
            expand: ["user"],
          });
          setComments([...comments, res]);
          setComment("");
          api.update({
            collection: "posts",
            id: props.id,
            record: {
              comments: [...comments.map((e: any) => e.id), res.id],
            },
          });
        } catch (error) {
          return;
        }
        break;
    }
  }
  return (
    <div className="mt-5   mb-6"  key={crypto.randomUUID()}>
      <div className="flex   justify-between">
        <div className="flex flex-row  gap-2   ">
          <img
            src={`https://bird-meet-rationally.ngrok-free.app/api/files/_pb_users_auth_/${props.expand.author?.id}/${props.expand.author?.avatar}`}
            alt="profile"
            className="rounded-full w-12 h-12 cursor-pointer"
          ></img>
          <div className="flex flex-col  o">
            <div className="flex flex-row gap-2 hero">
              <p
                onClick={() => {
                  
                  props.swapPage("user");
                  props.setParams({ user: props.expand.author });
                }}
              >
                <span className="capitalize font-bold">
                  {props.expand.author?.username}
                </span>
              </p>

              {props.user?.validVerified ? (
                <img
                  src="/verified.png"
                  width={15}
                  height={15}
                  alt="verified"
                ></img>
              ) : (
                ""
              )}
              <p className="hover:underline">
                @{props.expand.author?.username}
              </p>
              {props.expand.author?.postr_plus ? (
                <div
                  className="tooltip z[-1]"
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
            </div>
          </div>
          <div className="flex gap-2   absolute end-2 ">
            <p>{created()}</p>
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
        {props.file ? (
          <LazyImage 
          
            src={`https://bird-meet-rationally.ngrok-free.app/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
            alt={props.file}
            className="rounded-xl w-full h-96 mt-2 cursor-pointer"
            onClick={() => {
              //@ts-ignore
              document.getElementById(props.id + "file")?.showModal();
            }}
             
           height="h-96"

          ></LazyImage>
           
        ) : (
          ""
        )}

        {/**Heart Icon */}
        <div className="flex gap-5 mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 cursor-pointer ${
              likes.includes(api.authStore.model.id)
                ? "fill-red-500 text-red-500"
                : ""
            }`}
            onClick={() => {
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

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
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
            stroke-width="1.5"
            stroke="currentColor"
            className="
cursor-pointer
w-6 h-6

"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            ></path>
          </svg>
          
          <Bookmark id={props.id}  className={
            `w-6 h-6 cursor-pointer ${
                bookmarked 
                ? "fill-blue-500 text-blue-500"
                : ""
            }`
          }
          onClick={()=>{
            if(!api.authStore.model.bookmarks.includes(props.id)){
              api.update({
                collection:"users",
                id:api.authStore.model.id,
                record:{
                  bookmarks:[...api.authStore.model.bookmarks, props.id]
                }
              })
              setRefresh(!refresh)
            
            }else{
              api.update({
                collection:"users",
                id:api.authStore.model.id,
                record:{
                  bookmarks:api.authStore.model.bookmarks.filter((id:any)=>id!=props.id)
                }
              })
              setRefresh(!refresh)
             
            }
            setBookmarked(!bookmarked)
          }}
          />
        </div>
        <div className="flex gap-5 mt-5 ">
          <p>
            {likes.length} {likes.length == 1 ? "like" : "likes"}
          </p>
          <p>
            {comments.length} {comments.length == 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      <BottomModal
        id={props.id + "comments"}
        height="h-screen max-h-[90vh] overflow-hidden "
      >
        <div className="flex   gap-2 justify-center items-center   ">
          <div className="flex flex-col gap-2 ">
            <div
              className="bg-[#8f8f8f] opacity-50 justify-center mx-auto flex w-8 rounded-full h-[5px]"
              onClick={() => {
                //@ts-ignore
                document.getElementById(props.id + "comments")?.close();
              }}
            ></div>
            <p>Comments</p>
          </div>
        </div>
        <br></br>
        <div className=" overflow-scroll h-4/5">
          {comments.length < 1 ? (
            <div className="flex flex-col gap-2 mt-24 justify-center mx-auto  items-center">
              <p className="text-xl font-bold ">No comments yet</p>
              <p className="text-md  ">Spark a conversation 🎆 </p>
            </div>
          ) : (
            <div
              className=" gap-16  mt-3 flex flex-col  mb-[3.5rem]   
           
          "
            >
              {comments.map((e: any) => {
                return (
                  <Comment
                    key={e.id}
                    id={e.id}
                    text={e.text}
                    post={props}
                    expand={e.expand}
                    created={e.created}
                    likes={e.likes}
                    deleteComment={() => {
                      api
                        .delete({
                          collection: "comments",
                          id: e.id,
                          filter: "",
                        })
                        .then((e: any) => {
                          setComments(
                            comments.filter((e: any) => e.id != e.id)
                          );
                        });
                    }}
                    setComments={setComments}
                    comments={comments}
                    swapPage={props.swapPage}
                    setParams={props.setParams}
                  ></Comment>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{ marginTop: "5rem" }}
          className=" fixed bg-white bottom-0 mt-8 w-full flex flex-col p-2 left-0  "
        >
          <div className="flex flex-row justify-between mb-2 p-3 text-xl">
            <p
              onClick={() => {
                setComment(comment + "❤️");
              }}
            >
              ❤️
            </p>
            <p
              onClick={() => {
                setComment(comment + "🔥");
              }}
            >
              🔥
            </p>
            <p
              onClick={() => {
                setComment(comment + "🥴");
              }}
            >
              🥴
            </p>
            <p
              onClick={() => {
                setComment(comment + "👏");
              }}
            >
              👏
            </p>
            <p
              onClick={() => {
                setComment(comment + "🐱‍💻");
              }}
            >
              🐱‍💻
            </p>
            <p
              onClick={() => {
                setComment(comment + "👀");
              }}
            >
              👀
            </p>
            <p
              onClick={() => {
                setComment(comment + "😂");
              }}
            >
              😂
            </p>
          </div>
          <div className="flex flex-row gap-2 hero ">
            <img
              src={api.authStore.img()}
              alt="profile"
              className="rounded-full w-12 h-12 cursor-pointer"
            ></img>
            <div className="relative w-full">
              <input
                type="text"
                onChange={(e) => {
                  if (e.target.value.length > 1000) return;
                  setComment(e.target.value);
                }}
                value={comment}
                placeholder="Add a comment"
                className="w-full
                 z-[-1]
                 border-slate-300 
                 border-double
                 
                bg-base-200 input-bordered text-black focus:outline-none focus:border-1 focus:border-blue-500   rounded-full p-3"
              ></input>
              <div
                className=" absolute right-0 top-0 cursor-pointer   backdrop-blur-50 rounded-full 
               border-r-0 
              p-2 bg-base-200 z-[999] "
              >
                {comment.length > 0 ? (
                  <p
                    onClick={() => {
                      createComment();
                    }}
                    className=" mr-2 mt-1 text-blue-500"
                  >
                    Post
                  </p>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="
                  w-8 mr-2  h-8 cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm9 4.5a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zm1.5 0a.75.75 0 01.75-.75h3a.75.75 0 010 1.5H16.5v2.25H18a.75.75 0 010 1.5h-1.5v3a.75.75 0 01-1.5 0v-7.5zM6.636 9.78c.404-.575.867-.78 1.25-.78s.846.205 1.25.78a.75.75 0 001.228-.863C9.738 8.027 8.853 7.5 7.886 7.5c-.966 0-1.852.527-2.478 1.417-.62.882-.908 2-.908 3.083 0 1.083.288 2.201.909 3.083.625.89 1.51 1.417 2.477 1.417.967 0 1.852-.527 2.478-1.417a.75.75 0 00.136-.431V12a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5H9v1.648c-.37.44-.774.602-1.114.602-.383 0-.846-.205-1.25-.78C6.226 13.638 6 12.837 6 12c0-.837.226-1.638.636-2.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                )} 
              </div>
            </div>
          </div>
        </div>
      </BottomModal>
      {props.file ?  <Modal id={props.id + "file"} height="h-[100vh]">
        <div className="flex flex-col justify-center items-center h-full bg-[#121212]  relative">
          <svg
            onClick={() => {
              //@ts-ignore
              document.getElementById(props.id + "file")?.close();
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 text-white absolute left-2 top-2"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>

          <LazyImage
            src={`https://bird-meet-rationally.ngrok-free.app/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
            alt={props.file}
            className=" w-full   object-contain mt-2 cursor-pointer"
          ></LazyImage>
        </div>
      </Modal>
      :  null}
    </div>
  );
}
