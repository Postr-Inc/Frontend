 
import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://postrapi.pockethost.io')
import { useEffect } from "react";
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