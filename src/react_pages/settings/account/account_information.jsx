import React, { useState } from "react";
import Bottomnav from "../../../components/Bottomnav";
import { api } from "../..";

export default function Settings_account_information() {
  let [accessbile, setaccessible] = useState(
    JSON.parse(localStorage.getItem("accessbile")),
  );
  let theme = document.documentElement.getAttribute("data-theme");
  return (
    <div className="p-5 flex flex-col  gap-8 mb-24">
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
            className={`w-6 h-6  ${
              accessbile && theme === "black"
                ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }`}
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="flex flex-col hero">
          <span
            className={`text-lg font-semibold  ${
              accessbile && theme === "black"
                ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }`}
          >
            Account
          </span>
          <span
            className={`${localStorage.getItem("font-size") || "text-sm"}   ${
              accessbile && theme === "black"
                ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                : accessbile && theme === "light"
                ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                : ""
            }`}
          >
            @
            {api.authStore.model.username +
              "_" +
              api.authStore.model.id.substring(0, 7)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <ul className="flex flex-col gap-5">
          <li className="flex justify-between">
            <p
              className={`${localStorage.getItem("font-size") || "text-sm"}   ${
                accessbile && theme === "black"
                  ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                  : accessbile && theme === "light"
                  ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                  : ""
              }`}
            >
              Username
            </p>
            <div className="flex gap-2">
              <p
                className={`${
                  localStorage.getItem("font-size") || "text-sm"
                }  ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                @{api.authStore.model.username}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6  ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </li>
          <li className="flex justify-between">
            <p
              className={`${localStorage.getItem("font-size") || "text-sm"}   ${
                accessbile && theme === "black"
                  ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                  : accessbile && theme === "light"
                  ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                  : ""
              }`}
            >
              Phone
            </p>
            <div className="flex gap-2  ">
              <p
                className={`${
                  localStorage.getItem("font-size") || "text-sm"
                }   ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                {api.authStore.model.phone_number
                  ? api.authStore.model.phone_number
                  : "Not set"}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6  ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </li>
          <li className="flex justify-between hero">
            <p
              className={`${localStorage.getItem("font-size") || "text-sm"}   ${
                accessbile && theme === "black"
                  ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                  : accessbile && theme === "light"
                  ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                  : ""
              }`}
            >
              Email
            </p>
            <div className="flex gap-2  ">
              <p
                className={`${
                  localStorage.getItem("font-size") || "text-sm"
                }  ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                {api.authStore.model.email}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 ${
                  accessbile && theme === "black"
                    ? `
              text-white antialiased   drop-shadow-md not-sr-only  
              `
                    : accessbile && theme === "light"
                    ? `
               text-black  antialiased   drop-shadow-md not-sr-only 
              `
                    : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </li>
        </ul>
        <button
          className={` mt-8  text-error  ${
            accessbile && theme === "black"
              ? `
              text-red-500 antialiased   drop-shadow-md not-sr-only  
              `
              : accessbile && theme === "light"
              ? `
               text-red-500 antialiased   drop-shadow-md not-sr-only 
              `
              : ""
          }  capitalize font-bold text-[18px]`}
          onClick={() => {
            api.authStore.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
      <Bottomnav />
    </div>
  );
}
