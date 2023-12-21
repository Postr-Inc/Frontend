"use client";
import postrSdk from "../sdk";

 
export const api  = new postrSdk({
    wsUrl: "localhost:8080",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});