 
import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect, useState } from "react";
export default function App() {
	useEffect(() => {
		if (window.matchMedia("(display-mode: browser)").matches) {
			window.location.href = "/download"
			
		}else{
			api.authStore.isValid  ? api.collection("users").authRefresh() :  console.log('not logged in')
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
