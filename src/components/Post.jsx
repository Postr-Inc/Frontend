import { api } from "../pages";
import Modal from "./Modal";
import { useState } from "react";
export default function Post(props){
    let [likes, setLikes] = useState(props.likes);
    let [hidden, setHidden] = useState(false);
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
        }
      }
    return  (  
    <div className="flex flex-col text-sm mb-[35px]  ">
    <div className="flex flex-row ">
      {props.author.avatar ? (
        <img
          src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`}
          className="w-8 h-8 rounded-full object-cover"
          alt="post image"
        />
      ) : (
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8">
            <span className="text-xs">
              {props.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      <span
        className="mx-2   cursor-pointer "
        style={{ marginLeft: ".7rem", marginRight: ".5rem" }}
        onClick={() => {
          window.location.href = `/u/${props.author.username}`
        }}
      >
        {props.author.username}
      </span>
      {props.author.validVerified ? (
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
          <span className="text-gray-500 text-sm">
            {parseDate(props.created)}
          </span>
          <label tabIndex="0" className="flex text-gray-500   cursor-pointer">
            •••
          </label>
        </div>
        <ul
          tabIndex="0"
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <span
              onClick={() => {
                navigator.share({
                  title: `View ${props.author.username}'s post on Postr!`,
                  text: props.content,
                  url: window.location.href,
                });
              }}
              className="cursor-pointer"
            >
              Share
            </span>
          </li>
          {props.author.id !== api.authStore.model.id ? (
            <li>
              <a className="cursor-pointer">Report</a>
            </li>
          ) : (
            ""
          )}
          
           
          )}
 
        </ul>
      </div>
    </div>

    <p
      className="mt-6 text-sm"
       ref={(el) => {
        if (el) {
          el.innerHTML = props.content;
        }
      }}
    >
        
    
    </p>

    {props.file ? (
      <img
        src={`https://postrapi.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
        className="w-full h-96 object-cover rounded-md mt-5 cursor-pointer"
        alt="post image"
        onClick={() => {
          document.getElementById("modal" + props.id).showModal();
        }}
      />
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
          className="w-4 h-4 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>  {likes.length}</span>
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
          className="w-4 h-4 cursor-pointer "
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
        {props.comments.length}
      </div>

      {
        /**
         * @Icon
         * @name: repost
         * @description: repost icon
         */ ""
      }
    </div>
  </div>)
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
