import React from  'react'
import Bottomnav from "../../../components/Bottomnav";
import { api } from "../..";
export default function Settings_accessibility_display(){
    console.log('e')
    return <>
    <div className="p-4 flex flex-col  gap-8 mb-24">
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
          <span className="font-semibold text-lg">Accessibility, display, and languages</span>
          <span className="text-[12px] text-base-900">
            @
            {api.authStore.model.username +
              "_" +
              api.authStore.model.id.substring(0, 7)}
          </span>
        </div>
        
      </div>
      <div className="flex hero justify-between gap-5">
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
