import { use, useEffect, useState } from "react";
import { api } from "../api/api";
import { Props } from "../@types/types";

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
        filter: `followers !~"${api.authStore.model().id}" && id != "${api.authStore.model().id}"`, // get users that are not following the current user
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
            <li className="border-2 border-[#ecececd8] p-5 rounded-lg">
              <a  className="w-full relative" >
                <h1 className="font-bold text-lg">Relevant People</h1>
                {
                  relevantPeople.map((user: any, index: number) => {
                    return (
                      <div className={`flex flex-row gap-2
                      ${index !== 0 ? "mt-5" : "mt-5"}
                      `}>
                        <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                         {
                            user.avatar ? <img
                          
                            src={
                              api.cdn.url({
                                id: user.id,
                                collection: "users", 
                                file: user.avatar,
                              })
                            }
                            className="w-10 h-10 rounded"
                          ></img> 
                          : <div className="avatar placeholder  ">
                           <div className="bg-base-200 text-black rounded w-10 h-10   avatar    border-2   shadow   border-white">
                            <span className="text-2xl">
                              {user.username.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        </div>
                         }
                         
                        <div className="flex hero justify-between">
                          
                        <span className="flex flex-col gap-2"> 
                          <p
                          className="cursor-pointer"
                          onClick={()=>{
                            props.setParams({ user: user.id });
                            props.swapPage("user");
                          }}
                          >{user.username}</p> 
                          <p></p>
                        </span>
                        <button 
                        onClick={()=>{
                          api
                          .update({
                            collection: "users",
                            id:  user.id,
                            cacheKey: `relevant-people-${api.authStore.model().id}`,
                            invalidateCache:[ `relevant-people-${api.authStore.model().id}`, `user-following-${api.authStore.model().id}`],
                            immediatelyUpdate: true, // update database immediately
                            expand: ["followers", "following", "following.followers", "following.following"],
                            record: {
                              followers: user.followers.concat(api.authStore.model().id),
                            },
                          })
                          .then((e: any) => {
                            console.log(e);
                            api
                              .update({
                                collection: "users",
                                id: api.authStore.model().id,
                                invalidateCache: `user-home-${api.authStore.model().id}`,
                                immediatelyUpdate: true, // update database immediately
                                cacheKey: `user-${api.authStore.model().id}`,
                                expand: ["followers", "following", "following.followers", "following.following"],
                                record: {
                                  following: api.authStore.model().following.concat(user.id),
                                },
                              })
                              .then((e: any) => {
                                api.authStore.update();
                                setRefresh(!refresh);
                              });
                          });
                        }}
                        className="btn absolute right-1 btn-sm bg-black rounded-full text-white border-none">
                          {
                            user.followers.includes(api.authStore.model().id) ? "Unfollow" : "Follow"
                          }
                        </button>
                        </div>
                        </div>
                        
                        <p className="w-[200px]">
                          {user.bio}
                        </p>
                        </div>
                        
                        
                      </div>
                    );
                  })
                }
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
              <div className="tooltip cursor-pointer" data-tip="Your app version">
              pkg version: {
              // @ts-ignore
              window?.postr?.version}
</div>
              </li>
              <li>
                <a>© {new Date().getFullYear()} Pascal. All rights reserved</a>
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
  async function createPost() {
    let hasErrored = {
      message: "",
      id: "",
    };
    if (postimgs.length > 0) {
      postimgs = postimgs.map(async (img: any) => {
        if (img.size > 1800000) {
          hasErrored.message = `One or more of your images are too large`;
          hasErrored.id = img.name;
          postimgs = postimgs.filter( (img:any) => img.name !== hasErrored.id)
          return;
        }
        let res = {
           name: img.name,
           type: img.type,
           size: img.size,
           data: await api.getAsByteArray(
            new Blob([img], { type: img.type }) as File
          )
        }
        return res;
      });
    }

     
    switch (true) {
      case text.length < 1:
        setError({ message: "You must enter some text" });
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      case postimgs.length > 4:
        alert("You can only upload 4 images");
        return;
      default:
        try {
          setPosting(true);
          let post = await api.create({
            collection: "posts",
            expand: ["author","likes","comments"], 
            invalidateCache: ["home-following", `user-feed-${api.authStore.model().id}`, 'home-recommended'],
            record: {
              author: api.authStore.model().id,
              content: text,
              file: {
                isFile: true,
                file: await Promise.all(postimgs),
              },
              comments: [],
              likes: [],
              mentioned: [],
            },
          });
          console.log(post);
          //@ts-ignore
          props.setParams({ id: post.id , type: "posts"});
          props.swapPage("view");

          setPostimgs([]);
          setText("");
          //@ts-ignore
          typeof window != "undefined" &&
          //@ts-ignore
            document.getElementById("createPost")?.close();
          setPosting(false);
        } catch (error) {}
        break;
    }
  }
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
            <li  >
              <a
              
                className={`text-xl focus:bg-none ${
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
              <a className="text-lg">
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
              <a className="text-lg">
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
                className={`text-xl
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
              <a className="text-lg"
              onClick={()=>{ 
                props.swapPage("collections")
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
            <li className="text-lg">
               <a
               onClick={()=>{
                // @ts-ignore
                  document.getElementById("postr_plus").showModal();
               }}
               >
               <img src="/icons/icon-blue.jpg" className="rounded w-7 h-7"  
              ></img>
              <p>Premium</p>
               </a>
            </li>
            <li className="text-lg  text-start hover:outline-none  hover:text-lg  hover:justify-start hover:rounded-full">
              <a>
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
      <dialog
        id="createPost"
        className="sm:modal  sm:modal-middle   p-5  xl:w-[25vw] rounded-box"
      >
        <div className="sm:modal-box ">
          <div className="flex hero justify-between">
            <p
              className="cursor-pointer hover:text-red-500"
              onClick={() => {
                //@ts-ignore
                document.getElementById("createPost")?.close();
              }}
            >
              Cancel
            </p>
            <button className="text-blue-500 text-md focus:outline-none">
              Drafts
            </button>
          </div>
          <div
            className={` py-4 flex flex-col 
          ${
            postimgs.length > 0
              ? text.lenght / maxlength > 1
                ? "h-96"
                : "h-100"
              : "h-32"
          }
          ;




          `}
            style={{ height: text.length > 0 ? "auto" : " " }}
          >
            <div className="flex flex-row      ">
              {api.authStore.model().avatar ? (
                <img
                  src={api.authStore.img()}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-base-300 text-black   avatar  w-10 h-10  border cursor-pointer rounded   border-white">
                    <span className="text-2xl">
                      {api.authStore.model().username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex  flex-col w-full">
                <textarea
                  className={`w-full mt-2 mx-3 
              focus:outline  
              h-32 overflow-y-hidden
              resize-none outline-none`}
                  placeholder="What's happening?"
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  maxLength={maxlength}
                ></textarea>
              </div>
            </div>

            <div className="scroll overflow-y-hidden">
              {postimgs.length > 0 && (
                <div className="sm:grid sm:grid-cols-2 flex flex-row flex-wrap flex-grow gap-2">
                  {Object.keys(postimgs).map((key) => {
                    let hasErrored = false;
                    console.log(errors);
                    errors.find((err: any) => err.id == postimgs[key].name)
                      ? (hasErrored = true)
                      : (hasErrored = false); 
                    return (
                      <div className="relative  w-32 h-32 ">
                        <img
                          src={URL.createObjectURL(postimgs[key])}
                          className={` object-cover w-32 h-32 rounded-md
                            xl:col-span-2 sm:col-span-1
                            ${
                              errors.find(
                                (err: any) => err.id == postimgs[key].name
                              )
                                ? "border-2 border-red-500 opacity-20"
                                : ""
                            }
                            `}
                        />
                        
                          <div
                            onClick={() => {
                              setPostimgs(
                                postimgs.filter(
                                  (img: any) => img.name !== postimgs[key].name
                                )
                              );
                            }}
                            className="absolute btn btn-circle btn-sm top-1 right-1"
                          >
                            X
                          </div>
                       
                        

                        {errors.find(
                          (err: any) => err.id == postimgs[key].name
                        ) ? (
                          <p
                            ref={(el: any) => {
                              if (el) {
                                el.innerHTML = errors.find(
                                  (err: any) => err.id == postimgs[key].name
                                ).message;
                              }
                            }}
                            className="text-red-500  absolute top-9 left-2 text-sm"
                          ></p>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="divider mt-0 mb-2 before:bg-[#f6f4f4] after:bg-[#fdf9f9]  after:text-slate-200"></div>
          <div className="flex  h-full justify-between">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              multiple
              max={4}
              onChange={(e) => {
                //@ts-ignore
                Array.from(e.target.files).map((img) => {
                  if (img.size > 2000000) {
                    console.log("Too large", img.name);
                    setErrors((errors: any) => {
                      return [
                        ...errors,
                        {
                          message: `
                     Quota exceeded
                     <br>
                     <br>
                    This image will not be uploaded
                    `,
                          id: img.name,
                        },
                      ];
                    });
                    return;
                  }
                });
                //@ts-ignore
                if (e.target.files.length > 4) {
                  setError({ message: `You can only upload 4 images` });
                  return;
                }
                setPostimgs(Array.from(e.target.files as any));
                e.target.value = "";
              }}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-row gap-2"
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
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </label>
            <p className="  ">
              {text.length}/{maxlength}
            </p>
            {
              posting ? <div className="loading loading-spinner text-blue-500"></div> : <button
              onClick={() => {
                createPost();
              }}
              className="btn  btn-sm rounded-full "
            >
              Post
            </button>
            }
          </div>
        </div>
      </dialog>
      <dialog id="postr_plus" className="modal max-w-[100vw] max-h-[100vh] w-screen h-screen  ">
       
          <div className="modal-box w-screen h-screen max-w-[100vw] max-h-[100vh] rounded-none">
            {/** gradient blue to white background */}
            <div className="flex flex-col bg-gradient-to-t fixed top-0 left-0 from-slate-50 to-blue-100 w-full h-full">
               
                  <span className="cursor-pointer absolute top-5 left-5  rounded-full
                  "
                  onClick={()=>{
                    //@ts-ignore
                    document.getElementById("postr_plus")?.close();
                  }}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

                  </span>
                  <div className="justify-center  flex text-center mx-auto">
                  <div className="justify-center flex flex-col gap-3 text-center  ">
                  <h1 
                  className="text-6xl text-sans font-bold text-center text-[#121212] mt-20"
                  >Subscribe to Postr Premium</h1>
                  <p className="w-[50rem]" >
                    Get access to new features before everyone, a sleek badge and heatfelt commendment for becoming a supporter of the project.
                  </p>
                 </div>
                  </div>

            </div>
          </div>
          
      </dialog>
    </>
  );
}
