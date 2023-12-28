"use client";
import Bookmark from "@/src/components/icons/bookmark";
import Settings from "@/src/components/icons/settings";
import { useRef, useEffect, useState } from "react";
import Scroller from "react-infinite-scroll-component";
import { Loading } from "@/src/components/icons/loading";
import Post from "@/src/components/post";
//@ts-ignore
 
import { api } from "@/src/api/api";
import { SideBarLeft, SideBarRight } from "@/src/components/Sidebars";
import BottomNav from "@/src/components/BottomNav";
export default function Home(props: {
  swapPage: Function;
  setParams: Function;
  setLastPage: Function;
  params: any;
  lastPage: any;
  currentPage: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  let hasRan = useRef(false);
  let [posts, setPosts] = useState<any>([]);
  let [totalPages, setTotalPages] = useState(0);
  let [page, setPage] = useState(1);
  let [isFetching, setIsFetching] = useState(false);
  let [pageValue, setPageValue] = useState("following" as string);
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

      if (data > 1000) {
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
    setPageValue(pageValue);
    setIsFetching(true);
    if (
      api.cacehStore.has(
        `user-feed-${pageValue}-${pg}-${api.authStore.model().id}`
      )
    ) {
      let cache = JSON.parse(
        api.cacehStore.get(
          `user-feed-${pageValue}-${pg}-${api.authStore.model().id}`
        )
      );
      setPosts(cache.value.items);
      setTotalPages(cache.value.totalPages);
      setHasMore(true);
      setIsFetching(false);
      return;
    } 
    let filterString =
       pageValue === "following"
        ? `author.followers ?~"${
            api.authStore.model().id
          }"`
        : pageValue === "recommended"
        ? `likes:length > 1 && author.id !="${ api.authStore.model().id}" && author.followers !~ "${api.authStore.model().id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : "";
         
     
    setPosts([]);
    api
      .list({
        collection:  "posts",
        limit: 10,
        filter: filterString,
        cacheKey: `user-feed-${pageValue}-${page}-${api.authStore.model().id}`,
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
        ],
        page: 0,
        sort: `-created`,
      })
      .then((e: any) => {
        console.log(e);
        if (
          !api.cacehStore.has(
            `user-feed-${pageValue}-${page}-${api.authStore.model().id}`
          )
        ) {
          api.cacehStore.set(
            `user-feed-${pageValue}-${page}-${api.authStore.model().id}`,
            {
              items: e.items,
              totalItems: e.totalItems,
              totalPages: e.totalPages,
            },
            1200
          );
        }

        setPosts(e.items);
        setTotalPages(e.totalPages);

        setHasMore(true);
        setIsFetching(false);
      });
  }
  async function loadMore() {
    let { ratelimited, limit, duration, used } =
      await api.authStore.isRatelimited("list");
      console.log(ratelimited, limit, duration, used);

    switch (true) {
      case ratelimited:
        handleRatelimit({ limit, duration, used });
        break;

      case page >= totalPages:
        setHasMore(false);
        break;
      case api.cacehStore.has(
        `user-home-posts-${page + 1}-${api.authStore.model().id}`
      ):
        let cache = JSON.parse(
          api.cacehStore.get(
            `user-home-posts-${page + 1}-${api.authStore.model().id}`
          )
        );
        setPosts([...posts, ...cache.value.items]);
        setTotalPages(cache.value.totalPages);
        setPage((page) => page + 1);
        break;
      default:
        let filterString =
      pageValue === "following"
        ? `author.followers ?~"${
            api.authStore.model().id
          }"`
        : pageValue === "recommended"
        ? `likes:length > 1 && author.id !="${
            api.authStore.model().id
          }" && author.followers !~"${api.authStore.model().id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : "";
        console.log(filterString);
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
              "likes",
              "author.followers",
              "author.following",
              "author.following.followers",
              "author.following.following",
            ],
            sort: `created`,
          })
          .then((e: any) => {
            api.cacehStore.set(
              `user-home-${pageValue}-posts-${page + 1}-${api.authStore.model().id}`,
              e,
              1200
            );
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

  useEffect(() => {
    setIsFetching(true);
    if (!hasRan.current && typeof window !== "undefined") {
      typeof window !== "undefined"
        ? (window.onscroll = () => {
            setWindowScroll(window.scrollY);
          })
        : null;
      if (api.cacehStore.has(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)) {
        setPosts(
          JSON.parse(
            api.cacehStore.get(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)
          ).value.items
        );
        setTotalPages(
          JSON.parse(
            api.cacehStore.get(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)
          ).value.totalPages
        );
        console.log(
          "using cache",
          JSON.parse(
            api.cacehStore.get(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)
          )
        );
        return;
      }
      let filterString =
      pageValue === "following"
        ? ` author.followers ~"${
            api.authStore.model().id
          }"`
        : pageValue === "recommended"
        ? `likes:length > 1 && author.id !="${
            api.authStore.model().id
          }" && author.followers !~"${api.authStore.model().id}"`
        : pageValue === "trending"
        ? `likes:length > 5 && author.id !="${api.authStore.model().id}" && author.followers !~"${api.authStore.model().id}"`
        : "";

      api
        .list({
          collection: "posts",
          limit: 10,
          page: 1,
          cacheKey: `user-home-${pageValue}-posts-1-${api.authStore.model().id}`,
          cacheTime: 1200,
          filter: filterString,
          expand: [
            "author",
            "comments.user",
            "author.followers",
            "author.following",
            "author.following.followers",
            "author.following.following",
            "likes",
          ],
          sort: `-created`,
        })
        .then((e: any) => {
          setTotalPages(e.totalPages);
          setPosts(e.items);
          !api.cacehStore.has(`user-home-${pageValue}-posts-1-${api.authStore.model().id}`)  
            ? api.cacehStore.set(
                `user-home-${pageValue}-posts-1-${api.authStore.model().id}`,
                e,
                1200
              )
            : null;
        });
    }
    return () => {
      hasRan.current = true;
    };
  }, []);
  return (
    <>
      {isClient ? (
        <div className="relative xl:flex  sm:p-2  lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ">
          <SideBarLeft
            params={props.params}
            setParams={props.setParams}
            currentPage={props.currentPage}
            swapPage={props.swapPage}
          />

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
                              src={`
                     https://bird-meet-rationally.ngrok-free.app/api/files/_pb_users_auth_/${post?.expand.author.id}/${post?.expand.author.avatar}
                    `}
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

            <div className="  xl:sticky xl:top-0 xl:border xl:border-[#f6f4f4]   w-[100%]  xl:z-[999] flex flex-col  
           bg-opacity-75 bg-white
            ">
              <div className="flex xl:p-5 w-full   justify-between ">
                <div className="flex gap-2 hero">
                  <div className="flex flex-col   w-full">
                    <div className="flex  justify-between gap-2 w-full">
                      <div className="flex flex-row  gap-2  ">
                        <div className="dropdown     ">
                          <label tabIndex={0}>
                            {typeof window != "undefined" &&
                            api.authStore.isValid() ? (
                              <>
                                {api.authStore.model().avatar ? (
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
                            className="dropdown-content z-[1] menu   w-[16rem] shadow bg-base-100 rounded-box  "
                          >
                            <li>
                              <a
                                onClick={() => {
                                  props.setParams({
                                    user: api.authStore.model(),
                                  });
                                  props.swapPage("user");
                                }}
                              >
                                View Profile
                              </a>
                            </li>
                            {typeof window != "undefined" &&
                            api.authStore.model().postr_plus ? (
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
                            <li>
                              <a
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
                        <Settings className="w-7 h-7 cursor-pointer" />
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>

              {poorConnection && !dismissToast ? (
                <div
                  className="toast  xl:hidden lg:hidden md:hidden toast-end relative sm:toast-center  text-sm "
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

              <div className="flex hero xl:p-5 mt-5 sm:mt-[2.25rem] sm:mb-[2rem]   mb-2 justify-between xl:mt-0  ">
               <div className="flex flex-col text-sm">
               <p
               className="cursor-pointer"
                onClick={()=>{
                  swapFeed('following', 0)
                }}
                >Following</p>
                  {
                    pageValue === 'following' ? <div className=" rounded-md   h-2 bg-blue-500"></div> : ""
                  }
                 </div>
                 <div className="flex flex-col">
                 <p
                 className="cursor-pointer"
                onClick={()=>{
                  swapFeed('recommended', 0)
                }}
                >Recommended</p>
                  {
                    pageValue === 'recommended' ? <div className=" rounded-md   h-2 bg-blue-500"></div> : ""
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
                    pageValue === 'trending' ? <div className=" rounded-md  h-2 bg-blue-500"></div> : ""
                  }
                </div>
                
              </div>
            </div>

            <Scroller
              className="mt-2  xl:mt-0 z-[-1]  flex flex-col  w-full xl:gap-0 xl:p-0 gap-2   "
              dataLength={posts.length}
              hasMore={true}
              next={loadMore}
              loader={""}
            >
              {posts.length > 0
                ? posts.map((e: any) => {
                    return (
                      <div
                        className="mt-5 xl:mt-0 xl:border xl:border-[#f6f4f4]  "
                        key={e.id}
                        id={e.id}
                      >
                        <Post
                          cache={api.cacehStore.get(
                            `user-home-posts-${page}-${
                              api.authStore.model().id
                            }`
                          )}
                          cacheKey={`user-home-posts-${page}-${
                            api.authStore.model().id
                          }`}
                          {...e}
                          swapPage={props.swapPage}
                          setParams={props.setParams}
                          page={props.currentPage}
                          currentPage={page}
                          updateCache={(key: string, value: any) => {
                            let cache = JSON.parse(
                              api.cacehStore.get(
                                `user-home-posts-${page}-${
                                  api.authStore.model().id
                                }`
                              )
                            ); 
                            if(cache && cache.value?.items.length > 0){
                              console.log(cache.value.items);
                              cache.value.items.forEach(
                                (e: any, index: number) => {
                                  if (e.id === key) {
                                    cache.value.items[index] = value;
                                  }
                                }
                              );
                              for (var i in api.cacehStore.keys()) {
                                let key = api.cacehStore.keys()[i];
                                console.log(key);
                                if (key.includes("user-feed")) {
                                  let items = JSON.parse(api.cacehStore.get(key))
                                    .value.items;
  
                                  items.forEach((e: any, index: number) => {
                                    if (e.id === key) {
                                      items[index] = value;
                                    }
                                  });
                                  api.cacehStore.set(
                                    key,
                                    {
                                      items: items,
                                      totalItems: JSON.parse(
                                        api.cacehStore.get(key)
                                      ).value.totalItems,
                                      totalPages: JSON.parse(
                                        api.cacehStore.get(key)
                                      ).value.totalPages,
                                    },
                                    1200
                                  );
                                }
                              }
  
                              api.cacehStore.set(
                                `user-home-posts-${page}-${
                                  api.authStore.model().id
                                }`,
                                cache.value,
                                1200
                              );
                            }
                          }}
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
                currentPage={props.currentPage}
                swapPage={props.swapPage}
              />
            </div>
          </div>
          {poorConnection && !dismissToast ? (
            <div
              onClick={() => {
                setDismissToast(true);
              }}
              className="toast toast-end sm:toast-center  text-sm sm:hidden xsm:hidden  sm:top-0 "
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
          <SideBarRight
            params={props.params}
            setParams={props.setParams}
            currentPage={props.currentPage}
            swapPage={props.swapPage}
          />
          <LogoutModal />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function LogoutModal() {
  return (
    <>
      <dialog
        id="logout-modal"
        className=" rounded-box   modal-middle bg-opacity-50   "
      >
        <div className="flex p-5 xl:w-[15vw] h-[45vh] xl:h-[35vh] rounded-box items-center bg-white justify-center flex-col mx-auto">
          <img
            src="/icons/icon-blue.jpg"
            className="rounded"
            alt="postr logo"
            width={40}
            height={40}
          ></img>
          <p className="font-bold text-xl mt-2">Loging out of Postr?</p>
          <p className="text-sm mt-2">
            You can always log back in at any time.
          </p>
          <button
            className="btn btn-ghost rounded-full w-full bg-black  text-white mt-5"
            onClick={() => {
              api.authStore.clear();
            }}
          >
            Logout
          </button>
          <form method="dialog" className="w-full">
            <button className="btn btn-ghost mt-5 w-full rounded-full bg-base-200 ">
              Cancel
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
