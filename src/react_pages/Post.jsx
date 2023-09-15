import { useEffect, useRef, useState } from "react";
import { api } from ".";
import Post from "../components/Post";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Comment from "../components/Comments";
import Modal from "../components/Modal";
import Modal2 from "../components/Modal2";
import santizeHtml from "sanitize-html";
import emojis from "./misc/emojis.json";

export default function Vpost(props) {
  const [post, setPost] = useState({});
  const [chars, setChars] = useState(0);
  let [comments, setComments] = useState([]); // [postid, comments
  let [comment, setComment] = useState("");
  let commentRef = useRef();
  let max = 200;

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
        },
      );
      setComments([...comments, c]);
      setComment("");
      setChars(0);

      await api.collection("posts").update(props.id, {
        comments: JSON.stringify([...post.comments, c.id]),
      });

      if (post.expand.author.id !== api.authStore.model.id) {
        await api.collection("notifications").create({
          recipient: post.expand.author.id,
          type: "comment",
          author: api.authStore.model.id,
          title: `${api.authStore.model.username} commented on your post`,
          post: props.id,
          body: `${comment.substring(0, 50)}...`,
          notification_title: `${api.authStore.model.username} commented on your post`,
          notification_body: `${comment}`,
          url: `/p/${props.id}`,
        });
      }
    } else {
      document.querySelector("#invalidcharmodal").showModal();
    }
  }
  function deleteComment(id) {
    api.collection("comments").delete(id);
    let index = comments.findIndex((comment) => comment.id === id);
    comments.splice(index, 1);
    setComments([...comments]);
  }
  useEffect(() => {
    api
      .collection("posts")
      .getOne(props.id, {
        expand: "author, comments.user",
      })
      .then((res) => {
        setPost(res);
        setComments(res.expand.comments ? res.expand.comments : []);
      });
  }, [props.id]);
  useEffect(() => {
    if (comments.length > 0) {
      api.collection("comments").subscribe("*", (msg) => {
        if (msg.action === "delete") {
          let comment = msg.record;
          if (comment.post === props.id) {
            setComments((prevComments) =>
              prevComments.filter((c) => c.id !== comment.id),
            );
          }
        } else if (msg.action === "update") {
          let updatedComment = msg.record;
          if (updatedComment.post === props.id) {
            setComments((prevComments) =>
              prevComments.map((c) => {
                if (c.id === updatedComment.id) {
                  updatedComment.expand = c.expand;
                  return updatedComment;
                } else {
                  return c;
                }
              }),
            );
          }
        }
      });
    }

    return () => {
      api.collection("comments").unsubscribe("*");
    };
  }, [comments, props.id]);

  return (
    <div className="flex flex-col text-sm  p-5   ">
      <div className="  flex flex-row justify-between">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          onClick={() => {
            window.history.back();
          }}
          className="w-5 h-5 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>

        <h1
          className=" text-xl flex flex-row justify-center mx-auto"
          style={{ fontFamily: "Pacifico" }}
        >
          {" "}
          Postr
        </h1>
        <div></div>
      </div>

      <div className=" mt-8">
        {post.author ? (
          <>
            <Post
              id={post.id}
              author={post.expand.author}
              likes={post.likes}
              content={post.content}
              comments={post.expand.comments ? post.expand.comments : []}
              file={post.file ? post.file : ""}
              bookmarked={post.bookmarked}
            />

            <div className="divider mt-0 h-2  opacity-[30%]"></div>
          </>
        ) : (
          <Loading />
        )}

        <div className="flex flex-col gap-5   mb-24">
          {post.author && comments.length > 0
            ? comments.map((comment) => {
                let key = Math.random();
                return (
                  <div key={key} id={comment.id}>
                    <Comment
                      id={comment.id}
                      user={comment.expand.user}
                      likes={comment.likes ? comment.likes : []}
                      text={comment.text}
                      created={comment.created}
                      post={post}
                    />
                    <div className="divider mt-0 h-2  opacity-[30%]"></div>
                    <Modal id={"delete" + comment.id} height="h-96">
                      <button className="flex justify-center mx-auto focus:outline-none">
                        <div className="divider  text-slate-400  w-12   mt-0"></div>
                      </button>
                      <div className="flex-col text-sm mt-8 flex">
                        <div className="form-control w-full ">
                          <label className="label flex text-lg flex-row">
                            Please confirm that you want to delete this comment
                            - this action cannot be undone.
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
            : ""}
        </div>
      </div>

      <div className="mt-8">
        <div
          className={`fixed h-24  bottom-0  m-0   left-0
        ${
          document.querySelector("html").getAttribute("data-theme") === "black"
            ? "bg-base-100"
            : "bg-white"
        }
        `}
        >
          <div className="form-control  justify-center mx-auto w-screen   p-5 ">
            <label className="input-group      ">
              <span
                className="bg-transparent border border-base-300 border-r-0  "
                style={{
                  borderRadius:
                    document
                      .querySelector("html")
                      .getAttribute("data-theme") === "black"
                      ? "0.375rem 0 0 0.375rem"
                      : "",
                }}
              >
                <img
                  src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                  className="w-6 h-6 absolute left-8 rounded-full bg-transparent object-cover"
                  alt="post image"
                />
              </span>

              <dialog id="emojimodal" className="modal">
                <div className="modal-box overflow-y-scroll">
                  <button
                    className="flex justify-center mx-auto focus:outline-none"
                    onClick={() => {
                      document.querySelector("#emojimodal").close();
                    }}
                  >
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
                              " ",
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
                            commentRef.current.value += emoji.replace(
                              /_/g,
                              " ",
                            );
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
                className="bg-transparent border border-base-300 border-r-0
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
                className={`
                
                input input-sm h-[2.5rem]  w-full text-sm   border border-base-300  focus:outline-none border-l-0 border-r-0
                ${
                  document.querySelector("html").getAttribute("data-theme") ===
                  "black"
                    ? "bg-base-100 rounded-full"
                    : "bg-white"
                }
                `}
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
                className={`bg-transparent border cursor-pointer text-fsm border-base-300 text-sky-500 border-l-0
                
                `}
                style={{
                  borderRadius:
                    document
                      .querySelector("html")
                      .getAttribute("data-theme") === "black"
                      ? "0 0.375rem 0.375rem 0"
                      : "",
                }}
                {...(chars < 1 ? { disabled: true } : { disabled: false })}
                onClick={() => {
                  createComment();
                  commentRef.current.value = "";
                  setChars(0);
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
        <Modal2 id="invalidcharmodal" styles="rounded">
          <div className="flex flex-col">
            <div className="flex flex-row gap-5">
              <div className="btn btn-circle btn-ghost cursor-none bg-[#fae4e4] hover:bg-[#fae4e4] focus:bg-[#fae4e4]  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#f44c4c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              <h1 className="text-sm">
                Comment Must Be Between 1 - 200 Characters cannot be empty!
              </h1>
            </div>
            <div className="modal-action  ">
              <form method="dialog">
                <button className="btn btn-sm btn-ghost bg-transparent hover:bg-transparent hover:border-base-300 focus:border-base-300 focus:bg-transparent border-base-300">
                  Ok
                </button>
              </form>
            </div>
          </div>
        </Modal2>
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
