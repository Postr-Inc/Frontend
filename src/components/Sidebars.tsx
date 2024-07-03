import { use, useEffect, useState } from "react";
import { api } from "../api/api";
import { Props } from "../@types/types";
import Premium from "./premium_modal/premium_modal";
import CreatePostModal from "./modals/CreatePost";

export function SideBarRight(props: any) {
  let [text, setText] = useState<any>("");
  let maxlength = 140;
  let [postimgs, setPostimgs] = useState<any>([]);
  let [relevantPeople, setRelevantPeople] = useState<any>([]);
  let [refresh, setRefresh] = useState<any>(false);
  function fetchRelenvantPeople() {
    api
      .list({
        collection: "users",
        expand: ["followers", "following"],
        sort: "+followers",
        filter: `followers !~"${api.authStore.model().id}" && id != "${
          api.authStore.model().id
        }"`, // get users that are not following the current user
        cacheKey: "relevant-people-" + api.authStore.model().id,
        limit: 3,
        page: 1,
      })
      .then((res: any) => {
        setRelevantPeople(res.items);
      });
  }
  useEffect(() => {
    fetchRelenvantPeople();
  }, []);
  useEffect(() => {
    fetchRelenvantPeople();
  }, [refresh]);
  return (
    <>
      <div className="xl:drawer   xl:w-[auto] xl:drawer-end xl:drawer-open lg:drawer-open   ">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="p-4   w-80  min-h-full   text-base-content">
            {/* Sidebar content here */}
            <li className={`
              ${
                theme == 'dark' ? 'xl:border xl:border-[#121212]' : 'xl:border xl:border-[#ecececd8]'
              }  p-5 rounded-lg`}>
              <a className="w-full relative">
                <h1 className="font-bold text-lg">Relevant People</h1>
                {relevantPeople.map((user: any, index: number) => {
                  return (
                    <div
                      className={`flex flex-row gap-2
                      ${index !== 0 ? "mt-5" : "mt-5"}
                      `}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {user.avatar ? (
                            <img
                              src={api.cdn.url({
                                id: user.id,
                                collection: "users",
                                file: user.avatar,
                              })}
                              className="w-10 h-10 rounded"
                            ></img>
                          ) : (
                            <div className="avatar placeholder  ">
                              <div className="bg-base-200 text-black rounded w-10 h-10   avatar    border-2   shadow   border-white">
                                <span className="text-2xl">
                                  {user.username.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex hero justify-between">
                            <span className="flex flex-col gap-2">
                              <p
                                className="cursor-pointer"
                                onClick={() => {
                                  props.setParams({ user: user.id });
                                  props.swapPage("user");
                                }}
                              >
                                {user.username}
                              </p>
                              <p></p>
                            </span>
                            <button
                              onClick={() => {
                                api
                                  .update({
                                    collection: "users",
                                    id: user.id,
                                    cacheKey: `relevant-people-${
                                      api.authStore.model().id
                                    }`,
                                    invalidateCache: [
                                      `relevant-people-${
                                        api.authStore.model().id
                                      }`,
                                      `user-following-${
                                        api.authStore.model().id
                                      }`,
                                    ],
                                    immediatelyUpdate: true, // update database immediately
                                    expand: [
                                      "followers",
                                      "following",
                                      "following.followers",
                                      "following.following",
                                    ],
                                    record: {
                                      followers: user.followers.concat(
                                        api.authStore.model().id
                                      ),
                                    },
                                  })
                                  .then((e: any) => {
                                    console.log(e);
                                    api
                                      .update({
                                        collection: "users",
                                        id: api.authStore.model().id,
                                        invalidateCache: `user-home-${
                                          api.authStore.model().id
                                        }`,
                                        immediatelyUpdate: true, // update database immediately
                                        cacheKey: `user-${
                                          api.authStore.model().id
                                        }`,
                                        expand: [
                                          "followers",
                                          "following",
                                          "following.followers",
                                          "following.following",
                                        ],
                                        record: {
                                          following: api.authStore
                                            .model()
                                            .following.concat(user.id),
                                        },
                                      })
                                      .then((e: any) => {
                                        api.authStore.update();
                                        setRefresh(!refresh);
                                      });
                                  });
                              }}
                              className="btn absolute right-1 btn-sm bg-black rounded-full text-white border-none"
                            >
                              {user.followers.includes(api.authStore.model().id)
                                ? "Unfollow"
                                : "Follow"}
                            </button>
                          </div>
                        </div>

                        <p className="w-[200px]">{user.bio}</p>
                      </div>
                    </div>
                  );
                })}
              </a>
            </li>
            <li className="flex flex-col gap-5 mt-2 p-2 text-sm">
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
                <a className="cursor-pointer hover:underline">Accessibility</a>
              </li>
              <li>
                <div
                  className="tooltip cursor-pointer"
                  data-tip="Your app version"
                >
                  pkg version:{" "}
                  {
                    // @ts-ignore
                    window?.postr?.version
                  }
                </div>
              </li>
              <li>
                <a>
                  © 2022 - {new Date().getFullYear()} Pascal. All rights
                  reserved
                </a>
              </li>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
export function SideBarLeft(props: Props) {
  let [postimgs, setPostimgs] = useState<any>([]);
  let [text, setText] = useState<any>("");
  let maxlength = 140;
  let [error, setError] = useState<any>(false);
  let [posting, setPosting] = useState<any>(false);

  let [errors, setErrors] = useState<any>([]);
   
  return (
    <>
      <div className="xl:drawer xl:w-[auto]      xl:drawer-open lg:drawer-open  ">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        {error ? (
          <div className="toast toast-end">
            <div className="alert bg-red-500 bg-opacity-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-rose-500 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>

              <span>{error.message}</span>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-2  w-64  flex flex-col gap-5 min-h-full  text-base-content">
            {/* Sidebar content here */}

            <li className="hover:bg-transparent">
              <a className="hover:bg-transparent focus:bg-transparent">
                <img
                  src="/icons/icon-blue.jpg"
                  className="rounded"
                  width={40}
                  height={40}
                ></img>
              </a>
            </li>
            <li>
              <a
                className={`text-xl  rounded-full focus:bg-none ${
                  props.currentPage == "home"
                    ? "font-semibold text-blue-500"
                    : ""
                }`}
                onClick={() => {
                  props.swapPage("home");
                }}
              >
                <svg
                  className={`
                     w-7 h-7
                     cursor-pointer
                      ${
                        props.currentPage == "home"
                          ? "fill-blue-500"
                          : "fill-white stroke-black "
                      }
                     `}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
              <a className="text-lg  rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="      w-7 h-7   cursor-pointer     hover:fill-black hover:text-black         "
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  ></path>
                </svg>
                Notifications
              </a>
            </li>
            <li>
              <a className="text-lg  rounded-full" >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="   w-7 h-7"
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
              <a
                className={`text-xl  rounded-full rounded-full
                  ${
                    props.currentPage == "user" &&
                    props.params.user.username == api.authStore.model().username
                      ? "font-semibold text-blue-500"
                      : ""
                  }
                  `}
                onClick={() => {
                  props.setParams({ user: api.authStore.model().id });
                  props.swapPage("user");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`
                   w-7 h-7
                   ${
                     props.currentPage == "user" &&
                     props.params.user.username ==
                       api.authStore.model().username
                       ? "fill-blue-500"
                       : ""
                   }
                  `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Profile
              </a>
            </li>
            <li>
              <a
                className="text-lg  rounded-full"
                onClick={() => {
                  props.swapPage("collections");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-7 h-7"
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
            <li className="text-lg  rounded-full">
              <a
              className=" rounded-full"
                onClick={() => {
                  // @ts-ignore
                  document.getElementById("postr_plus").showModal();
                }}
              >
                <img
                  src="/icons/icon-blue.jpg"
                  className="rounded w-7 h-7"
                ></img>
                <p>Premium</p>
              </a>
            </li>
            <li className="text-lg  rounded-full  text-start hover:outline-none  hover:text-lg  hover:justify-start hover:rounded-full">
              <a className=" rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
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
            <button
              onClick={() => {
                //@ts-ignore
                document.getElementById("createPost").showModal();
              }}
              className="btn rounded-full  text-lg hero btn-ghost  hover:bg-blue-500 focus:bg-blue-500 bg-blue-500 text-white "
            >
              <p>Post</p>
            </button>
          </ul>
        </div>
      </div>
      <CreatePostModal {...props} />
      <dialog
        id="postr_plus"
        className="modal max-w-[100vw] max-h-[100vh] w-screen h-screen  "
      >
        <div className="modal-box w-screen h-screen max-w-[100vw] max-h-[100vh] rounded-none">
          {/** gradient blue to white background */}
          <div className="flex flex-col bg-gradient-to-t fixed top-0 left-0 from-slate-50 to-blue-100 w-full h-full">
            <span
              className="cursor-pointer absolute top-5 left-5  rounded-full
                  "
              onClick={() => {
                //@ts-ignore
                document.getElementById("postr_plus")?.close();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </span>
            <Premium />
          </div>
        </div>
      </dialog>
    </>
  );
}
