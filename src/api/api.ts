"use client";
import postrSdk from "../sdk";

 
export const api  = new postrSdk({
    wsAuthUrl: "http://localhost:8080",
    wsUrl: "localhost:8080",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});