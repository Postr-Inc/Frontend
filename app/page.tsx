'use client';
import { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"; 
import User from "@/pages/user/user";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/page";
import { api } from "@/src/api/api";
import Bookmarks from "@/pages/Bookmarks/page";
import Collections from "@/pages/collections/page";
import Post from "@/pages/post/page";
import Settings from "@/pages/settings/page";
export default function Page() {
if(typeof window === "undefined") return null
let [page, changePage] = useState("home");
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState(typeof window !== "undefined" ? localStorage.getItem("lastPage") : "home");
let [poorConnection, setPoorConnection] = useState(false);
let [dismissToast, setDismissToast] = useState(false);
let [dontShowAlert, setDontShowAlert] = useState(false);
let hasInitialized = useRef(false);
 
window.addEventListener("online", (d) => {
  //@ts-ignore
  let data = d.detail.online.get("latency"); 
  if (data > 2000) {
    setPoorConnection(true);
  } else {
    setPoorConnection(false);
  }
});

useEffect(() => {
  if (!hasInitialized.current && typeof window !== "undefined") {
    hasInitialized.current = true;
    if(!api.authStore.model){
      alert(true)
    } 
    api.authStore.onChange(() => {
      console.log("Auth store changed"); 
      if (!api.authStore.isValid()) {
        changePage("login");
      }else if(api.authStore.isValid()){
        console.log("Auth store is valid")
        changePage("home") 
      }
    });
    api.authStore.update()
  }
  return () => { hasInitialized.current = false };
  
}, []);

useEffect(() => {
  // Check if the target page is 'users', prevent navigation if it is
    if (page !== lastPage && page !== 'user' && page !== 'settings') {
    console.log("Navigating to page", page);
    setLastPage(page);
  }
}, [page, lastPage]);

   return <div>

{

   api.authStore.isValid() && page == "home" ? (
    <Home 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      currentPage={page}
      lastPage={lastPage}
    />
   ) :  api.authStore.isValid() && page == "user" ? (
    <User
      currentPage={page}
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage} 
    />
    )  :  api.authStore.isValid() && page == "bookmarks" ? (
    <Bookmarks
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      page={page}
    />
    ) : api.authStore.isValid() && page == "post" ? (
    <></>
    ) : api.authStore.isValid() && page == "collections" ? (
    <Collections 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
    ) : api.authStore.isValid() && page == "settings" ? (
    <Settings 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
    ) : (
    <Login
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
    />
    )
}
   
{poorConnection && !dismissToast && !dontShowAlert ? (
            <div
              onClick={() => {
                setDismissToast(true);
                setDontShowAlert(true);
              }}
              className="toast toast-end sm:toast-center  text-sm sm:hidden xsm:hidden  sm:top-0 "
            >
              <div className="alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box">
                <span>
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
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </span>
                <p>
                  Poor connection detected.
                  <p>Likely due to your internet connection.</p>
                  <span className="text-sm"> Click to Dismiss</span>
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
   </div>

   
}
 