'use client';
import { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"; 
import User from "@/pages/user/user";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/page";
import { api } from "@/src/api/api";
import Bookmarks from "@/pages/Bookmarks/page";
import Collections from "@/pages/collections/page";
import Post from "@/pages/status/page";
import ResettPassword from "@/pages/auth/forgotPassword/forgotPassword";
import ResetPassword from "@/pages/auth/forgotPassword/ResetPassword";
import Settings from "@/pages/settings/page";
import Status from "@/pages/status/page";
import Register from "@/pages/auth/register/page";
import Finish from "@/pages/auth/register/continue/FinishSignup";
export default function Page() {
if(typeof window === "undefined") return null 
let searchParams = new URLSearchParams(window.location.search);

let [page, changePage] = useState(searchParams.has("view") ? "view" :  searchParams.has("forgot_password") ? "resetPassword" : "home");
if(!window.location.href.includes('forgot_password') && page == "resetPassword"){
  changePage("home") 
}
 
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState("home");
let [poorConnection, setPoorConnection] = useState(false);
let [dismissToast, setDismissToast] = useState(false);
let [isViewingStatus, setIsViewingStatus] = useState(searchParams.has("view"));
let [dontShowAlert, setDontShowAlert] = useState(false);
let hasInitialized = useRef(false);
let darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
window.theme = darkMode ? "dark" : "light";
//@ts-ignore
window.theme = darkMode ? "dark" : "light";
 
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
   
if (darkMode) {
  document.documentElement.setAttribute("data-theme", "black"); 
}
  if (!hasInitialized.current && typeof window !== "undefined") {
    hasInitialized.current = true;
      
    api.events.on("offline", () => {
      setPoorConnection(true);
    });

     
    api.authStore.onChange(() => { 
      console.log(api.authStore.isValid())
      if (!api.authStore.isValid() && api.authStore.model() && page !== "login"
    && !isViewingStatus
    ) {
         api.authStore.refreshToken()
      }else if(api.authStore.isValid()){
        console.log("Auth store is valid")
        changePage("home")
      } 
    });
    
    

    // refresh every 15 minutes
    const  refresh = () => {
       api.authStore.refreshToken()
       setTimeout(() => {
        refresh()
       }, 1000 * 60 * 15);
    }
    refresh()
  }
  return () => { hasInitialized.current = false };
  
}, []);

console.log(page)

 
if(!api.authStore.isValid() && page !== "login" && page !== "register" && page !== "signup/finish" && page !== "forgotPassword"
&& page !== "resetPassword"){  
  changePage("login")
}

 
useEffect(() => { 
  if (page !== lastPage && page !== 'user' && page !== 'settings' && page !== 'view') {
    setLastPage(page);
  } 
}, [page, lastPage]);
 
 
switch(true){
  case  page == "home":
    return <Home 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      theme={darkMode ? "dark" : "light"}
      setLastPage={setLastPage}
      currentPage={page}
      lastPage={lastPage}
    />
  
  case api.authStore.isValid() && page == "user":
    return <User
      currentPage={page}
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage} 
      page={page}
    />
  case api.authStore.isValid() && page == "bookmarks":
    return <Bookmarks
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      page={page}
    />
  case api.authStore.isValid() && page == "post":
    return <></>
  case api.authStore.isValid() && page == "collections":
    return <Collections
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
  case api.authStore.isValid() && page == "settings":
    return <Settings
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      currentPage={page}
    />
  case api.authStore.isValid() && page == "view" || api.authStore.isValid() && isViewingStatus:
    return <Status 
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
  case page == "register":
    return <Register {...{
      key: crypto.randomUUID(),
      swapPage: changePage,
      setParams: setParams,
      params: params,
      currentPage: page,
      setLastPage: setLastPage,
      lastPage: lastPage,
    }}/>
  case page == "signup/finish":
    return <Finish {...{
      key: crypto.randomUUID(),
      swapPage: changePage,
      setParams: setParams,
      params: params,
      currentPage: page,
      setLastPage: setLastPage,
      lastPage: lastPage,
    }} />
    case page == "forgotPassword":
      return <ResettPassword 
        key={crypto.randomUUID()}
        swapPage={changePage}
        setParams={setParams}
        params={params}
        setLastPage={setLastPage}
        lastPage={lastPage}
        currentPage={page}
      />
    case page == "resetPassword":
      return <ResetPassword
        key={crypto.randomUUID()}
        swapPage={changePage}
        setParams={setParams}
        params={params}
        setLastPage={setLastPage}
        lastPage={lastPage}
        currentPage={page}
      />
  default: 
    return <Login
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      currentPage={page}
      setLastPage={setLastPage}
      lastPage={lastPage}
    />
}
 

   
}
 
