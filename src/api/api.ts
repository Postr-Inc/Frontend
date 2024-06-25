"use client";
import postrSdk from "../sdk";
export const api  = new postrSdk({
    wsUrl: "anemic.postr.rf.gd",
    pbUrl: "https://postrapi.pockethost.io",
    cancellation: true
});