import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect, useState } from "react";
let init = false
export default function App() {
    const [isTokenFound, setTokenFound] = useState(false);
    function notifyMe() {
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            const notification = new Notification("Hi there!");
            
        } else  {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    const notification = new Notification("Hi there!");
                     
                }
            });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
    }

    useEffect(() => {
        notifyMe()
        if (api.authStore.isValid) {
            api.collection("users").authRefresh()
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(function (OneSignal) {
                OneSignal.init({
                    appId: "b1beca0d-bf7b-4767-9637-7e345fff7710",
                }).then(() => {
                    console.log('notifications on')
                    
                    OneSignal.login(api.authStore.model.id)
                    .then(()=>{
                        alert('working')
                    })
                })
            });

        } else if (window.matchMedia("(display-mode: browser)").matches) {
            window.location.href = "/download"

        }

    }, [])



    return api.authStore.isValid ?
        (
            <Home />
        )
        : (
            <Login />
        )
}
