import { useEffect, useRef, useState } from "react";
import { api } from ".";
import Post from "../components/Post";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Comment from "../components/Comments";
import Modal from "../components/Modal";
import santizeHtml from "sanitize-html";
import emojis from "./misc/emojis.json";
 
export default function Vpost(props) {
  const [post, setPost] = useState({});
  const [chars, setChars] = useState(0);
  let [comments, setComments] = useState([]); // [postid, comments
  let [comment, setComment] = useState("");
  let commentRef = useRef();
  let max = 200;
  function getPost() {
    api
      .collection("posts")
      .getOne(props.id, {
        expand: "author, comments.user",
      })
      .then((res) => {
        setPost(res);
        setComments(res.expand.comments ? res.expand.comments : []);
 
        document.title = `${res.expand.author.username} on Postr: ${res.content} `;
      });
  }
  async function createComment() {
    if (chars > 0 && chars <= max) {
      let c = await api.collection("comments").create(
        {
          user: api.authStore.model.id,
          text: comment,
          post: props.id,
          likes: JSON.stringify([]),
        },
        {
          expand: "user",
        }
      );
      setComments([...comments, c]);
      setComment("");
      setChars(0);

      await api.collection("posts").update(props.id, {
        comments: JSON.stringify([...post.comments, c.id]),
      });
    } else {
      alert("Comment must be between 1 and 200 characters");
    }
  }
  function deleteComment(id) {
    api.collection("comments").delete(id);
    let index = comments.findIndex((comment) => comment.id === id);
    comments.splice(index, 1);
    setComments([...comments]);
  }
  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="flex flex-col text-sm    ">
      <div className=" p-5 flex flex-row justify-between">
        <div
          className="flex flex-row
        cursor-pointer
        "
          onClick={() => {
            window.history.back();
          }}
        >
          <img src="/icons/backarrow.svg" className="w-5 h-5" alt="Back" />{" "}
        </div>
        <h1 className="font-bold text-xl flex flex-row justify-center mx-auto"
        style={{fontFamily: "Pacifico"}}
        > Postr</h1>
        <div></div>
      </div>
      <div className="p-5">
        {post.author ? (
          <>
            <Post
              id={post.id}
              author={post.expand.author}
              likes={post.likes}
              content={post.content}
              comments={post.expand.comments ? post.expand.comments : []}
              file={post.file ? post.file : ""}
            />

            <div className="divider mt-0 h-2  opacity-[30%]"></div>
          </>
        ) : (
          <Loading />
        )}

        <div className="flex flex-col gap-5 mb-24"
        
        >
          {post.author && comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div key={comment.id}>
                
                  <Comment
                    id={comment.id}
                    user={comment.expand.user}
                    likes={comment.likes}
                    text={comment.text}
                    created={comment.created}
                  />
                   <div className="divider mt-0 h-2  opacity-[30%]"></div>
                  <Modal id={"delete" + comment.id} height="h-96">
                    <button className="flex justify-center mx-auto focus:outline-none">
                      <div className="divider  text-slate-400  w-12   mt-0"></div>
                    </button>
                    <div className="flex-col text-sm mt-8 flex">
                      <div className="form-control w-full ">
                        <label className="label flex text-lg flex-row">
                          Please confirm that you want to delete this comment -
                          this action cannot be undone.
                        </label>
                      </div>
                      <div className="flex flex-row gap-5 mt-5">
                        <a
                          onClick={() => {
                            document
                              .getElementById("delete" + comment.id)
                              .close();
                          }}
                          className="absolute bottom-5 cursor-pointer text-sky-500 text-sm left-5"
                        >
                          Cancel
                        </a>
                        <a
                          onClick={() => {
                            deleteComment(comment.id);
                          }}
                          className="absolute bottom-5 cursor-pointer text-sky-500 text-sm right-5"
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </Modal>
                </div>
              );
            })
          ) : (
            <div className=" gap-5 flex flex-col">
              <h1 className="text-md justify-center mb-16 flex mx-auto font-bold">
                No Comments Be The First To Comment
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <div className="fixed h-24 rounded bottom-0 rounded-full  bg-white left-0 ">
          <div className="form-control  justify-center mx-auto w-screen   p-5 ">
            <label className="input-group      ">
              <span className="bg-transparent border border-slate-200 border-r-0  ">
                <img
                  src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                  className="w-6 h-6 absolute left-8 rounded-full bg-transparent object-cover"
                  alt="post image"
                />
              </span>
              <dialog id="emojimodal" className="modal">
                
                <div className="modal-box overflow-y-scroll">
                 <button className="flex justify-center mx-auto focus:outline-none"
                  onClick={() => { document.querySelector("#emojimodal").close(); }}>
                  
                    <div className="divider  text-slate-400  w-12   mt-0"></div>
                  </button>
                  <h3 className="font-bold text-lg">People</h3>
                  <div className="flex flex-row flex-wrap   text-2xl  ">
                    {emojis.people.map((emoji) => {
                      let id = Math.random();
                      return (
                        <span
                          className="bg-transparent "
                          key={id}
                          onClick={() => {
                            commentRef.current.value += emoji.replace(
                              /_/g,
                              " "
                            );
                            commentRef.current.focus();
                          }}
                        >
                          {emoji.replace(/_/g, " ")}
                        </span>
                      );
                    })}
                  </div>
                  <h3 className="font-bold text-lg">Misc</h3>
                  <div className="flex flex-row flex-wrap   text-2xl  ">
                  {emojis.misc.map((emoji) => {
                      let id = Math.random();
                    return (
                      <span
                        className="bg-transparent "
                        key={id}
                        onClick={() => {
                          commentRef.current.value += emoji.replace(/_/g, " ");
                          commentRef.current.focus();
                        }}
                      >
                        {emoji.replace(/_/g, " ")}
                      </span>
                    );
                  })}
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              <span
                className="bg-transparent border border-slate-200 border-r-0
              text-sky-500 border-l-0 text-lg"
              >
                <label className="swap swap-flip ">
                  <input
                    type="checkbox"
                    onClick={() => {
                      document.querySelector("#emojimodal").showModal();
                      document.querySelector("#emojimodal").focus();
                    }}
                  />

                  <div className="swap-on">😈</div>
                  <div className="swap-off">😇</div>
                </label>
              </span>
              <input
                type="text"
                id="reply-input"
                placeholder={`Reply to ${
                  post.author ? post.expand.author.username : ""
                }`}
                className="input input-sm h-[2.5rem]  w-full text-sm   border border-slate-200  focus:outline-none border-l-0 border-r-0"
                ref={commentRef}
                onInput={(e) => {
                  e.target.focus();
                  e.target.value = handleEmojis(e.target.value);
                  if (e.target.value.length > max) {
                    e.target.value = e.target.value.substring(0, max);
                    setChars(max);
                  }
                  setChars(e.target.value.length);
                  setComment(santizeHtml(e.target.value));
                }}
              />
              <span
                className="bg-transparent border text-sm border-slate-200 text-sky-500 border-l-0"
                {...(chars < 1 ? { disabled: true } : { disabled: false })}
                onClick={() => {
                  createComment();
                  commentRef.current.value = "";
                }}
              >
                Reply
              </span>
            
              
            </label>
             
            <progress
              className={`
            bg-transparent
             ${
               chars > 0 && chars >= max ? "progress-error" : "progress-success"
             }
             progress
             mt-2
            `}
              value={chars}
              max={max}
            ></progress>
          </div>
        </div>
         
      </div>
    </div>
  );
}

