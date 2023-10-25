import { api } from "../react_pages";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
export default function Comment(props) {
  let [likes, setLikes] = useState(props.likes);
  let [accessbile, setaccessible] = useState(
    JSON.parse(localStorage.getItem("accessbile")),
  );
  let theme = document.documentElement.getAttribute("data-theme");
  function likepost() {
    if (likes.includes(api.authStore.model.id)) {
      let index = likes.indexOf(api.authStore.model.id);
      likes.splice(index, 1);
      setLikes([...likes]);
      api.collection("comments").update(props.id, {
        likes: likes,
      });
    } else {
      setLikes([...likes, api.authStore.model.id]);
      api.collection("comments").update(props.id, {
        likes: [...likes, api.authStore.model.id],
      });
      if (
        props.user.id !== api.authStore.model.id &&
        props.post.author === api.authStore.model.id
      ) {
        api.collection("notifications").create({
          type: "comment_like",
          recipient: props.user.id,
          author: api.authStore.model.id,
          title: `hearted your comment`,
          comment: props.id,
          post: props.post.id,
          image: `${api.baseUrl}/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`,
          notification_title: `${api.authStore.model.username} hearted your comment`,
          notification_body: props.text.slice(0, 300),
          url: `/p/${props.post.id}`,
        });
      } else if (
        props.user.id !== api.authStore.model.id &&
        props.post.author !== api.authStore.model.id
      ) {
        api.collection("notifications").create({
          type: "comment_like",
          recipient: props.user.id,
          author: api.authStore.model.id,
          title: `${api.authStore.model.username} hearted your comment`,
          comment: props.id,
          post: props.post.id,
          image: `${api.baseUrl}/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`,
          notification_title: `${api.authStore.model.username} hearted your comment`,
          notification_body: props.text.slice(0, 300),
          url: `/p/${props.post.id}`,
        });
      }
    }
  }

  return (
    <div className="flex flex-col text-sm mb-[35px]   " id={props.id}>
      {likes &&
      likes.length > 0 &&
      likes.includes(props.post.author) &&
      props.author !== props.post.author ? (
        <div className="mb-4 text-sm flex flex-row gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#F13B38"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#F13B38"
            className={`w-4 h-4
          
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>

          <span
            className={`text-xs
          
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
            by author
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-row ">
        {props.user.avatar ? (
          <img
            src={`${api.baseUrl}/api/files/_pb_users_auth_/${props.user.id}/${props.user.avatar}`}
            className="w-8 h-8 rounded-full object-cover"
            alt="post image"
          />
        ) : (
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8">
              <span
                className={`text-sm
          
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
                {props.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <span
          className={`mx-2 cursor-pointer
          
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
            if (window.location.pathname !== "/u/" + props.user.username) {
              window.location.href = "/u/" + props.user.username;
            }
          }}
        >
          {props.user.username}
        </span>
        {props.user.validVerified ? (
          <img
            src="/icons/verified.png"
            className="mt-[.4em]"
            style={{ width: "13px", height: "13px" }}
          />
        ) : (
          ""
        )}

        <div className="dropdown dropdown-left absolute end-5 ">
          <div className="flex text-sm flex-row gap-5">
            <span
              className={`text-sm
          
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
              className={`text-sm cursor-pointer
          
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
            className={`dropdown-content z-[1] menu  absolute right-0  shadow  rounded-box  w-32
            
            ${
              document.documentElement.getAttribute("data-theme") === "black"
                ? "bg-base-300 rounded"
                : "bg-base-100"
            }
            `}
          >
            <li>
              <span
                onClick={() => {
                  navigator.share({
                    title: `
                  View this Comment by
                  ${
                    props.user.id === api.authStore.model.id
                      ? "Me"
                      : props.user.username
                  }
                  `,
                    text: props.text.slice(0, 300),
                    url: window.location.href,
                  });
                }}
                className="cursor-pointer"
              >
                Share
              </span>
            </li>
            {props.user.id !== api.authStore.model.id ? (
              <li>
                <a className="cursor-pointer">Report</a>
              </li>
            ) : (
              ""
            )}
            {props.user.id === api.authStore.model.id ? (
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    document.getElementById("delete" + props.id).showModal();
                  }}
                >
                  Delete
                </a>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>

      <p
        className={`mt-6 text-sm
          
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
        ref={(el) => {
          if (el) {
            el.innerHTML = sanitizeHtml(props.text, {
              allowedTags: ["b", "i", "em", "strong", "a"],
              allowedAttributes: {
                a: ["href"],
              },
            });
          }
        }}
      ></p>

      {window.location.pathname === "/u/" + props.user.username ? (
        <span
          className={`text-xs   mt-2
          
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
          Replied to{" "}
          <a className="text-sky-500" href={`/p/${props.post.id}`}>
            {" "}
            @{props.post.expand.author.username}
          </a>
        </span>
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
            className={`w-4 h-4 cursor-pointer
          
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span> {likes.length} </span>
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
            className={`w-4 h-4 cursor-pointer
          
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
              document.getElementById("comment" + props.id).showModal();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>{" "}
        </div>
      </div>
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
    return Math.round(hours) + "h";
  }
  if (days < 7) {
    return Math.round(days) + "d";
  }
  if (weeks < 4) {
    return Math.round(weeks) + "w";
  }
  if (months < 12) {
    return Math.round(months) + "m";
  }
  if (years >= 1) {
    return Math.round(years) + "y";
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
