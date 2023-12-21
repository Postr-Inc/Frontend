'use client';
import { useCallback, useEffect, useRef, useState } from "react";
 
import User from "@/pages/user/user";
import Home from "@/pages/home/home";
import Login from "@/pages/auth/page";
import { api } from "@/src/api/api";
 
export default function Page() {
 
let [page, changePage] = useState("home");
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState("home");
let hasInitialized = useRef(false);
   
useEffect(() => {
  if (!hasInitialized.current && typeof window !== "undefined") {
    hasInitialized.current = true;
    if(!api.authStore.isValid()){
      changePage("login");
      return;
    }
    api.authStore.update()
    console.log("updating auth store");
  }
  return () => { hasInitialized.current = false };
  
}, []);
  switch (true) {
    case    page == "home":
        return (<Home   key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} currentPage={page} lastPage={lastPage} />)
        break;
    case page == "login":
        return (<Login  key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage} />)
        break;
    case page == "user":
        return (<User   key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} lastPage={lastPage}  page={page} />)
        break;
    default:
        return (<Home   key={crypto.randomUUID()} swapPage={changePage} setParams={setParams} params={params} setLastPage={setLastPage} currentPage={page} lastPage={lastPage} />)
        break;
  }
}
 