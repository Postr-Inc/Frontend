import React from  'react'
import Bottomnav from "../../../components/Bottomnav";
import { api } from "../..";
export default function Settings_accessibility_display(){
    console.log('e')
    return <>
    <div className="p-4 flex flex-col  gap-8 mb-24">
    <div className="flex   flex-row justify-between">
       
        <div className="flex flex-col hero">
           <div className="hero flex gap-5 justify-between">
           <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            onClick={() => {
              window.history.back();
            }}
            className="w-6 h-6 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
           <span className="font-semibold text-lg">Accessibility, display, and languages</span>
           <div></div>
           </div>
          <span className="text-[12px] text-base-900">
            @
            {api.authStore.model.username +
              "_" +
              api.authStore.model.id.substring(0, 7)}
          </span>
        </div>
        
      </div>
      <div className="flex hero justify-between gap-5">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
</svg>

</div>
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
            Accessibility
          </p>
          <p className="text-sm">
           Fine tune postr to be more accessible. Like color mode, font varientation.
          </p>
        </div>
        <a href="/settings/accessibility">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </div>
      <div className="flex hero justify-between gap-5">
      <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
</svg>

          </div>
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
            Display and languages
          </p>
          <p className="text-sm">
           Change content languages, font size, background, and theme. These only affect the current device
          </p>
        </div>
        <a href="/settings/accessibility_display">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </div>
      </div>
    <Bottomnav />
    </>

}
