"use client";
import { useEffect, useState } from "react";
import Login from "./auth/login/login";
import Home from "./home/home";
import {postrSdk} from "@/src/sdk/postrSDK";
import User from "./u/[user]/user";
export const api: any = new postrSdk({
    wsUrl: "localhost:8080",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});
import { useRef, memo } from "react";
import Bookmarks from "./bookmarks/bookmarks";
import { useSearchParams } from "next/navigation";

const Page = memo(function Page() {
    let isDesktop =
    !("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0) &&
    !window.matchMedia("(display-mode: standalone)").matches;
let [page, changePage] = useState("home");
let [params, setParams] = useState<any>({});
let [lastPage, setLastPage] = useState("home");
let auth = api.authStore.isValid;

switch (true) {
    case isDesktop && api.authStore.isValid && page === "home":
         
        return <Home 
         swapPage={changePage} 
         setParams={setParams} 
         lastPage={lastPage} 
         params={params}
      
         setLastPage={setLastPage}
        />;
    case !api.authStore.isValid && isDesktop:
       
        return <Login swapPage={changePage}   />;
     
    default:
    case isDesktop && api.authStore.isValid && page === "user":
        return (
            <User
               
                swapPage={changePage}
              
                setParams={setParams}
                setLastPage={setLastPage}
                lastPage={lastPage}
                params={params}
            />
        );
    case isDesktop && api.authStore.isValid && page === "bookmarks":
        return (
             <Bookmarks
                key={crypto.randomUUID()}
                swapPage={changePage}
                
                setLastPage={setLastPage}
                setParams={setParams}
                lastPage={lastPage}
                params={params}
            />
        );
}
});
export default Page