"use client";

import { useState } from "react";
export   function BottomNav(props: any) {
  let [activePage, setActivePage] = useState("home");
  let theme = 
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "bg-darker"
    : "bg-base-200";
  return (
    <div
      className=" fixed bottom-8 left-[50%] transform -translate-x-1/2    w-80
     "
    >
      <ul
        className={`menu menu-horizontal rounded-box  w-fit 
    ${
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "bg-darker text-white fill-white stroke-white"
        : "bg-base-200"
    }
    `}
      >
        <li
        
        >
          <a
     onClick={() => {
      props.swapPage("home");
    }}  
          
          >
            <svg
              className={`
                w-7 h-7
                cursor-pointer
                 
                `}
              
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
          </a>
        </li>
        
        <li>
          <a>
            <svg
              className="
              w-7 h-7
              cursor-pointer
              text-gray-500  hover:text-black
              
              "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              ></path>
            </svg>
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="
              w-7 h-7
              cursor-pointer
              text-gray-500  hover:text-black
              
              "
              onClick={() => {
                // @ts-ignore
                document.getElementById("createPost").showModal();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="
              w-7 h-7
              cursor-pointer
              text-gray-500  hover:fill-black hover:text-black
              
              
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              ></path>
            </svg>
          </a>
        </li>
       <li>
        <a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"    onClick={()=>{
          props.swapPage("collections")
        }}
        className={`w-7 h-7
              ${
                props.currentPage == "collections"
                  ? "fill-black text-black"
                  : ""
              
              }
              `}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
</svg>

        


        </a>
       </li>
      </ul>
    </div>
  );
}
