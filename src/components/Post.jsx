import { api } from "../react_pages";
import Modal from "./Modal";
import { useState } from "react";
import sanitizeHtml from "sanitize-html";
export default function Post(props) {
  let [accessbile, setaccessible] = useState(
    JSON.parse(localStorage.getItem("accessbile")),
  );

  let [likes, setLikes] = useState(props.likes);
  let [hidden, setHidden] = useState(false);
  let [bookmarked, setBookmarked] = useState(props.bookmarked || []);
  let [reported, setReported] = useState(false);
  let [report, setReport] = useState("");
  let [pinned, setPinned] = useState(props.pinned ? true : false);
  let theme = document.documentElement.getAttribute("data-theme");
  function likepost() {
    if (likes.includes(api.authStore.model.id)) {
      let index = likes.indexOf(api.authStore.model.id);
      likes.splice(index, 1);
      setLikes([...likes]);
      api.collection("posts").update(props.id, {
        likes: likes,
      });
    } else {
      setLikes([...likes, api.authStore.model.id]);
      api.collection("posts").update(props.id, {
        likes: [...likes, api.authStore.model.id],
      });
      if (props.author.id !== api.authStore.model.id) {
        console.log("creating notification");
        api.collection("notifications").create({
          image: `${api.baseUrl}/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`,
          author: api.authStore.model.id,
          recipient: props.author.id,
          post: props.id,
          title: `${api.authStore.model.username} liked your post!`,
          notification_title: `${api.authStore.model.username} liked your post!`,
          notification_body: `Open Postr to view this notification`,
          type: "like",
          url: "/p/" + props.id,
        });
      }
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(500);
    } else {
      console.log("Vibration not supported in this browser.");
    }
  }

  return (
    <div
      className="flex flex-col  text-sm mb-[35px]  "
      id={props.id}
      onClick={(e) => {
        if (
          window.location.pathname !== "/p/" + props.id &&
          e.target.id === props.id
        ) {
          window.location.href = "/p/" + props.id;
        }
      }}
    >
      {pinned && window.location.pathname === `/u/${props.author.username}` ? (
        <div
          className={`flex mb-6 flex-row gap-2 items-center font-medium text-sm  first-letter:
          
           ${
             accessbile && theme === "black"
               ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
               : accessbile && theme === "light"
               ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
               : ""
           }
          `}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`w-4 h-4
        ${theme === "black" ? "fill-white" : "fill-gray-500"}
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

      <div
        className={`flex flex-col
      ${
        accessbile && theme === "black"
          ? `
        text-white antialiased   drop-shadow-md not-sr-only  
        `
          : accessbile && theme === "light"
          ? `
         text-black  antialiased   drop-shadow-md not-sr-only 
        `
          : ""
      }
      `}
      >
        <div className="flex flex-row ">
          {props.author.avatar ? (
            <img
              src={`${api.baseUrl}/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`}
              className="w-8 h-8 rounded-full object-cover"
              alt="post image"
            />
          ) : (
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8">
                <span
                  className={`
                  text-sm
                ${
                  accessbile && theme === "black"
                    ? `
                  text-white antialiased   drop-shadow-md not-sr-only  
                  `
                    : accessbile && theme === "light"
                    ? `
                   text-black  antialiased   drop-shadow-md not-sr-only 
                  `
                    : ""
                }
                `}
                >
                  {props.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}

          <span
            className={`
           mx-2 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
            style={{ marginLeft: ".7rem", marginRight: ".5rem" }}
            onClick={() => {
              if (window.location.pathname !== "/u/" + props.author.username) {
                window.location.href = "/u/" + props.author.username;
              }
            }}
          >
            {props.author.username}
          </span>
          {props.author.validVerified ? (
            <img
              src="/icons/verified.png"
              className="mt-[.3em]"
              style={{ width: "13px", height: "13px" }}
            />
          ) : (
            ""
          )}
          <span
            className={`
            mx-2 cursor-pointer
           ${
             accessbile && theme === "black"
               ? `
             text-white antialiased   drop-shadow-md not-sr-only  
             `
               : accessbile && theme === "light"
               ? `
              text-black  antialiased   drop-shadow-md not-sr-only 
             `
               : ""
           }
          `}
          >
            @{props.author.username}
          </span>

          <div className="dropdown dropdown-left absolute end-5 ">
            <div className="flex text-sm flex-row gap-5">
              <span
                className={`
            text-sm
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
         `}
              >
                {parseDate(props.created)}
              </span>
              <label
                tabIndex="0"
                className={`
                flex
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
              >
                •••
              </label>
            </div>
            <ul
              tabIndex="0"
              className={`dropdown-content rounded z-[1] menu p-2 shadow  h-fit w-52
            ${theme === "black" ? "bg-base-300" : "bg-base-100"}
            `}
              style={{ height: "fit-content" }}
            >
              {props.author.id !== api.authStore.model.id ? (
                <li>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      document
                        .getElementById(`reportmodal${props.id}`)
                        .showModal();
                    }}
                  >
                    Report
                  </a>
                </li>
              ) : (
                ""
              )}

              {props.author.id === api.authStore.model.id &&
              window.location.pathname === "/u/" + props.author.username ? (
                <li>
                  <a
                    className="cursor-pointer"
                    onClick={() => {
                      props.ondelete();
                    }}
                  >
                    Delete
                  </a>
                </li>
              ) : (
                ""
              )}

              {props.author.id !== api.authStore.model.id &&
              window.location.pathname === "/" ? (
                <li>
                  <a
                    onClick={() => {
                      document
                        .getElementById("moreinfo" + props.id)
                        .showModal();
                    }}
                  >
                    Why am I Seeing This?
                  </a>
                </li>
              ) : (
                <></>
              )}
              {props.author.id === api.authStore.model.id ? (
                <li>
                  {pinned ? (
                    <a
                      onClick={() => {
                        setPinned(false);
                        api.collection("posts").update(props.id, {
                          pinned: false,
                        });
                      }}
                    >
                      Unpin
                    </a>
                  ) : (
                    <a
                      onClick={() => {
                        setPinned(true);
                        api.collection("posts").update(props.id, {
                          pinned: true,
                        });
                      }}
                    >
                      Pin
                    </a>
                  )}
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>

        <p
          className={`mt-6 text-sm max-w-full ${
            document.documentElement.getAttribute("data-theme") === "black"
              ? "text-white"
              : "text-black"
          } break-words`}
          ref={(el) => {
            if (el) {
              let text = props.content;
              if (props.tags) {
                props.tags.forEach((tag) => {
                  text = text.replace(
                    `<a class="text-sky-500">${tag}</a>`,
                    `<a href="/q/${tag}" class="text-blue-500">${tag}</a>`,
                  );
                });
              }
              let t = sanitizeHtml(text, {
                allowedTags: sanitizeHtml.defaults.allowedTags,
                allowedAttributes: {
                  a: ["href", "class"],
                },
              });
              let color = props.color;
              props.color === "black" && theme === "black"
                ? (color = "white")
                : "";
              el.style.color = color;
              el.innerHTML = t;
            }
          }}
        ></p>
      </div>
      {props.file ? (
        <>
          <div>
            <img
              src={`${api.baseUrl}/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
              className="w-full h-96 object-cover rounded-md mt-5 cursor-pointer"
              alt="post image"
              onClick={() => {
                try {
                  document.getElementById("modal" + props.id).showModal();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </div>
          <dialog
            id={"modal" + props.id}
            className={`modal  w-screen     h-screen bg-[#000000]   z-[-1] `}
          >
            <button
              className={`btn btn-sm text-lg btn-circle btn-ghost absolute z-[9999]  
          
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
         
              bg-[#222222]  top-5 left-10
             focus:outline-none
             `}
              onClick={() => {
                document.getElementById("modal" + props.id).close();
              }}
            >
              ✕
            </button>
            <form
              method="dialog"
              className="modal-box bg-transparent z-[-1]  w-screen"
            >
              <img
                src={`${api.baseUrl}/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
                className="w-full  justify-center flex object-cover  mt-5 cursor-pointer"
                alt="post image"
                width={window.innerWidth}
                height={window.innerHeight}
                onClick={() => {
                  document.getElementById("modal" + props.id).showModal();
                }}
              />
            </form>
          </dialog>
        </>
      ) : (
        ""
      )}
      <div className="flex flex-row gap-5 mt-6">
        {
          /**
           * @Icon
           * @name:  like
           * @description:  like icon
           * @function: likes_{props.id}
           */ ""
        }

        <div className="flex flex-row gap-2 items-center">
          <svg
            onClick={debounce(likepost, 1000)}
            xmlns="http://www.w3.org/2000/svg"
            fill={likes.includes(api.authStore.model.id) ? "#F13B38" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={
              likes.includes(api.authStore.model.id)
                ? "#F13B38"
                : "currentColor"
            }
            className="w-5 h-5 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>

        {
          /**
           * @Icon
           * @name: comment
           * @description:  comment icon
           */ ""
        }

        <div className="flex flex-row gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`
            w-5 h-5 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
            onClick={() => {
              if (window.location.pathname !== "/p/" + props.id) {
                window.location.href = "/p/" + props.id;
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
        </div>

        {
          /**
           * @Icon
           * @name: repost
           * @description: repost icon
           */ ""
        }

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`
          w-5 h-5 cursor-pointer
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
          onClick={() => {
            navigator.share({
              title: `
            View this post by
            ${
              props.author.id === api.authStore.model.id
                ? "Me"
                : props.author.username
            }
            `,
              text: props.content.slice(0, 300),
              url: window.location.href,
            });
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
          />
        </svg>

        {window.location.pathname === "/p/" + props.id ||
        window.location.pathname === "/q" ? (
          <div>
            {bookmarked.includes(api.authStore.model.id) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#3d85c6"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#3d85c6"
                className={`
               w-5 h-5 cursor-pointer
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
                onClick={() => {
                  setBookmarked([
                    ...bookmarked.filter((id) => id !== api.authStore.model.id),
                  ]);
                  api.collection("posts").update(props.id, {
                    bookmarked: [
                      ...bookmarked.filter(
                        (id) => id !== api.authStore.model.id,
                      ),
                    ],
                  });
                  // append props.id to user bookmarks
                  let bookmarks = api.authStore.model.bookmarks;
                  api.collection("users").update(api.authStore.model.id, {
                    bookmarks: [...bookmarks.filter((id) => id !== props.id)],
                  });
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`
                w-5 h-5 cursor-pointer
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
                onClick={() => {
                  let bookmarks = api.authStore.model.bookmarks;
                  api.collection("users").update(api.authStore.model.id, {
                    bookmarks: [...bookmarks, props.id],
                  });
                  setBookmarked([...bookmarked, api.authStore.model.id]);

                  api.collection("posts").update(props.id, {
                    bookmarked: [...bookmarked, api.authStore.model.id],
                  });
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row font-normal text-gray-400 gap-2 mt-6">
        <span
          className={`
        ${
          accessbile && theme === "black"
            ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          `
            : accessbile && theme === "light"
            ? `
           text-black  antialiased   drop-shadow-md not-sr-only 
          `
            : ""
        }
        `}
        >
          {" "}
          {props.comments.length
            ? props.comments.length > 1
              ? props.comments.length + " Replies"
              : props.comments.length + " Reply"
            : 0 + " Replies"}
        </span>
        <span
          className={`
            text-sm
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
        >
          •
        </span>
        <span
          className={`
        ${
          accessbile && theme === "black"
            ? `
          text-white antialiased   drop-shadow-md not-sr-only  
          `
            : accessbile && theme === "light"
            ? `
           text-black  antialiased   drop-shadow-md not-sr-only 
          `
            : ""
        }
        `}
        >
          {" "}
          {likes.length
            ? likes.length > 1
              ? likes.length + " Likes"
              : likes.length + " Like"
            : "0 Likes"}
        </span>
      </div>
      <div className="flex flex-row mt-6"></div>
      <dialog
        id={`reportmodal${props.id}`}
        className="  modal modal-bottom h-screen"
      >
        <form method="dialog" className="modal-box p-5  h-96">
          <h3
            className={`
           font-bold text-lg
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
          >
            Report {props.author.username}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="divider h-0 mt-2 opacity-50 "></div>
          <p
            className={`
            text-sm
          ${
            accessbile && theme === "black"
              ? `
            text-white antialiased   drop-shadow-md not-sr-only  
            `
              : accessbile && theme === "light"
              ? `
             text-black  antialiased   drop-shadow-md not-sr-only 
            `
              : ""
          }
          `}
          >
            Your report will be reviewed and actioned accordingly. Nobody but
            you will know that you reported this post.
          </p>
          <div className={`divider h-0 mb-5 opacity-30 `}>
            Please Select A Reason
          </div>
          <select
            defaultValue="Select a reason"
            className={`select rounded p-1  select-ghost w-full select-sm
            
            ${
              accessbile && theme === "black"
                ? `
              border-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               border-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }
        
            `}
            onChange={(e) => {
              setReport(e.target.value);
            }}
          >
            <option
              disabled="disabled"
              className={`
            ${
              accessbile && theme === "black"
                ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }
            `}
            >
              Select a reason
            </option>
            <option
              value="Inappropriate"
              className={`
            ${
              accessbile && theme === "black"
                ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }
            `}
            >
              Inappropriate
            </option>
            <option value="spam">Spam</option>
            <option value="hate">Hate Speech</option>
          </select>
          <div className="modal-action">
            <button
              className={`btn btn-ghost border  rounded btn-sm w-full
            
            ${
              accessbile && theme === "black"
                ? `
              border-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               border-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }
           
              `}
              id="reportbtn-{{pid}}"
              onClick={() => {
                document.getElementById(`reportmodal${props.id}`).close();
                document.getElementById(`reported`).showModal();
                api.collection("reports").create({
                  post: props.id,
                  reason: report,
                  postid: props.id,
                  PostAuthor: props.author.id,
                  ReportedBy: api.authStore.model.id,
                });
              }}
            >
              Report
            </button>
          </div>
        </form>
      </dialog>
      <dialog id={`reported`} className="modal  h-screen">
        <form method="dialog" className="modal-box p-5 h-64">
          <h3 className="font-bold text-lg"> Reported</h3>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="divider h-0 mt-2 opacity-50 "></div>
          <p>
            Thankyou for making Postr a better place. Your report will be
            reviewed and actioned accordingly.
          </p>
        </form>
      </dialog>
    </div>
  );
}

function parseDate(data) {
  const date = new Date(data);
  const now = new Date();
  const diff = now - date;
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30.44; // An average month length in days
  const years = months / 12;

  if (seconds < 60) {
    return "just now";
  }
  if (minutes < 60) {
    return Math.round(minutes) + "m";
  }
  if (hours < 24) {
    hours > 1 ? Math.round(hours) + "hs" : Math.round(hours) + "h";
  }
  if (days < 7) {
    return Math.round(days) + "d ago";
  }
  if (weeks < 4) {
    return Math.round(weeks) + "w ago";
  }
  if (months < 12) {
    return Math.round(months) + "mo ago";
  }
  if (years >= 1) {
    return Math.round(years) + "y ago";
  }
}
function debounce(fn, time) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, time);
  };
}

function parseNumber(num) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    const roundedNum = Math.floor(num / 1000);
    return `${roundedNum}k`;
  } else if (num < 1000000000) {
    const roundedNum = Math.floor(num / 1000000);
    return `${roundedNum}m`;
  } else {
    return num.toString();
  }
}
