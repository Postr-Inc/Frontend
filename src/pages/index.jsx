import { useEffect, useState } from "react";
import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
export default function App() {
	useEffect(() => {
		api.collection("users").authRefresh()
	}, [])
	return api.authStore.isValid ? 
	   (
		 <Home />
	 )
	 :   (
		 <Login />
	 )
}