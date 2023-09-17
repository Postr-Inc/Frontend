import Modal from "../components/Modal";
import React, { useEffect, useState } from "react";

export default function Download() {
  let device = navigator.userAgent.toLowerCase();
  let isAndroid = device.indexOf("android") > -1;
  let isIOS = device.indexOf("iphone") > -1;
  let isSafari = device.indexOf("safari") > -1;
  let isMac = device.indexOf("mac os") > -1;
  let isWindows = device.indexOf("windows") > -1;
  let isLinux = device.indexOf("linux") > -1;
  let [deferredPrompt, setDeferredPrompt] = useState(null);
  let [download, setDownload] = useState(
    localStorage.getItem("installed") ? "Open Postr" : "Download Postr"
  );

  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt fired");
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    setDeferredPrompt(e);
  });

  window.addEventListener("appinstalled", (evt) => {
    console.log("appinstalled fired", evt);
    document.getElementById("installed").showModal();
    setDownload("Open Postr");
    window.location.reload();
  });

  if ("getInstalledRelatedApps" in window.navigator) {
    const relatedApps = navigator.getInstalledRelatedApps();
    console.log(relatedApps);
  }

  window
    .matchMedia("(display-mode: standalone)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        window.location.href = "/";
      }
    });

  return (
    <>
      <Modal id="installed" height="h-[50vh]">
        <button className="flex   justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400 w-12 mt-0"></div>
        </button>
        <span className="text-md">
          {" "}
          {isAndroid
            ? "🥳 You have downloaded the apk follow the steps below to use postr!"
            : isIOS
            ? "🥳 You have Added Postr To Your Home Screen"
            : isMac
            ? "🥳 You have Added Postr To Your Dock"
            : isWindows
            ? "🥳 You have Added Postr To Your Taskbar"
            : isLinux
            ? "🥳 You have Added Postr To Your Desktop"
            : "🥳 You have Added Postr To Your Desktop"}
        </span>
        <div className="divider"></div>

        <div className="flex flex-col gap-2">
          <span className="mt-2 ">
            {isAndroid
              ? "Go to the downloads folder or click downloads in your browser and install the apk!"
              : isIOS
              ? "You can now open Postr from your Home Screen"
              : isMac
              ? "You can now open Postr from your Dock"
              : isWindows
              ? "You can now open Postr from your Taskbar"
              : isLinux
              ? "You can now open Postr from your Desktop"
              : "You can now open Postr from your Desktop"}
            .
          </span>
          {!isAndroid && !isIOS ? (
            <button
              className="btn btn-ghost rounded-full border-slate-200 hover:ring-2 hover:ring-rose-500 hover:bg-rose-500 hover:textwhite"
              onClick={() => {
                document.getElementById("installed").close();

                if (isWindows || isLinux || isMac) {
                  window.open("web+postr://launch");
                }
              }}
            >
              Or Launch App
            </button>
          ) : (
            <></>
          )}
        </div>
      </Modal>

      <Modal id="ios" height="h-[50vh]">
        <button className="flex justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400 w-12 mt-0"></div>
        </button>

        <div className="flex flex-col gap-2">
          <span>Install Postr</span>
          <div className="divider"></div>
          <span>To Download Postr for iOS, follow these steps:</span>
          <ol
            className="flex flex-col gap-2 decimal ml-5"
            style={{
              listStyleType: "decimal !important",
            }}
          >
            <li className="flex">
              1. Click The Share Button:&nbsp;
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
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
            </li>
            <li className="flex rounded ">2. Click Add to Home Screen</li>
            <li className="flex rounded  ">3. Click Add</li>
            <li className="flex rounded ">4. Launch the app 🚀</li>
          </ol>
        </div>
      </Modal>

      <div className="h-[30vw] p-5 hero bg-base-100">
        <div className="hero-content text-center flex flex-col lg:flex-row">
          {isWindows || isLinux || isMac ? (
            <img src="/images/feed.png" className=" max-w-md   rounded-lg" />
          ) : (
            <></>
          )}
          <div className="max-w-md flex flex-col">
            <h1 className="text-5xl font-bold">Get Postr For Any Device!</h1>
            <p className="py-6">
              Keep posting wherever you go with our mobile & desktop app.
            </p>
            <button
              className="btn btn-ghost w-50 rounded-full border-slate-200
            hover:ring-2 hover:ring-rose-500 hover:bg-rose-500 hover:text-white"
              onClick={() => {
                if (isIOS && isSafari) {
                  document.getElementById("ios").showModal();
                } else if (deferredPrompt) {
                  if (isAndroid) {
                    let a = document.createElement("a");
                    a.href =
                      "https://github.com/Postr-Inc/Postr-Pwa/releases/download/v6.0.2-android/Postr.apk";
                    a.download = "Postr.apk";
                    a.click();
                    alert(`Downloaded Postr.apk to your downloads folder`);
                    document.getElementById("installed").showModal();
                  } else if (isWindows) {
                    deferredPrompt.prompt();
                  }
                } else {
                  document.getElementById("installed").showModal();
                }
              }}
            >
              {deferredPrompt ? download : "Open Postr"}
            </button>

            {deferredPrompt ? (
              <span className="text-sm mt-2 flex gap-2 text-gray-500 mx-auto">
                For{" "}
                <span className="">
                  {isAndroid
                    ? "Android"
                    : isIOS
                    ? "iOS"
                    : isMac
                    ? "Mac"
                    : isWindows
                    ? "Windows 11/10 64bit"
                    : isLinux
                    ? "Linux"
                    : "Other"}
                </span>
              </span>
            ) : (
              <></>
            )}

            <span className="mt-2">
              By using Postr, you agree to our{" "}
              <a href="/tos" className="text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500">
                Privacy Policy
              </a>
              .
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
