import Bottomnav from "../components/Bottomnav";
import { useEffect, useState } from "react";
import { api } from ".";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
function getNotifications(page) {
  return api
    .collection("notifications")
    .getList(page, 10, {
      filter: `recipient.id = "${api.authStore.model.id}"`,
      expand: "author, post.author"
    })
    .then((res) => {
      return {
        items: res.items,
        totalPages: res.totalPages,
        totalItems: res.totalItems,
      };
    });
}
export default function Noti() {
  let [currPage, setCurrPage] = useState("All") // All, Likes, Comments, Mentions
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  let [notifications, setNotifications] = useState([]);
  let [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    getNotifications(1).then((res) => {
      setNotifications(res.items);
      setTotalPages(res.totalPages);
    });
  }, []);

  function getMoreNotifications() {
    if(Number(page) >= Number(totalPages)){
      setHasMore(false)
      return
    }else{
        const nextPage = Number(page) + 1
        getNotifications(nextPage).then((res) => {
            setPage(nextPage)
            setNotifications([...notifications, ...res.items]);
        });
    }
  }
  return (
    <div className="p-2  ">
      <h1 className="text-xl font-bold">Notifications</h1>
    
      <InfiniteScroll
        dataLength={notifications.length}
        next={getMoreNotifications}
        hasMore={hasMore}
        loader={<Loading />}
        className="flex flex-col gap-2  mb-16 mt-8"
      >
        {notifications.map((noti) => {
            console.log(noti)
            return (
                <div className=" w-full bg-base-100   rounded-none  "
                key={noti.id}
                >
                
                <div className="flex flex-col p-2  text-sm w-full">
                  <h2 className="card-title">
                    <img 
                    src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${noti.expand.author.id}/${noti.expand.author.avatar}`}
                    className="w-8 h-8 rounded-full object-cover"
                    alt="post image"
                    />
                    <span className="mx-2  text-sm  cursor-pointer "
                    
                    onClick={() => {
                        if (window.location.pathname !== "/u/" + noti.expand.author.username) {
                        window.location.href = "/u/" + noti.expand.author.username;
                        }
                    }}
                    >
                    {noti.expand.author.username}
                    </span>
                  </h2>
                  <p>
                    {noti.type === "like" ? "liked your post" : noti.type === "comment" ? "commented on your post" : noti.type === "mention" ? "mentioned you in a post" : ""}
                  </p>
                  <span className="mt-2 cursor-pointer"
                  onClick={()=>{
                    window.location.href = "/p/" + noti.expand.post.id
                  }}
                  >
                    {noti.expand.post ? noti.expand.post.content : ""}
                  </span>
                  <span className="absolute right-5">
                    {parseDate(noti.created)}
                  </span>
                  <div className="divider  mt-0 h-2 opacity-50"></div>
                </div>
              </div>
            )
        })}
      </InfiniteScroll>

      <div className="mt-8">
        <Bottomnav />
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