function handleEmojis(html) {
  let parser = new DOMParser();
  let defaults = {
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":heart:": "❤️",
    ":broken_heart:": "💔",
    ":star:": "⭐",
    ":star2:": "🌟",
    ":exclamation:": "❗",
    ":question:": "❓",
    ":warning:": "⚠️",
    ":poop:": "💩",
    ":clap:": "👏",
    ":muscle:": "💪",
    ":pray:": "🙏",
    ":smile:": "😄",
    ":smiley:": "😃",
    ":grin:": "😀",
    ":laughing:": "😆",
    ":sweat_smile:": "😅",
    ":joy:": "😂",
    ":rofl:": "🤣",
    ":relaxed:": "☺️",
    ":ok_hand:": "👌",
    ":100:": "💯",
  };

  let emojis = defaults;

  let doc = parser.parseFromString(html, "text/html");
  let c = doc.body;
  if (c.innerHTML.includes(":")) {
    document.querySelector("#emojimodal").showModal();
  }
  let h = c.innerHTML;
  for (const emoji in emojis) {
    if (!emoji.startsWith(":") || !emoji.endsWith(":")) {
      throw new Error("Emoji must be in the format :emoji:");
    }
    if (Object.hasOwnProperty.call(emojis, emoji)) {
      let value = emojis[emoji];
      // set to an img element if a path
      if (
        value.startsWith("http") ||
        value.startsWith("www") ||
        value.startsWith("./")
      ) {
        value = `<img src="${value}" width="32px" height="32px" />`;
      }
      h = h.replaceAll(emoji, value);
    }
  }
  c.innerHTML = h;
  return doc.body.innerHTML;
}
