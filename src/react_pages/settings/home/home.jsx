import { useState, useRe, useEffect } from "react";
import { api, oneSignal} from "../..";
import Bottomnav from "../../../components/Bottomnav";
import Modal2 from "../../../components/Modal2";
export default function Settings_home() {
  let [emailVisibility, setEmailVisibility] = useState(
    api.authStore.model.emailVisibility
  );
  let [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem("notifications") === "true" ? true : false
  );
  let [recommendation_ratings, setrecommendation_ratings] = useState(
    localStorage.getItem("recommendation_ratings") === "true" ? true : false
  );
  let [theme, setTheme] = useState(
    localStorage.getItem("theme") === "black" ? true : false
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
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
             Your account
          </p>
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
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
             Security  
          </p>
          <p className="text-sm">
          Manage your account security, track and manage account usage
                from different devices, aswell as view apps that you have
                allowed to access your account info.
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
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
             Privacy and safety
          </p>
          <p className="text-sm">
          Manage what content you see, who can see your content, and what data is used to enhance your experience.
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
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
             Notifications
          </p>
          <p className="text-sm">
           Manage what notifications you want to recieve, based on your interests, recommendations, and activities.
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
        <div className="flex flex-col focus:bg-base-300">
          <p className="text-lg font-bold text-base-content">
              Accessibility, display, and languages
          </p>
          <p className="text-sm">
           Manage how content is shown to you
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
