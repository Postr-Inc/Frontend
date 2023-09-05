import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect, useState } from "react";
let init = false
export default function App() {
	const [isTokenFound, setTokenFound] = useState(false);
	 

	useEffect(() => {
		if(api.authStore.isValid){
			api.collection("users").authRefresh()
			 window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(function(OneSignal) {
    OneSignal.init({
      appId: "b1beca0d-bf7b-4767-9637-7e345fff7710",
    }).then(()=>{
console.log('notifications on')
    })
  }); 
    	 
		}else if (window.matchMedia("(display-mode: browser)").matches) {
			 window.location.href = "/download"
			 
			}
		   
	}, [])
 
 
	 
	return api.authStore.isValid ? 
	   (
		 <Home />
	 )
	 :   (
		 <Login />
	 )
}
