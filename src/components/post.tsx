"use client";
import { tweeter } from "@/app/page";
import { useEffect, useState, useRef } from "react";
export default function Post(props: any) {
  let [likes, setLikes] = useState(props.likes)
 
async function handleLike(){
    
    switch (likes.includes(tweeter.authStore.model.id)) {
        case true:
           console.log('unlike');
           setLikes(likes.filter((id:any)=>id != tweeter.authStore.model.id))
           await tweeter.update({collection:'posts', id:props.id,  record:{likes:likes.filter((id:any)=>id != tweeter.authStore.model.id)}})
            break;
    
        default:
          
            setLikes([...likes, tweeter.authStore.model.id])
            await tweeter.update({collection:'posts', id:props.id,  record:{likes:[...likes, tweeter.authStore.model.id]}})
            break;
    }

   
    
}

 const created = () => {
    let date = new Date(props.created)
    let now = new Date()
    let diff = now.getTime() - date.getTime()
    let seconds = diff / 1000
    let minutes = seconds / 60
    let hours = minutes / 60
    let days = hours / 24
    let weeks = days / 7
    let months = weeks / 4
    let years = months / 12
    switch (true) {
        case seconds < 60:
            return `${Math.floor(seconds)}s`
            break;
        case minutes < 60:
            return `${Math.floor(minutes)}m`
            break;
        case hours < 24:
            return `${Math.floor(hours)}h`
            break;
        case days < 7:
            return `${Math.floor(days)}d`
            break;
        case weeks < 4:
            return `${Math.floor(weeks)}w`
            break;
        case months < 12:
            return `${Math.floor(months)}mo`
            break;
        case years > 1:
            return `${Math.floor(years)}y`
            break;
        default:
            break;
    }

 }
 
  return (
    <div className="mt-5 z-[-1]" key={props.id}>
      <div className="flex hero  justify-between">
        <div className="flex flex-row hero gap-2 z-[-1]">
          <img
            src={`https://bird-meet-rationally.ngrok-free.app/api/files/_pb_users_auth_/${props.user?.id}/${props.user?.avatar}`}
            alt="profile"
            className="rounded-full w-8 h-8 cursor-pointer"
          ></img>
          <p>
            <span className="capitalize">{props.user?.username}</span>
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
          <p className="hover:underline">@{props.user?.username}</p>
          {props.user?.tweeter_plus ? (
            <div className="tooltip z[-1]" data-tip={`Subscriber since ${
                new Date(props.user?.plus_subscriber_since).toLocaleDateString()
            }`}>
                 <span className="badge badge-outline badge-sm text-sm border-blue-500 z-[-1] text-sky-500">
              ++ Sub
            </span>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="flex gap-2   ">
         <p className="text-sm">
            {created()}
          </p>
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
      <div className="mt-3 mb-4 ">
        
        <p
        className="mt-2"
          ref={(e) => {
            if(e && props.content){
                e.innerHTML = props.content
            }
          }}
        ></p>
 {props.file ? (
          <img
            src={`https://bird-meet-rationally.ngrok-free.app/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
            alt="profile"
            className="rounded-lg w-full h-96 cursor-pointer"
          ></img>
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
            className={`w-6 h-6 cursor-pointer ${  likes.includes(tweeter.authStore.model.id) ? "fill-red-500 text-red-500" : ""}` }
            onClick={()=>{console.log('clicked'); handleLike()}}
            
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
                title: 'View ' + props.user?.username + "'s post",
                text: props.content.slice(0, 100),
                url: window.location.href,
              })
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
        </div>
        <div className="flex gap-5 mt-5 ">
            <p   >{likes.length} {likes.length == 1 ? "like" : "likes"}</p>
            <p  >{props.comments.length} {props.comments.length == 1 ? "comment" : "comments"}</p>
        </div>
      </div>
    </div>
  );
}
