"use client";
import tweeterSDK from "@/src/sdk/tweeterSDK";
import Image from "next/image";
import Pocketbase from "pocketbase";
import { useEffect, useRef, useState } from "react";
import BottomNav from "@/src/components/bottomnav";
import Post from "@/src/components/post";
export let tweeter = new tweeterSDK("ws:cunning-elk-locally.ngrok-free.app", "https://bird-meet-rationally.ngrok-free.app");
tweeter.cancellation = true;
import InfiniteScroll from "react-infinite-scroll-component";
import RateLimited from "@/src/components/RatelimitAlert";
export default function () {
  let isinit = useRef(false);
  if (!tweeter.authStore.isValid) window.location.href = "/auth";
  let [posts, setPosts] = useState([]);
  let [hasMore, setHasMore] = useState(true);
  let [page, setPage] = useState(0);
  let [error, setRatelimitError] = useState<any>(null);
  let [refresh, setRefresh] = useState(false);
  let [isIntialLoad, setIsIntialLoad] = useState(true);
  useEffect((): any => {
    if (isinit.current) {
      (async () => {
        let {isRatelimited, Duration} = await tweeter.isRatelimited("list");
        if(isRatelimited) {
          handleRateLimit(Duration)
          return
        }
      
      })();
      tweeter.authStore.update();
      tweeter
        .list({
          collection: "posts",
          expand: ["author"],
          filter: `author.id != "${tweeter.authStore.model.id}"`,
          limit: 10,
          page: 0,
          sort: "-created",
        })
        .then((res: any) => {
          setPosts(res.items);
        })
        .catch((err) => {
          err.errorType == "rateLimitExceeded"
            ? setRatelimitError(err)
            : null;
        });
    }

    

    return () => (isinit.current = true);
  }, [refresh]);

  
  function handleRateLimit(Duration: any) {
     setRatelimitError(true);
     setTimeout(() => {
        setRatelimitError(false);
        setRefresh(true) 
      },   Duration);
  }
   async  function getList(callback: any) {
    

    await tweeter.list({collection: "posts", expand: ["author"], limit: 10, page: page, sort: "-created",
    filter:`author.id != "${tweeter.authStore.model.id}"`
    }).then((res: any) => {callback(res.items)});
  }

  async function fetchMoreData() {
    if(isIntialLoad) {
      setIsIntialLoad(false)
    }
    let {isRatelimited, Duration} = await tweeter.isRatelimited("list");
    if(isRatelimited) {
      handleRateLimit(Duration)
      return
    }
    if (page >= 10) {
      setHasMore(false);
      return;
    }

    let isRateLimited = await tweeter.isRatelimited();

    console.log(isRateLimited);

    getList((res: any) => {
      console.log(res);
      setPosts([...posts, ...res]);
      setPage(page + 1);
    })
  }

  
 
  return (
    <>
    
      <main
      
        className=" p-5  relative   text-md  w-screen  justify-center flex flex-col mx-auto
    
      xl:text-sm md:text-sm"
      >
        <div 
        className="fixed z-[9999] left-0  border-b-[#b6b5b5] shadow-sm  bg-white mb-24 p-5 gap-4 w-full top-0 flex flex-col   justify-between">
          <div className="flex justify-between">
            <div className="flex hero gap-2  ">
              <div className="dropdown  ">
                <label tabIndex={0}>
                  <img
                    src={tweeter.authStore.img()}
                    alt="profile"
                    className="rounded-full w-8 h-8 cursor-pointer"
                  ></img>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a>View Profile</a>
                  </li>
                  {tweeter.authStore.model.validVerified ? (
                    <li>
                      <a>
                        Your benefits
                        <span className="badge badge-outline border-blue-500 text-blue-500">
                          ++
                        </span>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  <li>
                    <a>Set Status</a>
                  </li>
                </ul>
              </div>

              <p>@{tweeter.authStore.model.username}</p>

              {tweeter.authStore.model.validVerified ? (
                <div className="tooltip tooltip-bottom" data-tip="Verified">
                  <img
                    src="/verified.png"
                    width={15}
                    height={15}
                    alt="verified"
                  ></img>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="flex gap-4  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer
            
            "
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer
            
            "
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
          </div>
          {tweeter.authStore.model.tweeter_plus ? (
            <span className="badge badge-outline border-blue-500 text-sky-500">
              Tweeter ++
            </span>
          ) : (
            ""
          )}

          <div className="flex justify-between   ">
            <p>Following</p>
            <p>Recommended</p>
            <p>Explore</p>
          </div>
          {
      posts.length > 10 
      && !error
      && !isIntialLoad
      && !refresh
      && window.scrollY > 100
      ? <div  onClick = {()=>{
         window.scrollTo(0,0)
         setRefresh(true)
      }} className=" fixed  top-40   left-[50%] transform -translate-x-1/2  w-32   rounded-full  flex  justify-center">
        
        <div className="btn btn-circle ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div> : ""
      
    }
        </div>
        
        {!error ? (
          <div className="flex flex-col gap-8 justify-evenly">
            <InfiniteScroll
              hasMore={hasMore}
              dataLength={posts.length}
              next={fetchMoreData}
              pullDownToRefreshThreshold={50}
              pullDownToRefresh
              refreshFunction={()=>{
                setPage(0)
                setPosts([])
                fetchMoreData()
              }}
              
             
            >
              <div className="flex flex-col gap-8 mt-32  mb-32 justify-evenly">
                {posts.length > 0
                  ? posts.map((post: any) => {
                      let user = post.expand.author;
                      return (
                        <div className="" key={post.id}>
                          <Post {...post} user={user}></Post>
                        </div>
                      );
                    })
                  : Array.from(Array(10).keys()).map((i) => {
                      return (
                        <div className="flex flex-col gap-4 mt-8 w-full">
                          <div className="skeleton h-32 w-full"></div>
                          <div className="skeleton h-4 w-28"></div>
                          <div className="skeleton h-4 w-full"></div>
                          <div className="skeleton h-4 w-full"></div>
                        </div>
                      );
                    })}
              </div>
            </InfiniteScroll>
          </div>
        ) : (
          <RateLimited type="Feed" reset={error.time}></RateLimited>
        )}

        <BottomNav></BottomNav>
      </main>
    </>
  );
}
