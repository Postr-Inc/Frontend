import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect, useState } from "react";
let init = false
window.OneSignalDeferred = window.OneSignalDeferred || [];
export function oneSignal(){
	 
 if(!init){
	return OneSignalDeferred.push(function (OneSignal) {
		OneSignal.init({
			appId: "b1beca0d-bf7b-4767-9637-7e345fff7710",
			allowLocalhostAsSecureOrigin: true
		}).then(() => {
		 
			if(localStorage.getItem('notifications') === 'true'){
				OneSignal.login(api.authStore.model.id)
		 
			}else{
				OneSignal.logout(api.authStore.model.id)
				 
			}
		})
		 
		init = true
		return OneSignal
	});
 }else{
	 if(localStorage.getItem('notifications') === 'true'){
		OneSignal.login(api.authStore.model.id)
	 }
	 else{
		OneSignal.logout(api.authStore.model.id)
	 }
 }
}
 
export default function App() {
 
	api.authStore.onChange((user) => {
		oneSignal()
	})
    useEffect(() => {
      if (window.matchMedia("(display-mode: browser)").matches) {
            window.location.href = "/download"

        }
        if (api.authStore.isValid) {
            api.collection("users").authRefresh()
            oneSignal()

        } 
        

        window.onerror = (e) =>{
            alert(e)
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
