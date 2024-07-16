"use client";
import postrSdk from "../sdk";
let urls = {
    dev: `localhost:8080`,
    prod: `anemic.postr.rf.gd`
}
export const api  = new postrSdk({
    wsUrl: urls.prod,
    pbUrl: "https://postrapi.pockethost.io",
    cancellation: true
});

 
