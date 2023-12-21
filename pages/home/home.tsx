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
export default function Home(props: {
  swapPage: Function;
  setParams: Function;
  setLastPage: Function;
  params: any;
  lastPage: string;
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
        console.log(totalPages);

        setHasMore(false);
        break;
      default:
        console.log("loading more");
        await api
          .list({
            collection: "posts",
            limit: 10,
            page: page + 1,
            expand: ["author", "comments.user"],
            sort: `-created`,
          })
          .then((e: any) => {
            setPosts([...posts, ...e.items]);
            setTotalPages(e.totalPages);
            setPage(page + 1);
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
      console.log("loading more");
      api
        .list({
          collection: "posts",
          limit: 10,
          page: 1,
          expand: ["author", "comments.user"],
          sort: `-created`,
        })
        .then((e: any) => {
          console.log(e?.items[5].expand);
          setTotalPages(e.totalPages);
          setPosts(e.items);
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
          <div className="xl:drawer xl:w-[auto]     xl:drawer-open lg:drawer-open  ">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

            <div className="drawer-side">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu p-2   w-80 flex flex-col gap-5 min-h-full  text-base-content">
                {/* Sidebar content here */}

                <li>
                  <a
                    className={`text-xl  ${
                      props.currentPage == "home" ? "font-semibold" : ""
                    }`}
                  >
                    <svg
                      className="
                     w-8 h-8
                     cursor-pointer
                      fill-black
                     "
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      id="home"
                    >
                      <path
                        d="M6.63477851,18.7733424 L6.63477851,15.7156161 C6.63477851,14.9350667 7.27217143,14.3023065 8.05843544,14.3023065 L10.9326107,14.3023065 C11.310188,14.3023065 11.6723007,14.4512083 11.9392882,14.7162553 C12.2062757,14.9813022 12.3562677,15.3407831 12.3562677,15.7156161 L12.3562677,18.7733424 C12.3538816,19.0978491 12.4820659,19.4098788 12.7123708,19.6401787 C12.9426757,19.8704786 13.2560494,20 13.5829406,20 L15.5438266,20 C16.4596364,20.0023499 17.3387522,19.6428442 17.9871692,19.0008077 C18.6355861,18.3587712 19,17.4869804 19,16.5778238 L19,7.86685918 C19,7.13246047 18.6720694,6.43584231 18.1046183,5.96466895 L11.4340245,0.675869015 C10.2736604,-0.251438297 8.61111277,-0.221497907 7.48539114,0.74697893 L0.967012253,5.96466895 C0.37274068,6.42195254 0.0175522924,7.12063643 0,7.86685918 L0,16.568935 C0,18.4638535 1.54738155,20 3.45617342,20 L5.37229029,20 C6.05122667,20 6.60299723,19.4562152 6.60791706,18.7822311 L6.63477851,18.7733424 Z"
                        transform="translate(2.5 2)"
                      ></path>
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <a className="text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      d
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                    Notifications
                  </a>
                </li>
                <li>
                  <a className="text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    Explore
                  </a>
                </li>
                <li>
                  <a className="text-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      dataSlot="icon"
                      className="w-8 h-8  "
                    >
                      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                    </svg>
                    Profile
                  </a>
                </li>
                <li>
                  <a className="text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      dataSlot="icon"
                      className="w-8 h-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Collections
                  </a>
                </li>
                <li>
                  <a className="text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      dataSlot="icon"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    Messages
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="     text-md   
         relative 
         xl:w-[35vw]
        
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
                          {...e}
                          swapPage={props.swapPage}
                          setParams={props.setParams}
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
          <div className="xl:drawer   xl:w-[auto] xl:drawer-end xl:drawer-open lg:drawer-open   ">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            <div className="drawer-side">
              <label
                htmlFor="my-drawer-2"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="p-4  w-80  min-h-full   text-base-content">
                {/* Sidebar content here */}
                <li className="flex flex-col gap-5 text-sm">
                  <li>
                    <a className=" bg-base-200 w-full rounded  menu text-md">
                      <p>
                        Subscribe to{" "}
                        <span className="from-blue-500 to-purple-500 bg-gradient-to-r text-white text-transparent bg-clip-text font-bold">
                          Postr ++
                        </span>
                        <p>Become a supporter and unlock exclusive benefits</p>
                      </p>
                      <button className="btn btn-primary btn-sm rounded-full  mt-2 w-[50%]">
                        Subscribe
                      </button>
                    </a>
                  </li>
                  <li className="flex flex-row gap-5">
                    <a className="cursor-pointer hover:underline">
                      Terms of service
                    </a>
                    <a
                      href="/information/privacy.pdf"
                      className="cursor-pointer hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li className="flex flex-row gap-5">
                    <a href="" className="cursor-pointer hover:underline">
                      Help and safety
                    </a>
                    <a className="cursor-pointer hover:underline">
                      Accessibility
                    </a>
                  </li>
                  <li>Pkg version:{" 1.6.7 "}</li>
                  <li>
                    <a>© 2023 Postr-inc. All rights reserved</a>
                  </li>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
