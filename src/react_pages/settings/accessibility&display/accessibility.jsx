import React from "react";
import Bottomnav from "../../../components/Bottomnav";
import { api } from "../..";
export default function Settings_my_accessibility(){
    return <>
   <div className="flex flex-col gap-5 p-5">
   <div className="flex   flex-row justify-between">
        <span
          className="flex flex-row items-center gap-2 cursor-pointer
           
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            onClick={() => {
              window.history.back();
            }}
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="flex flex-col hero">
          <span className="font-semibold text-lg">Accessibility</span>
           
        </div>
         
      </div>
       <div className="mt-2">
        <p>
          Customize postr to your needs to be more accessible to you
        </p>
       
       </div>
       <div className="divider"></div>
       <div className="flex flex-col">
        <h1 className="text-xl font-bold">Visibility</h1>
        <div className="flex justify-between mt-5">
         <p>  Increase contrast.</p>
          <input type="checkbox" className="toggle rounded-full" />
        </div>
        <p className="mt-2">
          Improves legibility by increasing the contrast and lowering saturation between text and images
          </p>
       
       </div>
   </div>
     
    <Bottomnav />
    </>
}
