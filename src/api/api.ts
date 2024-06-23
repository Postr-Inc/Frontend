"use client";
import postrSdk from "../sdk";
export const api  = new postrSdk({
    wsUrl: "anemic.postr.rf.gd",
    pbUrl: "",
    cancellation: true
});