//@ts-nocheck
"use client";
import Bookmark from "../../src/components/icons/bookmark";
import Settings from "../../src/components/icons/settings";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import Scroller from "react-infinite-scroll-component";
import LogoutModal from "../../src/components/modals/logoutmodal";
import { Loading } from "../../src/components/icons/loading";
import Post from "../../src/components/post"; 
//@ts-ignore
 
import { api } from "../../src/api/api";
import { SideBarLeft, SideBarRight } from "../../src/components/Sidebars";
import { BottomNav } from "../../src/components/BottomNav";
import { Props } from "../../src/@types/types"; 
import MainPage from "../../src/components/shared/page";
export default function Home(props: Props) {
  if(typeof window === "undefined") return null
  const [isClient, setIsClient] = useState(false); 
  useEffect(() => {
    setIsClient(true);
    window.history.pushState({}, "", "/");
  }, []);
  let hasRan = useRef(false);
  let [posts, setPosts] = useState<any>([]);
  let [totalPages, setTotalPages] = useState(0);
  let [page, setPage] = useState(1);
  let [isFetching, setIsFetching] = useState(false);
  let [pageValue, setPageValue] = useState(window?.page || "recommended");
  let [isInitialLoad, setIsInitialLoad] = useState(true);
  let [windowScroll, setWindowScroll] = useState(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  let [poorConnection, setPoorConnection] = useState(false);
  let [dismissToast, setDismissToast] = useState(false); 
  typeof window != "undefined" &&
    window.addEventListener("online", (d) => {
      //@ts-ignore
      let data = d.detail.online.get("latency");

      if (data > 2000) {
        setPoorConnection(true);
      } else {
        setPoorConnection(false);
      }
    });
  let [hasMore, setHasMore] = useState(true);
  function handleRatelimit(params: {
    limit: Number;
    duration: Number;
    used: Number;
  }) {}
  function swapFeed(pageValue: string, pg: number = 0) {
    //@ts-ignore
    window.page = pageValue
    setPageValue(pageValue);
    setIsFetching(true); 

    if(api.cacheStore.has(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)){
      let data = JSON.parse(api.cacheStore.get(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)).value; 
      setPosts(data.items);
      setTotalPages(data.totalPages);
      setHasMore(true);
      setIsFetching(false);
      return
    }
    
    let filterString =
       pageValue === "following"
        ? `author.followers ?~"${
            api.authStore.model().id
          }"`
        : pageValue === "recommended"
        ? ` author !="${ api.authStore.model().id}" && author.followers !~ "${api.authStore.model().id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : "";
         
     
    setPosts([]); 
    api
      .list({
        collection:  "posts",
        limit: 10,
        filter: filterString,
        refresh: true,
        refreshEvery: 1200, // 20 minutes
        cacheKey: `user-home-${pageValue}-posts-1-${api.authStore.model().id}`,
        expand: [
          "author",
          "comments.user",
          "user",
          "post",
          "post.author",
          "author.followers",
          "author.following",
          "author.following.followers",
          "author.following.following",
          "repost",
          "repost.author",
          "repost.author.followers",
          "repost.author.following",
          "repost.likes",
          "repost.comments.user",
          "likes",
        ],
        page: 0, 
        sort: `-created`,
      })
      .then((e: any) => {  
        setPosts(e.items);
        setTotalPages(e.totalPages); 
        if(!api.cacheStore.has(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)){
           api.cacheStore.set(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`, {items:e.items, totalPages:e.totalPages}, 1200) // 20 minutes
        }
        setHasMore(true);
        setIsFetching(false);
      });
  }
  async function loadMore() {
    let { ratelimited, limit, duration, used } = await api.authStore.isRatelimited("list");
     
    switch (true) {
      case ratelimited:
        handleRatelimit({ limit, duration, used });
        break;

      case page >= totalPages:
        setHasMore(false);
        break; 
      case api.cacheStore.has(`user-home-${pageValue}-posts-${page + 1}-${api.authStore.model().id}`):
        let data = api.cacheStore.get(`user-home-${pageValue}-posts-${page + 1}-${api.authStore.model().id}`);
        setPosts([...posts, ...data]);
        setPage((page) => page + 1);
        break;
      default:
        let filterString =
      pageValue === "following"
        ? `author.followers ?~"${
            api.authStore.model().id
          }"`
        : pageValue === "recommended"
        ? ` && author.id !="${
            api.authStore.model().id
          }" && author.followers !~"${api.authStore.model().id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : ""; 
        await api
          .list({
            collection: "posts",
            limit: 10,
            page: page + 1,
            cacheKey: `user-home-${pageValue}-posts-${page + 1}-${api.authStore.model().id}`,
            filter: filterString,
            cacheTime: 1200,
            expand: [
              "author",
              "comments.user",
              "user",
              "post",
              "post.author",
              "author.followers",
              "author.following",
              "author.following.followers",
              "author.following.following",
              "repost",
              "repost.author",
              "repost.author.followers",
              "repost.author.following",
              "repost.likes",
              "repost.comments", 
              "repost.comments.user",
              "likes",
              "likes",
            ],
            sort: `-created`,
          })
          .then((e: any) => {
            api.cacheStore.set(`user-home-${pageValue}-posts-${page + 1}-${api.authStore.model().id}`, e.items, 1200) // 20 minutes
            setPosts([...posts, ...e.items]);
            setTotalPages(e.totalPages);
            setPage((page) => page + 1);
          })
          .catch((e: any) => {
            console.log(e);
          });
        break;
    }
  }

  useLayoutEffect(() => {
    setIsFetching(true);
    if(api.cacheStore.has(`user-home-${pageValue}-posts-1-${api.authStore.model()?.id}`)){
      let data = JSON.parse(api.cacheStore.get(`user-home-${pageValue}-posts-1-${api.authStore.model()?.id}`)).value; 
      setPosts(data.items);
      setTotalPages(data.totalPages);
      setHasMore(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    }
    else {
      typeof window !== "undefined"
        ? (window.onscroll = () => {
            setWindowScroll(window.scrollY);
          })
        : null;
      setPage(1);
      let filterString =
      pageValue === "following"
        ? ` author.followers ~"${
            api.authStore.model()?.id
          }"`
        : pageValue === "recommended"
        ?  ` author !="${ api.authStore.model()?.id}" && author.followers !~ "${api.authStore.model()?.id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : "";

      api
        .list({
          collection: "posts",
          limit: 10,
          page: 1,
          cacheKey: `user-home-${pageValue}-posts-1-${api.authStore.model()?.id}`,
          cacheTime: 1200,
          filter: filterString,
          expand: [
           "author",
          "comments.user",
          "user",
          "post",
          "post.author",
          "author.followers",
          "author.following",
          "author.following.followers",
          "author.following.following",
          "repost",
          "repost.author",
          "repost.author.followers",
          "repost.author.following",
          "repost.likes",
          "repost.comments", 
          "repost.comments.user",
          "comments",
          "likes",
          ],
          sort: `-created`,
        })
        .then((e: any) => {
          api.cacheStore.set(`user-home-${pageValue}-posts-1-${api.authStore.model()?.id}`, {totalPages:e.totalPages, items:e.items}, 1200) // 20 minutes
          setTotalPages(e.totalPages);
          setPosts(e.items);
          setIsFetching(false);
           
        });
    } 
    //@ts-ignore
     
    document.title = `Postr - ${pageValue}`;
   
    return () => {
      hasRan.current = true;
    };
  }, []);
  useEffect(() => {
    document.title = `Postr - ${pageValue.charAt(0).toUpperCase() + pageValue.slice(1)}`;
  }, [pageValue]);
  return (
    <>
      <MainPage {...props}>
      <div
         className=" xl:mx-24     text-md   
         relative 
         xl:w-[35vw]
         md:w-[50vw]  
        
                xl:text-sm md:text-sm"
          >
            {typeof window !== "undefined" &&
            windowScroll > 250 &&
            posts.length > 10 ? (
              <div
                onClick={() =>
                  typeof window !== "undefined"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : null
                }
                className="fixed top-4 p-3 w-fit h-10 xl:top-[17rem]  z-[999] cursor-pointer  translate-x-0 inset-x-0  mx-auto flex hero gap-2 text-white    rounded-full bg-[#43b1f1]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 11-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="border-none    -space-x-2  flex">
                  {Array.from(Array(3).keys()).map((e: any) => {
                    let post = posts[e];
                    return (
                      <div className="flex hero gap-2">
                        <div className="avatar border-none">
                          <div className="w-8">
                            <img
                              src={
                                api.cdn.url(
                                   {
                                    id: post?.expand.author.id,
                                    collection:"users",
                                    file: post?.expand.author.avatar,
                                   }
                                )}
                              alt="avatar"
                              className="rounded-full object-contain w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>{" "}
                <p className="text-sm">posted</p>
              </div>
            ) : (
              ""
            )}

            <div 
            style={{
               borderBottom: 'none'
            }}
            className={` xl:sticky xl:top-0       w-[100%]  xl:z-[999] flex flex-col 
            ${
              theme  === "dark" ? "bg-black  border-[#121212] border-2 border-b-none " : "bg-white  border   border-[#f6f4f4] bg-opacity-75 bg-white "
            
            }  
            `}>
              <div className="flex xl:p-5 w-full sm:p-3  justify-between ">
                <div className="flex gap-2 hero">
                  <div className="flex flex-col   w-full">
                    <div className="flex  justify-between gap-2 w-full">
                      <div className="flex flex-row  gap-2  ">
                        <div className="dropdown     ">
                          <label tabIndex={0}>
                            {typeof window != "undefined"  ? (
                              <>
                                {api.authStore.model()?.avatar ? (
                                  <img
                                    src={api.authStore.img()}
                                    alt={api.authStore.model().username}
                                    className="rounded object-cover w-12 h-12 cursor-pointer"
                                  ></img>
                                ) : (
                                  <div className="avatar placeholder">
                                  <div className="bg-base-300 text-black   avatar  w-16 h-16   border cursor-pointer rounded   border-white">
                                    <span className="text-2xl">
                                      {api.authStore.model().username.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </label>
                          <ul
                            tabIndex={0}
                            style={{
                               border: theme === 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
                               borderRadius: '10px'
                            }}
                            className="dropdown-content z-[1] menu   w-[16rem] shadow bg-base-100  rounded "
                          >
                            <li>
                              <a
                              className="rounded-full"
                                onClick={() => {
                                  props.setParams({
                                    user: api.authStore.model().id,
                                  });
                                  props.changePage("user");
                                }}
                              >
                                View Profile
                              </a>
                            </li>
                            {typeof window != "undefined" &&
                            api.authStore.model().postr_plus ? (
                              <li>
                                <a className="rounded-full">
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
                              <a className="rounded-full">Set Status</a>
                            </li>
                            <li>
                              <a className="rounded-full"
                                onClick={() => {
                                  //@ts-ignore
                                  document
                                    .getElementById("logout-modal")
                                    //@ts-ignore
                                    .showModal();
                                }}
                              >
                                Logout{" "}
                                <span className="font-bold">
                                  {" "}
                                  @{api.authStore.model().username}
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold ">
                            {typeof window != "undefined" &&
                              api.authStore.model().username}
                          </p>
                          <p className="text-lg">
                            @
                            {typeof window != "undefined"
                              ? api.authStore.model().username +
                                api.authStore.model().id.substring(0, 4)
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Bookmark
                          className="w-7 h-7 cursor-pointer"
                          onClick={() => {
                            props.swapPage("bookmarks");
                          }}
                        />
                        <Settings onClick={()=> { 
                          props.swapPage("settings")
                        }} className="w-7 h-7 cursor-pointer" />
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>

              {poorConnection && !dismissToast ? (
                <div
                  className="toast p-2  xl:hidden lg:hidden md:hidden toast-end relative sm:toast-center  text-sm "
                  onClick={() => {
                    setDismissToast(true);
                  }}
                >
                  <div className="alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box">
                    <span>
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
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                    </span>
                    <p>
                      Poor connection detected.
                      <p>Likely due to your internet connection.</p>
                      <span className="text-sm"> Click to Dismiss</span>
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="flex hero sm:p-3 xl:p-5        justify-between xl:mt-0  ">
              <div className="flex flex-col">
                 <p
                 className="cursor-pointer"
                onClick={()=>{
                  swapFeed('recommended', 0)
                }}
                >Recommended</p>
                  {
                    pageValue === 'recommended' ? <div className=" rounded-md   h-1 bg-blue-500"></div> : ""
                  }
               </div>
               <div className="flex flex-col text-sm">
               <p
               className="cursor-pointer"
                onClick={()=>{
                  swapFeed('following', 0)
                }}
                >Following</p>
                  {
                    pageValue === 'following' ? <div className=" rounded-md   h-1 bg-blue-500"></div> : ""
                  }
                 </div>
                  
                <div className="flex flex-col">
                <p
                className="cursor-pointer"
                onClick={()=>{
                  swapFeed('trending', 0)
                }}
                >Trending</p>
                  {
                    pageValue === 'trending' ? <div className=" rounded-md  h-1 bg-blue-500"></div> : ""
                  }
                </div>
                
              </div>
            </div>

            <Scroller
              className="   xl:mt-0 z-[-1] mt-3   flex flex-col  w-full 0 xl:p-0     "
              dataLength={posts.length}
              hasMore={true}
              next={loadMore}
              loader={""}
            >
              {posts.length > 0
                ? posts.map((e: any, index: number) => { 
                    return (
                      <div
                        className={`     sm:p-3  
                         ${
                theme == 'dark' ? 'xl:border xl:border-[#121212]' : 'xl:border xl:border-[#ecececd8]'
              }  
                        `}
                        key={e.id}
                        id={e.id}
                      >
                        <Post 
                          isLast={index === posts.length - 1}
                          cacheKey={`user-home-${pageValue}-posts-${page}-${api.authStore.model().id}`}
                          {...e}
                          expand={e.expand} 
                          post={e}
                           
                          swapPage={props.swapPage}
                          setParams={props.setParams}
                          page={props.currentPage}
                          currentPage={page} 
                        ></Post>
                      </div>
                    );
                  })
                : 
                 <>
                  {isFetching ? (
                   <div className="mx-auto flex justify-center">
                   <span className="loading loading-spinner-large loading-spinner mt-5 text-blue-600"></span>
                   </div>
                  ) : !isFetching ?   <>
                    
                      {
                        pageValue === "following" ?  <div className="flex flex-col mt-6  justify-center">
                        <p className="text-center text-xl font-bold">
                          You're not following anyone.
                        </p>
                        <p className="text-center text-sm">
                          Follow people to see their posts here.
                        </p>
                        </div>
                        : pageValue === "recommended" ? <div className="flex flex-col  justify-center">
                        <p className="text-center text-xl font-bold">
                          No recommended posts. :{'('}
                        </p>
                        </div> : pageValue === "trending" ? <div className="flex flex-col  justify-center">
                        <p className="text-center text-xl font-bold">
                          No trending posts.
                        </p>
                        </div> : <div className="flex flex-col  justify-center"></div>
                      }
                  
                  </>
                  
                : ""
                }
                   
                   
                 </>
                }
            </Scroller>

            <div className="xl:hidden lg:hidden">
              <BottomNav
                params={props.params}
                setParams={props.setParams}
                changePage={props.changePage}
                currentPage={props.currentPage}
                swapPage={props.swapPage}
              />
            </div>
          </div>
      </MainPage>
       
    </>
  );
}
 