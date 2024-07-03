//@ts-nocheck
"use client"; 
import { useState } from "react";
import { api } from "@/src/api/api";
import { Props } from "@/src/@types/types";
export default function PasswordRest(
    props: Props
){
    function request(){
        let email = (document.querySelector('input[type="email"]') as HTMLInputElement).value;
        if(email.length === 0){
             
             document.getElementById("emaillabel").innerHTML = "Email cannot be empty";
             document.getElementById("emaillabel").style.color = "red";
             setTimeout(() => {
                document.getElementById("emaillabel").innerHTML = "Email";
                document.getElementById("emaillabel").style.color = "black";
             }, 2000);
            return;
        }

        let testEmail = /\S+@\S+\.\S+/;
        if(!testEmail.test(email)){
            document.getElementById("emaillabel").innerHTML = "Please input a valid email";
            document.getElementById("emaillabel").style.color = "red";
            setTimeout(() => {
                document.getElementById("emaillabel").innerHTML = "Email";
                document.getElementById("emaillabel").style.color = "black";
            }, 2000);
            return;
        } 
      api.authStore.resetPassword(token, password).then((data) => { 
      setLoading(false);
      setSuccess("Password reset successfully");
      let timeout = setTimeout(() => {
          setSuccess("");
          clearTimeout(timeout);
      }, 2000); 
        document.getElementById("passwordResetModal").showModal();
      }).catch((error) => { 
          console.log(error);
          setError(error.message);
          setHasError(true);
      })
    }
  return (
    
    <>
     <div
         className="  w-full"
          >

            <div className=' p-5 mb-12 flex flex-col gap-5  w-full
            xl:w-[30vw] lg:w-[50vw] md:w-[50vw]
            justify-center mx-auto
            '>
                 <p className=' mt-2 text-2xl w-full '>
                    Reset your password
                 </p>
                <p className='text-sm'>
                    Enter your email address and we will send you a link to reset your password
                </p>
                <div className='flex flex-col gap-2'>
                    <label id="emaillabel" htmlFor='email' >
                        Email
                    </label>
                    <input type='email' className='input rounded input-bordered' placeholder="Enter Your Email" />
                </div>
                <button className='btn bg-blue-500 rounded ' onClick={()=>{
                     request()
                }}>
                   Request Password Reset
                </button>
                <span onClick={() => props.swapPage('login')} className='text-blue-500 rounded cursor-pointer'>Back to login</span>
                </div>
          </div>
          <dialog id="passwordResetModal" className="modal rounded-md">
            <div className={`modal-box flex  rounded flex-col gap-5 
             ${
              theme  === "dark" ? "bg-black  border-[#121212] border-2 border-b-none " : "bg-white  border   border-[#f6f4f4] bg-opacity-75 bg-white "
            
            }  
              p-5`}>
              <p>Reset Password</p>
              <p>
                A link to reset your password has been sent to your email. Please
                check your email and follow the instructions to reset your password.
              </p>
              <button
                onClick={() => {
                  document.getElementById("passwordResetModal").close();
                }}
                className="btn bg-blue-500 rounded"
              >
                OK
              </button>
            </div>
          </dialog>
    </>
  )
}