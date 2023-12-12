"use client";
import { useEffect, useState } from "react";
import Login from "./auth/login/login";
import Home from "./home/home";
import postrSdk from "@/src/sdk/postrSDK";
import User from "./u/[user]/user";
export const api = new postrSdk({
    wsUrl: "localhost:8080",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});
import { useRef } from "react";
import Bookmarks from "./bookmarks/bookmarks";
import { useSearchParams } from "next/navigation";

export default function App() {
    let isDesktop =
        !("ontouchstart" in window) ||
        (navigator.maxTouchPoints > 0) &&
        !window.matchMedia("(display-mode: standalone)").matches;
    let [page, changePage] = useState("home");
    let [params, setParams] = useState<any>({});
    let [lastPage, setLastPage] = useState("home");

    
    switch (true) {
        case isDesktop && !api.authStore.isValid:
            return <Login swapPage={changePage} />;
        case isDesktop && api.authStore.isValid && page === "home":
            return <Home swapPage={changePage} setParams={setParams} />;
        default:
        case isDesktop && api.authStore.isValid && page === "user":
            return (
                <User
                    key={crypto.randomUUID()}
                    swapPage={changePage}
                    setParams={setParams}
                    lastPage={lastPage}
                    params={params}
                />
            );
        case isDesktop && api.authStore.isValid && page === "bookmarks":
            return (
                 <Bookmarks
                    key={crypto.randomUUID()}
                    swapPage={changePage}
                    setParams={setParams}
                    lastPage={lastPage}
                    params={params}
                />
            );
    }
}
