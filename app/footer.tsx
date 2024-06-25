"use client";

import { api } from "@/src/api/api";
import { useEffect, useState } from "react";

export default function Footer(props:any){
    let [isClient, setClient] = useState(false) 
    useEffect(() => {
        if(typeof window !== "undefined") setClient(true) 
    }, [])
    return(
        isClient && <>
         <div className={` ${props.className}  flex hero flex-row flex-wrap w-full   gap-5 mx-auto justify-center   xl:w-[30vw]   lg:w-[50vw]`}>
            &copy; {new Date().getFullYear()} - Pascal
            <button className='btn-sm btn '>Status: {
             api.checkConnection() ? <span className='text-success'>Online</span> : <span className='text-error'>Offline</span>    
            }</button>
            <span className=''>Download Postr</span>
            <span className=''>Developers</span>
         </div> 
        </>
    )
}