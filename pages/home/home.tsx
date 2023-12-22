"use client";
import Bookmark from "@/src/components/icons/bookmark";
import Settings from "@/src/components/icons/settings";
import { useRef, useEffect, useState } from "react";
import Scroller from "react-infinite-scroll-component";
import { Loading } from "@/src/components/icons/loading";
import Post from "@/src/components/post";
//@ts-ignore
import BottomNav from "@/src/components/BottomNav";
import { api } from "@/src/api/api";
import { SideBarLeft, SideBarRight } from "@/src/components/Sidebars";
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
  let [isInitialLoad, setIsInitialLoad] = useState(true);
  let [windowScroll, setWindowScroll] = useState(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  let [hasMore, setHasMore] = useState(true);
  function handleRatelimit(params: {
    limit: Number;
    duration: Number;
    used: Number;
  }) {}
  async function loadMore() {
    let { ratelimited, limit, duration, used } =
      await api.authStore.isRatelimited("list");
 
    switch (true) {
      case ratelimited:
        handleRatelimit({ limit, duration, used });
        break;

      case page >= totalPages:
        setHasMore(false);
        break;
      case api.cacehStore.has(`user-home-posts-${page + 1}-${api.authStore.model().id}`):
       
        let cache = JSON.parse(api.cacehStore.get(`user-home-posts-${page + 1}-${api.authStore.model().id}`))
        setPosts([...posts, ...cache.value.items])
        setTotalPages(cache.value.totalPages)  
        setPage((page) => page + 1); 
        break;
      default: 
        await api
          .list({
            collection: "posts",
            limit: 10,
            page: page + 1,
            expand: ["author", "comments.user", "likes", "author.followers", "author.following", "author.following.followers", "author.following.following"],
            sort: `-created`,
          })
          .then((e: any) => {
            api.cacehStore.set(`user-home-posts-${page + 1 }-${api.authStore.model().id}`, e, 1200)
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
    if (!hasRan.current && typeof window !== "undefined") {
      typeof window !== "undefined"
        ? (window.onscroll = () => {
            setWindowScroll(window.scrollY);
          })
        : null;
      if(api.cacehStore.has(`user-home-posts-1-${api.authStore.model().id}`)){
    
        setPosts(JSON.parse(api.cacehStore.get(`user-home-posts-1-${api.authStore.model().id}`)).value.items)
        setTotalPages(JSON.parse(api.cacehStore.get(`user-home-posts-1-${api.authStore.model().id}`)).value.totalPages)
        console.log("using cache", JSON.parse(api.cacehStore.get(`user-home-posts-1-${api.authStore.model().id}`)))
        return
      }
      api
        .list({
          collection: "posts",
          limit: 10,
          page: 1,
          expand: ["author", "comments.user", "author.followers", "author.following", "author.following.followers", "author.following.following", "likes"],
          sort: `-created`,
        })
        .then((e: any) => { 
          setTotalPages(e.totalPages);
          setPosts(e.items);
          !api.cacehStore.has(`user-home-posts-1-${api.authStore.model().id}`) ? api.cacehStore.set(`user-home-posts-1-${api.authStore.model().id}`, e, 1200) : null
        });
    }
    return () => {
      hasRan.current = true;
    };
  }, []);
  return (
    <>
      {isClient ? (
        <div className="relative xl:flex   lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ">
          <SideBarLeft params={props.params} setParams={props.setParams} currentPage={props.currentPage}  swapPage={props.swapPage} />

          <div
            className="     text-md   
         relative 
         xl:w-[35vw]
         md:w-[80vw]
        
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
                className="fixed top-4 p-3 w-fit h-10 xl:top-24   translate-x-0 inset-x-0  mx-auto flex hero gap-2 text-white    rounded-full bg-[#43b1f1]"
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
                <div className="border-none   -space-x-2  flex">
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

            <div className="  xl:sticky xl:top-0 xl:border xl:border-[#f9f9f9]   w-[100%]  xl:z-[999] flex flex-col  xl:bg-white     ">
              <div className="flex xl:p-5 w-full p-2 justify-between ">
                <div className="flex gap-2 hero">
                  <div className="flex flex-col   w-full">
                    <div className="flex  justify-between gap-2 w-full">
                      <div className="flex flex-row  gap-2  ">
                        <div className="dropdown     ">
                          <label tabIndex={0}>
                            {typeof window != "undefined" &&
                            api.authStore.isValid() ? (
                              <img
                                src={api.authStore.img()}
                                alt={api.authStore.model().username}
                                className="rounded object-cover w-12 h-12 cursor-pointer"
                              ></img>
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
                              onClick={()=>{
                                //@ts-ignore
                                document.getElementById('logout-modal').showModal()
                              }}
                              >
                                Logout <span className="font-bold"> @{api.authStore.model().username}</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-lg">
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
                    {typeof window != "undefined" &&
                    api.authStore.model().postr_plus ? (
                      <span className="badge badge-outline  text-sky-500 z-[-1] p-2 mt-5   border-sky-500">
                        Postr ++
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="flex hero xl:p-5 p-2 justify-between xl:mt-0  ">
                <p>Following</p>
                <p>For You</p>
                <p>Trending</p>
              </div>
            </div>

            <Scroller
              className="mt-2 xl:mt-0 z-[-1]  flex flex-col  w-full xl:gap-0 xl:p-0 gap-2   "
              dataLength={posts.length}
              hasMore={true}
              next={loadMore}
              loader={""}
            >
              {posts.length > 0
                ? posts.map((e: any) => {
                    return (
                      <div
                        className="mt-5 xl:mt-0 xl:border xl:border-[#f9f9f9]  "
                        key={e.id}
                        id={e.id}
                      >
                         <Post
                        cache={api.cacehStore.get(`user-home-posts-${page}-${api.authStore.model().id}`)}
                        {...e}
                        swapPage={props.swapPage}
                        setParams={props.setParams}
                        page={props.currentPage}
                        currentPage={page}
                        updateCache={(key: string, value: any) => {
                          let cache = JSON.parse(api.cacehStore.get(`user-home-posts-${page}-${api.authStore.model().id}`))
                          cache.value.items.forEach((e:any, index:number)=>{
                            if(e.id === key){
                              cache.value.items[index] = value
                            }
                          })
                          for(var i in api.cacehStore.keys()){
                            let key = api.cacehStore.keys()[i]
                            console.log(key)
                            if(key.includes('user-feed')){ 
                             
                                 let items = JSON.parse(api.cacehStore.get(key)).value.items 
                                  
                                 items.forEach((e:any, index:number)=>{
                                 
                                   if(e.id === key){
                                       console.log('found')
                                   }
                                 })
                                 api.cacehStore.set(key, {items:items, totalItems:JSON.parse(api.cacehStore.get(key)).value.totalItems, totalPages:JSON.parse(api.cacehStore.get(key)).value.totalPages}, 230)
                            }
                         }
                        
                          api.cacehStore.set(`user-home-posts-${page}-${api.authStore.model().id}`, cache.value, 1200)
                        }}
                      
                      ></Post>
                      </div>
                    );
                  })
                : Array.from(Array(10).keys()).map((e: any) => {
                    return <Loading key={e}></Loading>;
                  })}
            </Scroller>

            <div className="xl:hidden lg:hidden">
              <BottomNav />
            </div>
          </div>
         <SideBarRight params={props.params} setParams={props.setParams} currentPage={props.currentPage}  swapPage={props.swapPage} />
         <LogoutModal />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function LogoutModal(){
  return <>
  <dialog id="logout-modal" className=" rounded-box   modal-middle bg-opacity-50   ">
    <div className="flex p-5 xl:w-[15vw] h-[45vh] xl:h-[35vh] rounded-box items-center bg-white justify-center flex-col mx-auto">
      <img src="/icons/icon-blue.jpg"  className="rounded" alt="postr logo" width={40} height={40}></img>
      <p className="font-bold text-xl mt-2">
        Loging out of Postr?
      </p>
      <p className="text-sm mt-2">
        You can always log back in at any time.
      </p>
      <button className="btn btn-ghost rounded-full w-full bg-black  text-white mt-5"
      onClick={()=>{
        api.authStore.clear()
      }}
      >Logout</button>
    <form  method="dialog" className="w-full">
      <button className="btn btn-ghost mt-5 w-full rounded-full bg-base-200 ">Cancel</button>
    </form>
    </div>
  </dialog>
  </>
}