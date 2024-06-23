'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
 
import User from "@/pages/user/user";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/page";
import { api } from "@/src/api/api";
import Bookmarks from "@/pages/Bookmarks/page";
import Collections from "@/pages/collections/page";
import Post from "@/pages/post/page";
import Settings from "@/pages/settings/page";
export default function Page() {

let [page, changePage] = useState("home");
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState(typeof window !== "undefined" ? localStorage.getItem("lastPage") : "home");
let hasInitialized = useRef(false);
 
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
 
  switch (true) {
    case  api.authStore.isValid() &&  page == "home":
        return (<Home  page={page} key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} currentPage={page} lastPage={lastPage} />) 
    case !api.authStore.isValid():
        return <Login  key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage} /> 
    case  api.authStore.isValid() &&  page == "user":
        return (<User currentPage={page}   key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage}  page={page} />)
        break;
    case api.authStore.isValid() && page == "bookmarks":
        return (<Bookmarks  key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage}  page={page} />)
        break;
    case api.authStore.isValid() && page == "post":
      return <></>
      case api.authStore.isValid() && page == "collections":
      return (<Collections page={page} key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage}  currentPage={page} />)
    case api.authStore.isValid() && page == "settings":
      return (<Settings page={page} key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage} currentPage={page} />)
    default:
        break;
  }
}
 