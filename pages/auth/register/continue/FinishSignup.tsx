//@ts-nocheck
"use client";
import { Props } from "@/src/@types/types";
import { api } from "@/src/api/api";
import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
export default function (props: Props) {
  if(typeof window === "undefined") return null;
  let [password, setPassword] = useState("");
  let passwordRef = useRef<any>();

  async function confirm() {
    if (password.length < 8 || password.length > 50) {
      passwordRef.current.innerHTML =
        "Password must be at least 8 characters and less than 50 characters";
      passwordRef.current.style.color = "red";
      let timeout = setTimeout(() => {
        passwordRef.current.innerHTML = "Create a password";
        passwordRef.current.style.color = "black";
        clearTimeout(timeout);
      }, 2000);
      return;
    }
    let data = await api.authStore.create({
      username: props.params.username,
      email: props.params.email,
      password: password,
      followers: [],
      following: [],
      bookmarks: [],
    })   
    document.getElementById("signupModal").showModal();
  }
  return (
    <div 
      className="relative    p-5 w-screen  justify-center flex flex-col gap-3 mx-auto
    xl:w-[30vw] lg:w-[50vw]"
    >
      <div className=" mb-12 flex flex-col gap-5  w-full">
        <div className="flex justify-between gap-2 hero">
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => (props.swapPage("login"))}
          >
            Login
          </p>
        </div>
        <p className=" mt-2 text-2xl w-full ">Create your account</p>
      </div>
      <label htmlFor="username" className="text-sm">
        Name
      </label>
      <div className="relative w-full">
        <input
          name="username"
          value={props.params.username}
          disabled={true}
          type="text"
          className="input input-bordered w-full placeholder:text-blue-500"
        ></input>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-green-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <label htmlFor="email" className="text-sm">
        Email
      </label>
      <div className="relative w-full">
        <input
          name="email"
          disabled={true}
          value={props.params.email}
          type="text"
          className="input input-bordered placeholder:text-blue-500 w-full"
        ></input>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-green-500 absolute end-5 top-1/2 transform -translate-y-1/2 right-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div>
        <label htmlFor="password" ref={passwordRef} className="text-sm">
          Create a password
        </label>
        <div className="relative w-full">
          <input
            name="password"
            placeholder={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="input input-bordered placeholder:text-blue-500 w-full"
          ></input>
        </div>
      </div>
      <p>
        By clicking signup you agree to follow our{" "}
        <a className="text-blue-500" href="/information/terms.pdf" target="_blank">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="text-blue-500" href="/information/privacy.pdf" target="_blank">
          Privacy Policy
        </a>
      </p>

      <button
        onClick={() => {confirm()}}
        className="btn  text-white hover:bg-blue-500 bg-blue-500    relative"
      >
        Signup
      </button>
      <dialog id="signupModal" className="modal rounded-md">
            <div className={`modal-box flex  rounded flex-col gap-5 
             ${
              theme  === "dark" ? "bg-black  border-[#121212] border-2 border-b-none " : "bg-white  border   border-[#f6f4f4] bg-opacity-75 bg-white "
            
            }  
              p-5`}>
              <p className="text-green-500">Succesfully Signed Up</p>
              <p>
                You have successfully signed up. Please check your email for a
                verification link to verify your account.
              </p>
              <button
                onClick={() => {
                  document.getElementById("signupModal").close();
                  props.swapPage("login");
                }}
                className="btn bg-blue-500 rounded"
              >
                Login
              </button>
            </div>
          </dialog>
    </div>
  );
}
