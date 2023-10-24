import { useState, useRe, useEffect } from "react";
import { api, oneSignal } from "../..";
import Bottomnav from "../../../components/Bottomnav";
import Modal2 from "../../../components/Modal2";
export default function Settings_home() {
  let [emailVisibility, setEmailVisibility] = useState(
    api.authStore.model.emailVisibility,
  );
  let [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem("notifications") === "true" ? true : false,
  );
  let [recommendation_ratings, setrecommendation_ratings] = useState(
    localStorage.getItem("recommendation_ratings") === "true" ? true : false,
  );
  let [theme, setTheme] = useState(
    localStorage.getItem("theme") === "black" ? true : false,
  );

  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "black");
      document.querySelector("html").setAttribute("data-theme", "black");
    } else {
      document.querySelector("html").setAttribute("data-theme", theme);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (e.matches) {
            document.querySelector("html").setAttribute("data-theme", "black");
            localStorage.setItem("theme", "black");
          } else {
            document.querySelector("html").setAttribute("data-theme", "white");
            localStorage.setItem("theme", "white");
          }
        });
    }
  }, [theme]);
  return (
    <>
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
            <span className="font-semibold text-lg">Settings</span>
            <span className="text-[12px] text-base-900">
              @
              {api.authStore.model.username +
                "_" +
                api.authStore.model.id.substring(0, 7)}
            </span>
          </div>
        </div>
        <div className="justify-center  ">
          <input
            placeholder="Search settings"
            className="input input-bordered input-md rounded-full w-5/8 flex justify-center hero"
          />
        </div>

        <div className="flex hero justify-between gap-5">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">Your account</p>
            <p className="text-sm">
              See information about your account, download your data, or view
              the deactivation process.
            </p>
          </div>
          <a href="/settings/account">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">Security</p>
            <p className="text-sm">
              Manage your account security, track and manage account usage from
              different devices, aswell as view apps that you have allowed to
              access your account info.
            </p>
          </div>
          <a href="/settings/security">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">
              Privacy and safety
            </p>
            <p className="text-sm">
              Manage what content you see, who can see your content, and what
              data is used to enhance your experience.
            </p>
          </div>
          <a href="/settings/privacy">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">Notifications</p>
            <p className="text-sm">
              Manage what notifications you want to recieve, based on your
              interests, recommendations, and activities.
            </p>
          </div>
          <a href="/settings/notifications">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">
              Accessibility, display, and languages
            </p>
            <p className="text-sm">
              Manage how content is displayed on your device, change contrast,
              font size and color mode.
            </p>
          </div>
          <a href="/settings/accessbility_home">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
              />
            </svg>
          </div>
          <div className="flex flex-col focus:bg-base-300">
            <p className="text-lg font-bold text-base-content">
              Version, support, legal
            </p>
            <p className="text-sm">
              Manage your app version, get support, and view our legal policies.
            </p>
          </div>
          <a href="/settings/additional">
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
  );
}
