'use client';
import { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"; 
import User from "@/pages/user/user";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/page";
import { api } from "@/src/api/api";
import Bookmarks from "@/pages/Bookmarks/page";
import Collections from "@/pages/collections/page";
import Post from "@/pages/status/page";
import Settings from "@/pages/settings/page";
import Status from "@/pages/status/page";
export default function Page() {
if(typeof window === "undefined") return null 
let searchParams = new URLSearchParams(window.location.search);

let [page, changePage] = useState(api.authStore.model() ? searchParams.get("view") || "home" : "login");
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState("home");
let [poorConnection, setPoorConnection] = useState(false);
let [dismissToast, setDismissToast] = useState(false);
let [isViewingStatus, setIsViewingStatus] = useState(searchParams.has("view"));
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
      
    api.events.on("offline", () => {
      setPoorConnection(true);
    }); 
    api.authStore.onChange(() => { 
      if (!api.authStore.isValid() && api.authStore.model() && page !== "login"
    && !isViewingStatus
    ) {
         api.authStore.refreshToken()
      }else if(api.authStore.isValid()){ 
        changePage("home") 
      }else{
         api.authStore.clear()
      }
    });
    setInterval(() => {
      if(!api.authStore.isValid() && !api.authStore.model() && page !== "login" && !isViewingStatus){ 
         api.authStore.refreshToken()
      } 
    }, 1000);  
  }
  return () => { hasInitialized.current = false };
  
}, []);

 
useEffect(() => { 
  if (page !== lastPage && page !== 'user' && page !== 'settings' && page !== 'view') {
    setLastPage(page);
  } 
}, [page, lastPage]);

   return <div>

{

    page == "home"   ? (
    <Home 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      currentPage={page}
      lastPage={lastPage}
    />
   ) :   page == "user" ? (
    <User
      currentPage={page}
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage} 
      page={page}
    />
    )  :  page == "bookmarks" ? (
    <Bookmarks
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      page={page}
    />
    ) :  page == "post" ? (
    <></>
    ) : page == "collections" ? (
    <Collections 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
    ) : page == "settings" ? (
    <Settings 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
    ) :
    page == "view" ||   isViewingStatus ? (
       <Status 
        {...{
          key: crypto.randomUUID(),
          swapPage: changePage,
          setParams: setParams,
          params: params,
          setLastPage: setLastPage,
          lastPage: lastPage,
          currentPage: page,
          id: searchParams.get("id") || "",
          type: searchParams.get("type") || "",
        }}
        ></Status>
    )
    :
    (
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
 