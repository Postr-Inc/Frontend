//@ts-nocheck
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
import AI from "@/pages/ai/page";
import PostEngagements from "@/pages/post_engagemnets/page";
import Messages from "@/pages/messages/page";
export default function Page() {
if(typeof window === "undefined") return null 
let searchParams = new URLSearchParams(window.location.search);

let [page, _changePage] = useState(searchParams.has("view") ? "view" :  searchParams.has("forgot_password") ? "resetPassword" : "home");
 
if(!window.location.href.includes('forgot_password') && page == "resetPassword"
&& !page == "view"
){
  
}
 
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState("home");
let [poorConnection, setPoorConnection] = useState(false);
let [dismissToast, setDismissToast] = useState(false);
let [isViewingStatus, setIsViewingStatus] = useState(searchParams.has("view"));
let [dontShowAlert, setDontShowAlert] = useState(false);
let hasInitialized = useRef(false);
let darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches; 
//@ts-ignore
window.theme = darkMode ? "dark" : "light";
 
window.users = [];

window.addEventListener("online", (d) => {
  //@ts-ignore
  let data = d.detail.online.get("latency"); 
  if (data > 2000) {
    setPoorConnection(true);
  } else {
    setPoorConnection(false);
  }
});
let [pageQueue, setPageQueue] = useState<any[]>([
  "home",
]);
let [pageQueueIndex, setPageQueueIndex] = useState(0);
let [lastPageParams, setLastPageParams] = useState<any>([]);
function goBack() { 
  if (pageQueue.length > 1) {
    setPageQueueIndex(pageQueueIndex - 1);
    setParams(lastPageParams[pageQueueIndex - 1]);
    setLastPageParams(lastPageParams.slice(0, lastPageParams.length - 1));
    setPageQueue(pageQueue.slice(0, pageQueue.length - 1));
    _changePage(pageQueue[pageQueueIndex - 1]);
  } else {
    _changePage("home");
  }
}

function changePage(page: any) {
  setPageQueue([...pageQueue, page]);
  setPageQueueIndex(pageQueueIndex + 1);
  setLastPageParams([...lastPageParams, params]);
  console.log(pageQueue)
  _changePage(page);
}

if(api.authStore.isValid() && !api.isSubscribed("posts") && !api.isSubscribed("users")){
  api.subscribe({collection:"posts", event:"*"}, (e: any) => { 
    console.log(e)
     if(e.event == "update" && e.record.expand.author.id !== api.authStore.model().id){
          for(var i of api.cacheStore.keys()){
              let data = JSON.parse(api.cacheStore.get(i)).value.items; 
              if(data){
                for(var post of data){
                  if(post.id === e.record.id){
                    post = e.record;
                    data = data.map((e: any) => e.id === post.id ? post : e)
                  }
                }  
                api.cacheStore.set(i, {totalPages:api.cacheStore.get(i).totalPages, items:data}, 1200)
              }
             
          }
     }
  });
  api.subscribe({collection:"users", event:"*"}, (e: any) => {
    if(e.event == "update" && e.record.id === api.authStore.model().id){
      api.authStore.model(e.record)
    }else{ 
      for(var i of api.cacheStore.keys()){ 
        if(i.includes('user-profile') && i.includes(e.record.id)){
          console.log(i)
          let data = JSON.parse(api.cacheStore.get(i)).value;
          data = e.record;
          api.cacheStore.set(i, data, 1200) 
        }else if(i.includes('user-home') && i.includes('following') &&  !e.record.followers.includes(api.authStore.model().id)){  
          api.cacheStore.delete(i)
        }else{
          api.cacheStore.delete(i)
        }
      }
    }
  });
  console.log("Subscribed to posts")
} 

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
      if (!api.authStore.isValid() && api.authStore.model() && page !== "login"
    && !isViewingStatus
    ) {
         api.authStore.refreshToken()
      }else if(api.authStore.isValid() && page == "login" ){
        console.log("Auth store is valid")
        changePage("home")
      } 
    });
    
    
    api.authStore.checkToken(api.authStore.model().token).then((d) => {
      console.log(d)
       if(d.isExpired && d.isValid){
         api.authStore.refreshToken()
         changePage("home")
       }  else if(d.isExpired && !d.isValid && page !== "login" && page !== "register" && page !== "signup/finish" && page !== "forgotPassword"){
           localStorage.removeItem("postr_auth")
           changePage("login")
           window.location.reload()
       }
    });
    

    // refresh every 15 minutes
    const  refresh = () => {
        if(!api.authStore.isValid() && page !== "login" && page !== "register" && page !== "signup/finish" && page !== "forgotPassword"
        && page !== "resetPassword" && api.authStore.model()){
          api.authStore.refreshToken()
        } 
        if(page !== "login" && page !== "register" && page !== "signup/finish" && page !== "forgotPassword"){
          setTimeout(() => {
        refresh()
       }, 1000 * 60 * 15);
        }
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
      goBack={goBack}
      changePage={changePage}
      lastPage={lastPage}
    />
  
  case api.authStore.isValid() && page == "ai":
    return <AI 
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage}
      changePage={changePage}
      goBack={goBack}
      currentPage={page}
    />
  case api.authStore.isValid() && page == "messages":
    return <Messages
    key={crypto.randomUUID()}
    swapPage={changePage}
    setParams={setParams}
    params={params}
    setLastPage={setLastPage}
    lastPage={lastPage}
    changePage={changePage}
    goBack={goBack}
    currentPage={page}
    ></Messages>
  case api.authStore.isValid() && page == "postEngagement":
    return <PostEngagements
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params}
      setLastPage={setLastPage}
      lastPage={lastPage} 
      changePage={changePage}
      goBack={goBack}
      currentPage={page}
    ></PostEngagements>
  case api.authStore.isValid() && page == "user":
    return <User
      currentPage={page}
      key={crypto.randomUUID()}
      swapPage={changePage}
      setParams={setParams}
      params={params} 
      changePage={changePage}
      goBack={goBack}
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
      changePage={changePage}
      goBack={goBack}
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
      changePage={changePage}
      goBack={goBack}
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
      changePage={changePage}
      goBack={goBack}
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
          changePage: changePage,
          goBack: goBack,
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
      changePage: changePage,
      goBack: goBack,
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
      changePage: changePage,
      goBack: goBack,
      setLastPage: setLastPage,
      lastPage: lastPage,
    }} />
    case page == "forgotPassword":
      return <ResettPassword 
        key={crypto.randomUUID()}
        swapPage={changePage}
        setParams={setParams}
        params={params} 
        changePage={changePage}
        goBack={goBack}
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
        changePage={changePage}
        goBack={goBack}
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
      changePage={changePage}
      goBack={goBack}
      currentPage={page}
      setLastPage={setLastPage}
      lastPage={lastPage}
    />
}
 

   
}
 
