
import { Image } from 'astro:assets';
import { useState, useEffect, useRef } from 'react';
import { api } from '.';
 
 
export default function Login(){
  let button = useRef();
 let [btnstate, setBtnstate] = useState("aborted");
 let [isLogin, setIsLogin] = useState(false);
 function login(e) {
    setBtnstate("loading");
    let w = window.open()
    const data = api
      .collection("users")
      .authWithOAuth2({
        provider: "google",
        createData: {
          bio: "I am new to Postr!",
          followers: [],
        },
        redirectUrl:`${window.location.origin}/`,
        urlCallback: (url) => {
          console.log(url);
          if (window.matchMedia("(display-mode: standalone)")) {
             w.location.href = url
             window.location.href = "/"
          } else {
           
            window.open(url);
          }
        },
      })
      .then((res) => {
        if (!res) {
            setBtnstate("aborted");
          return;
        }
        window.location.href = "/"
      });
     
    data.then((res) => {
      if (res && res.meta.isNew) {
        let form = new FormData();
        let url = res.meta.avatarUrl;
        let username = res.meta.username;
        form.append("username", username);

        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            form.append("avatar", blob);
            api.collection("users").update(data.record.id, form);
          });
      }
      window.location.href = "/"
    }) 
    setTimeout(() => {
      if (!isLogin) {
        setBtnstate("aborted");
      }
    }, 6000);
  }
  
 return (
     <div>
 

  
    <div className="hero  w-screen h-screen justify-center flex flex-col gap-5 mx-auto">
        <img src="/icons/logo.png" alt="logo" className="w-12 h-12 fixed top-12"/>
        <div className=" mb-8 ">
            <h1 className={` text-2xl 
            ${
                document.documentElement.getAttribute('data-theme') === 'black'
                ? 'text-white'
                : 'text-black'
            }
            font-bold  mx-auto w-5/6 justify-center`}>
                Empowering Open Sourced Social Media Platforms.
            </h1>
        </div>
        <button  
        onClick={login}
        ref={button} className={`btn btn-ghost w-5/6 ${
        document.documentElement.getAttribute('data-theme') === 'black' 
        ? 'bg-white hover:bg-white text-black'
        : 'bg-black hover:bg-black text-white'
    } capitalize   rounded-full font-bold `}>
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-6 h-6" alt="google logo"/>
            Continue with Google
            {
              btnstate === "loading" ? <span className="loading loading-spinner loading-sm"></span> : ''
            }
            
        </button>
        <button 
         
        className={`btn btn-ghost text-md  w-5/6 ${
        document.documentElement.getAttribute('data-theme') === 'black'
            ? 'bg-white hover:bg-white text-black'
            : 'bg-black hover:bg-black text-white'
    } capitalize   rounded-full font-bold`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${ 
              document.documentElement.getAttribute('data-theme') === 'black'
    ? 'fill-black'
    : 'fill-white'
} `} viewBox="0 0 50 50" width="50px" height="50px">
                <path
                    d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z" />
            </svg>
            Continue with Apple
        </button>
        <div className="divider  before:rounded after:rounded text-sm mt-2 h-0  w-5/6 justify-center  mx-auto flex">Or</div>

        <button className={`btn btn-ghost w-5/6 ${
       document.documentElement.getAttribute('data-theme') === 'black'
           ? 'bg-white text-black hover:bg-white focus:border '
           : 'bg-black hover:bg-black text-white  focus:border-4 focus:border-blue-500'
   } capitalize   rounded-full font-bold`}>
            Create an account
        </button>
        <p className="text-start text-sm   mx-auto w-5/6 ">
            By continuing, you agree to our <a className="link" href='/tos'>Terms of Service</a> and  <a href='/privacy' className="link">Privacy Policy</a>
        </p>
    </div>
    
 
     </div>
 )
}
