import React from "react";
import Settings_home from "./home/home.jsx";
import Settings_account from "./account/account.jsx";
import Settings_account_information from "./account/account_information.jsx";
import Settings_accessibility_display from "./accessibility&display/."
import Settings_my_accessibility from "./accessibility&display/accessibility.jsx";
import Settings_my_accessibility_display from "./accessibility&display/Display.jsx";
export default function Settings() {
    let page = window.location.pathname.split("/")[2];
    console.log(page)
    if(page === 'home'){
        return <Settings_home />
    }else if (page === 'account'){
        return <Settings_account />
    }else if (page === 'account_information'){
        return <Settings_account_information />
    }else if(page === 'accessbility_home'){
        return  <Settings_accessibility_display />
    }else if(page === 'accessibility'){
        return  <Settings_my_accessibility />
    }else if(page === 'accessibility_display'){
        return <Settings_my_accessibility_display />
         
    }
}