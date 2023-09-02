 
import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "../react_pages/Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect } from "react";
import OneSignal from 'react-onesignal';
let init = false
export default function App() {
	useEffect(() => {
		if(api.authStore.isValid){
			api.collection("users").authRefresh()
			async function load(){
				await OneSignal.init({
					appId: "b1beca0d-bf7b-4767-9637-7e345fff7710",
					allowLocalhostAsSecureOrigin: true
				}).then(() => {
					console.log('OneSignal Initialized');
				    OneSignal.login(api.authStore.model.id)
					init = true
				})
				 
			 }
			 if(!init){
				load()
			 }
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
