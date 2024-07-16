//@ts-nocheck
import Comment from "../comment";
import { useState } from "react";
import { api } from "@/src/api/api";
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
export default function CommentModal(props: any) {
    let [commentV, setComment] = useState("");
    let [mentions, setMentions] = useState([]);
  
    async function createComment() {
      switch (true) {
        case commentV.length < 1:
          break;
        default:
          try {
            let user = api.authStore.model();
            //@ts-ignore
            delete user.token; 
            api
              .create({
                collection: "comments",
                record: {
                  user: api.authStore.model().id,
                  text: commentV,
                  post: props.post.id,
                  likes: [],
                },
                expand: ["user"],
              })
              .then(async (res: any) => {
                let newCommentsArray = [...props.comments, res];
                await api.update({
                  collection: "posts",
                  cacheKey: props.cacheKey,
                  id: props.post.id,
                  immediatelyUpdate: true,
                  record: {
                    expand: {
                      comments: newCommentsArray,
                      author: props.post.expand.author,
                    },
                    comments: [...props.comments.map((e: any) => e.id), res.id],
                  },
                });
                props.setComments(newCommentsArray);
              });
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
        className={`   fixed top-0 left-0 w-full sm:modal placeholder: xl:rounded-xl  m-auto   right-16  h-[80vh] f md:mt-5  md:rounded-xl  md:w-[40vw] xl:w-[30vw]    
          ${
            theme == 'dark' ? 'bg-black text-white border-[#121212] border-2' : 'bg-white text-black'
          }
          `}
      >
        <div className={`   xl:rounded-xl 
          ${
            theme == 'dark' ? 'bg-black text-white border-[#121212] border-2' : 'bg-white text-black'
          }
          scroll h-full w-full  shadow-none   `}>
          <div className="flex flex-col   p-3 w-full  ">
            <div className={`flex flex-row w-full justify-between absolute p-2    xl:p-6  z-[999] top-0 left-0   ${
            theme == 'dark' ? 'bg-black text-white' : 'bg-white text-black'
          }  `}>
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
  
          <div
            className={`flex flex-col lg:mb-32 md:mb-32 xl:mb-32   mt-8  p-4 
          ${mentions.length > 0 ? "sm:mb-64" : ""}
          sm:p-2 gap-5`}
          >
            {props.comments.length > 0 ? (
              props.comments.map((comment: any, index: number) => {
                
                return (
                 <div 
                 style={{
                   borderTop: theme == 'dark' ? '1px solid #121212' : '1px solid #f9f9f9'
                 
                 }} >
                    <Comment
                    isLast={index == props.comments.length - 1}
                    id={comment.id}
                    key={comment.id}
                    expand={comment.expand}
                    comments={props.comments}
                    level={1}
                    likes={comment.likes}
                    post={props.post}
                    text={comment.text}
                    created={comment.created}
                    user={comment.expand?.user}
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
                  </div>
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
  
          <div
            className={`flex flex-col  gap-5 w-full absolute    bottom-0   left-0   p-2  
               ${
            theme == 'dark' ? 'bg-black text-white' : 'bg-white text-black'
          }
          
          ${mentions.length > 0 ? "sm:mt-32" : ""}
          `}
          >
            {mentions.length > 0 ? (
              <div className="flex gap-5 justify-start  p-2">
                <div className="flex flex-col">
                  <p>Mentions</p>
                  <div className="flex gap-5 mt-2">
                    {mentions.length > 0
                      ? mentions.map((mention: any) => {
                          return (
                            <p
                              onClick={() => {}}
                              className="text-sm  btn rounded-full btn-sm text-sky-500"
                            >
                              {mention}
                            </p>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
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
            <div className="flex flex-row gap-5  sm:mb-5 mb-2 w-full items-center">
              <div className="relative rounded  w-full  ">
                <input
                  className={`   input justify-start  hero    
                     ${
            theme == 'dark' ? 'border-1 border-[#121212]' : 'border-slate-200 border  border-l-full'
          }
                      w-full rounded-full line-clamp-1  resize-none  focus:outline-none  
                  text-sm  
                  `}
                  placeholder={`Reply to ${props.post.expand?.author?.username}`}
                  onChange={(e) => {
                    setComment(e.target.value);
                    // turn @mentions into links
                    let mentions = e.target.value.match(/@\w+/g);
                    if (mentions) {
                      setMentions(mentions as any);
                    } else {
                      setMentions([]);
                    }
                  }}
                  value={commentV}
                />
                <button className={`btn  
                  ${
                     theme == 'dark' ? 'bg-black hover:bg-black border-[#121212]' : 'bg-white hover:bg-white border-slate-200'
                  }
                  border-start-0 rounded-full border-l-transparent border  rounded-l-none  absolute end-0 top-0 h-full  border-l-0 `}>
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