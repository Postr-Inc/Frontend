"use client";
import postrSdk from "../sdk";
export const api  = new postrSdk({
    wsUrl: "daring-troll-greatly.ngrok-free.app",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});