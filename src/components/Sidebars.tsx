import { useState } from "react";
import { api } from "../api/api";

export function SideBarRight(props: any) {
  let [text, setText] = useState<any>("");
  let maxlength = 140;
  let [postimgs, setPostimgs] = useState<any>([]);
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
                <a className="cursor-pointer hover:underline">Accessibility</a>
              </li>
              <li>Pkg version:{" 1.6.7 "}</li>
              <li>
                <a>© 2023 Postr-inc. All rights reserved</a>
              </li>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
export function SideBarLeft(props: any) {
  let [postimgs, setPostimgs] = useState<any>([]);
  let [text, setText] = useState<any>("");
  let maxlength = 140;

  async function createPost() {
     
     if(postimgs.length > 0 ){
      postimgs  = postimgs.map(async (img:any)=>{
        let res = await api.getAsByteArray(new Blob([img], {type: img.type}) as File)
        return res
      })
      
     }
     switch(true){
      case text.length < 1:
        alert('Please enter some text or an image')
        return
      case postimgs.length > 4:
        alert('You can only upload 4 images')
        return
      default:
        try {
           
          let post =  await api.create({collection:'posts', expand:[
            'author'
          ], record:{
            author: api.authStore.model().id,
            content:text,
            file:{
             isFile: true,
             file:   await Promise.all(postimgs)
            },
            comments:[],
            likes:[], 
        }}) 
        //@ts-ignore  
        props.setParams({user:api.authStore.model(), scrollTo:post?.id})
        props.swapPage('user')
       
        
        setPostimgs([])
        setText('')
        //@ts-ignore
        typeof window != "undefined" && document.getElementById('createPost')?.close()
    
        } catch (error) {
          
        }
      break;
     }
    

     
     

    
  }
  return (
    <>
      <div className="xl:drawer xl:w-[auto]      xl:drawer-open lg:drawer-open  ">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

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
                <img src="/icons/icon-blue.jpg" className="rounded" width={40} height={40}></img>
              </a>
            </li>
            <li className="">
              <a
                className={`text-xl  ${
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
                      ${props.currentPage == "home" ? "fill-blue-500" : "fill-white stroke-black "}
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
                  props.setParams({ user: api.authStore.model() });
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
                      props.params.user.username == api.authStore.model().username
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
              <a className="text-lg">
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
            <li className="text-lg  text-start hover:outline-none  hover:text-lg  hover:justify-start hover:rounded-full">
              <a  >
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
               <p>
               Post
               </p>
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
              {
                api.authStore.model().avatar ?  <img
                src={api.authStore.img()}
                className="w-10 h-10 rounded-full object-cover"
              />
               : <div className="avatar placeholder"><div className="bg-base-300 text-black   avatar  w-10 h-10  border cursor-pointer rounded   border-white"><span className="text-2xl">{api.authStore.model().username.charAt(0).toUpperCase()}</span></div></div>
              }
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
            <div className="scroll overflow-y-hidden" >
                  {postimgs.length > 0 && (
                    <div className="flex flex-row mt-5    gap-5  ">
                      {Object.keys(postimgs).map((key) => {
                        console.log(postimgs[key]);
                        return (
                          <div className="relative">
                             <img
                            src={URL.createObjectURL(postimgs[key])}
                            className=" object-cover w-32 h-32 rounded-md"
                          />
                          <div 
                          onClick={()=>{
                            setPostimgs(postimgs.filter((img:any)=>img.name !== postimgs[key].name))
                          }}
                          className="absolute btn btn-circle btn-sm top-1 right-1">
                            X
                          </div>
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
              multiple
              onChange={(e) => {
                //@ts-ignore
                setPostimgs(Array.from(e.target.files));
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
            <button 
            onClick={()=>{
              createPost()
            }}
            className="btn  btn-sm rounded-full ">Post</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
