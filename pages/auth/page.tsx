"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/src/api/api";
import Footer from "@/app/footer";
import { Props } from "@/src/@types/types";

export default function Login(props:
  Props
) {
  if (typeof window === "undefined") return null;
  let [isClient, setClient] = useState(false);
  let [password, setPassword] = useState("");
   let [email, setEmail] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setClient(true);
  }, []);
  if (api.authStore.isValid()) {
    props.swapPage("home");
  }
  let curTheme = " ";
  if (typeof window !== "undefined")
    curTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "darkMode"
      : "lightMode";
  let [btnState, setBtnState] = useState(false);

 function login(){ 
     api.authStore.login(email, password).then((data) => {
      props.swapPage("home");
    }).catch((error) => {
      console.log(error);
    }); 
  }
  useEffect(() => {
    
    if (!btnState) {
      setTimeout(() => {
        setBtnState(false);
      }, 1000);
    }
  }, [btnState]); 

   
  return (
    <>
     <div
     key={props.key}
     className=" relative    p-5 w-screen  justify-center flex flex-col gap-5 mx-auto
    xl:w-[30vw] lg:w-[50vw]
    "  >


       <div className=' mb-12 flex flex-col gap-5  w-full'>
          <p className=' mt-2 text-2xl w-full '>
             Sign in to Postr
          </p>

       </div>
       <label htmlFor='email' >
          Email
       </label>
       <div className='relative w-full'>
          <input name='email'  
            onChange={(e)=>{setEmail(e.target.value)}}
           type='email' className='input rounded input-bordered w-full'></input>
       
           

       </div>
       <label htmlFor='password'>
          Password
       </label>
     

       <input name='password' type='password' className='input rounded input-bordered w-full'
       onChange={(e)=>{setPassword(e.target.value)}}
       ></input>

       <button
         onClick={() => {
            setBtnState(true);
            login(); 
         }}
           
          className='btn  text-white rounded hover:bg-rose-500  bg-rose-500 relative'>
          Login
        


       </button>

      <a 
      onClick={()=>{
        props.swapPage('forgotPassword')
      }}
      className='text-xs cursor-pointer text-rose-500'>Forgot password?</a>
      <a  
      onClick={()=>{props.swapPage('register')}}
      className='text-xs  cursor-pointer text-rose-500'>Create account</a>
    </div>
    </>
  );
}
