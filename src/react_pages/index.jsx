import Pocketbase from 'pocketbase'
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase('https://cunning-elk-locally.ngrok-free.app')
console.log(api.baseUrl)
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
				setInterval(() => {
					OneSignal.login(api.authStore.model.id)
				}, 8000)
		 
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
        if (api.authStore.isValid) {
            api.collection("users").authRefresh()
            oneSignal()

        } else if (window.matchMedia("(display-mode: browser)").matches) {
            window.location.href = "/download"

        }

		 
		 
		document.querySelector('html').setAttribute ('data-theme', 'black')

       let theme = localStorage.getItem('theme')
		if(!theme){
			localStorage.setItem('theme', 'black')
			document.querySelector('html').setAttribute('data-theme', 'black')
	
		}else{
			document.querySelector('html').setAttribute('data-theme', theme)
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
				if(e.matches){
					document.querySelector('html').setAttribute('data-theme', 'black')
					localStorage.setItem('theme', 'black')
				}else{
					document.querySelector('html').setAttribute('data-theme', 'light')
					localStorage.setItem('theme', 'light')
				}
			})
	
		}
    }, [])

	const [dailyUsage, setDailyUsage] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	  });
	
	  useEffect(() => {
		// calculate time the app was open each day
		let lastOpened = localStorage.getItem('lastOpened');
		let dailyUsageData = JSON.parse(localStorage.getItem('dailyUsageData')) || {};
	        console.log(dailyUsageData)
		if (lastOpened) {
		  let now = new Date();
		  let last = new Date(lastOpened);
		  let diff = now - last;
		  let days = diff / (1000 * 60 * 60 * 24);
	
		  if (days >= 1) {
			// Calculate daily usage and update state
			const seconds = Math.floor(days) * 24 * 60 * 60;
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;
	
			setDailyUsage({
			  hours,
			  minutes,
			  seconds: remainingSeconds,
			});
	
			// Save daily usage for the current day
			const currentDate = now.toDateString();
			dailyUsageData[currentDate] = dailyUsageData[currentDate] || 0;
			dailyUsageData[currentDate] += seconds;
	
			// Update the 'lastOpened' timestamp and daily usage data
			localStorage.setItem('lastOpened', now);
			localStorage.setItem('dailyUsageData', JSON.stringify(dailyUsageData));
		  }
		} else {
		  // If 'lastOpened' doesn't exist in localStorage, set it now.
		  localStorage.setItem('lastOpened', new Date());
		}
	
		// Add an event listener for beforeunload
		window.addEventListener('beforeunload', handleBeforeUnload);
	
		// Cleanup the event listener when the component unmounts
		return () => {
		  window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	  }, []);
	
	  const handleBeforeUnload = () => {
		let now = new Date();
		let lastOpened = localStorage.getItem('lastOpened');
		let dailyUsageData = JSON.parse(localStorage.getItem('dailyUsageData')) || {};
	
		if (lastOpened) {
		  let last = new Date(lastOpened);
		  let diff = now - last;
		  let days = diff / (1000 * 60 * 60 * 24);
	
		  if (days >= 1) {
			// Calculate daily usage and update state
			const seconds = Math.floor(days) * 24 * 60 * 60;
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;
	
			setDailyUsage({
			  hours,
			  minutes,
			  seconds: remainingSeconds,
			});
	
			// Save daily usage for the current day
			const currentDate = now.toDateString();
			dailyUsageData[currentDate] = dailyUsageData[currentDate] || 0;
			dailyUsageData[currentDate] += seconds;
	
			// Update the 'lastOpened' timestamp and daily usage data
			localStorage.setItem('lastOpened', now);
			localStorage.setItem('dailyUsageData', JSON.stringify(dailyUsageData));
		  }
		  console.log(dailyUsageData)
		}
	  };
	
  
	if(api.authStore.isValid && window.matchMedia('(display-mode: standalone)').matches){
		return (
			<Home/>
		)
	}else if (!api.authStore.isValid && window.matchMedia('(display-mode: standalone)').matches){
		return (
			<Login/>
		)
	}else {
		console.log(window.location.pathname)
		 window.location.pathname = "/download"
	}
}
