//@ts-nocheck
"use client"; 
import { Props } from "@/src/@types/types";
import { api } from "@/src/api/api";
import { useState } from "react";
export default function ResetPassword(
    props: Props
){
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [email, setEmail] = useState("");
    let [error, setError] = useState("");
    let [success, setSuccess] = useState("");
    let [hasError, setHasError] = useState(false);
    let [loading, setLoading] = useState(false);
    let params = new URLSearchParams(window.location.search);
    if(!params.get("token")) props.swapPage("forgotPassword");
    function testPassword(){
        console.log(password.length)
        if(password.length < 8){
            setError("Password must be at least 8 characters and less than 50 characters");
            setHasError(true);
            let timeout = setTimeout(() => {
                setError("");
                setHasError(false);
                clearTimeout(timeout);
            }, 2000);
            return false;
        }
        if(password !== confirmPassword){
            setError("Passwords do not match");
            let timeout = setTimeout(() => {
                setError("");
                clearTimeout(timeout);
            },  2500);
            return false;
        }
        // check consistency of password
        // check length of password

        let tokens = password.split("");
        let char = false;
        let num = false;
        let special = false;
        for(let i = 0; i < tokens.length; i++){
            if(tokens[i].match(/[a-zA-Z]/)){
                char = true;
            }
            if(tokens[i].match(/[0-9]/)){
                num = true;
            }
            if(tokens[i].match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                special = true;
            }
        }
        if(!char){
            setError("Password must contain at least one letter");
            setHasError(true);
            let timeout = setTimeout(() => {
                setError("");
                setHasError(false);
                clearTimeout(timeout);
            }, 2000);
            return false;
        }
        if(!num){
            setError("Password must contain at least one number");
            setHasError(true);
            let timeout = setTimeout(() => {
                setError("");
                setHasError(false);
                clearTimeout(timeout);
            }, 2000);
            return false;
        }
        if(!special){
            setError("Password must contain at least one special character");
            setHasError(true);
            let timeout = setTimeout(() => {
                setError("");
                setHasError(false);
                clearTimeout(timeout);
            }, 2000);
            return false;
        }
        return true;
    }

    function resetPassword(){
        if(testPassword() === false){ 
            return;
        } 
        setLoading(true);
        // send request to server  
        let token = params.get("token");
        console.log({token, password})
        document.getElementById("passwordResetModal").showModal();
        
        
    }

    return (
        <>
     <div
         className=" 
          w-full
         "
          >

            <div className=' p-5 mb-12 flex flex-col gap-5 justify-center mx-auto w-full
            xl:w-[30vw] lg:w-[50vw] md:w-[50vw]
            '>
                 <p className=' mt-2 text-2xl w-full '>
                    Reset your password
                 </p>
                <p className='text-sm'>
                    Enter a new Strong password
                </p>
                <div className='flex flex-col gap-2'>
                    
                    <label id="passwordlabel" htmlFor='password' >
                        Password
                    </label>
                    <input 
                    maxLength={100}
                    minLength={8}
                    type='password' 
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    className='input rounded input-bordered' placeholder="Enter Your Password" />
                    <label id="confirmpasswordlabel" htmlFor='confirmpassword' >
                        Confirm Password
                    </label>
                    <input type='password' className='input rounded input-bordered'
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }} 
                    placeholder="Confirm Your Password" />
                    <div className='flex justify-between gap-2'>
                        <p className='text-red-500'>{error}</p>
                        <p className='text-green-500'>{success}</p>
                    </div>
                </div>
                <button className='btn rounded bg-blue-500' onClick={()=>{
                    resetPassword();
                }}>
                    Reset Password
                </button>
                </div>
          </div>
          <dialog id="passwordResetModal" className="modal rounded-md">
          <div className={`modal-box flex  rounded flex-col gap-5 
             ${
              theme  === "dark" ? "bg-black  border-[#121212] border-2 border-b-none " : "bg-white  border   border-[#f6f4f4] bg-opacity-75 bg-white "
            
            }  
              p-5`}>
              <p>Succesfully Reset Password</p>
              <p>
               You have successfully reset your password. You can now login with your new password.
              </p>
              <button
                onClick={() => {
                    document.getElementById("passwordResetModal").close();
                    props.swapPage("login");
                }}
                className="btn bg-blue-500 rounded"
              >
                Login
              </button>
            </div>
          </dialog>
          
    </>
    )
}