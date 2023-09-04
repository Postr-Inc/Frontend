
import { Image } from 'astro:assets';
import { useState } from 'react';
import { api } from '.';
 
 
export default function Login(){
 let [btnstate, setBtnstate] = useState("aborted");
 let [isLogin, setIsLogin] = useState(false);
 function login(e) {
    console.log("logging in...");
    let w = window.open()
    const data = api
      .collection("users")
      .authWithOAuth2({
        provider: "google",
        createData: {
          bio: "I am new to Postr!",
          followers: [],
        },
        urlCallback: (url) => {
          if (window.matchMedia("(display-mode: standalone)")) {
             w.location.href = url
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
      window.location.href = "/";
    });
    setTimeout(() => {
      if (!isLogin) {
        setBtnstate("aborted");
      }
    }, 6000);
  }
 return (
    <div
      className="hero min-h-screen p-5"
      style={{ backgroundImage: `url('/images/loginback.png')` }}
    >
      <div
        className="hero-content     flex flex-col text-white"
        style={{ marginTop: "10vh" }}
      >
        <button
          className="btn btn-md z-[9999]  6 max-w-md border-slate-200"
          style={{
            maxWidth: "80vw",
            width: "65vw",
            position: "absolute",
            top: "65vh",
          }}
            onClick={login}
        
          {...(btnstate === "Logging in..."
            ? {
                style: {
                  opacity: 0.5,
                  maxWidth: "80vw",
                  width: "65vw",
                  position: "absolute",
                  top: "65vh",
                },
              }
            : {})}
        >
          <img src='/icons/googleicon.png'className="w-6 h-6" />
          {btnstate !== "Logging in..." || btnstate === "aborted" ? (
            <span className="ml-2">Login with Google</span>
          ) : (
            <span className="ml-2">Logging in...</span>
          )}
        </button>
      </div>
    </div>
 )
}
