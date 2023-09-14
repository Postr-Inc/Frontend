import React, { useState, useRef, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import Modal from "./Modal";
import { api } from "../react_pages";
import Modal2 from "./Modal2";
function handleEmojis(html) {
  let parser = new DOMParser();
  let defaults = {
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":heart:": "❤️",
    ":broken_heart:": "💔",
    ":star:": "⭐",
    ":star2:": "🌟",
    ":exclamation:": "❗",
    ":question:": "❓",
    ":warning:": "⚠️",
    ":poop:": "💩",
    ":clap:": "👏",
    ":muscle:": "💪",
    ":pray:": "🙏",
    ":smile:": "😄",
    ":smiley:": "😃",
    ":grin:": "😀",
    ":laughing:": "😆",
    ":sweat_smile:": "😅",
    ":joy:": "😂",
    ":rofl:": "🤣",
    ":relaxed:": "☺️",
    ":ok_hand:": "👌",
    ":100:": "💯",
  };

  let emojis = defaults;

  let doc = parser.parseFromString(html, "text/html");
  let c = doc.body;
  let h = c.innerHTML;
  for (const emoji in emojis) {
    if (!emoji.startsWith(":") || !emoji.endsWith(":")) {
      throw new Error("Emoji must be in the format :emoji:");
    }
    if (Object.hasOwnProperty.call(emojis, emoji)) {
      let value = emojis[emoji];
      // set to an img element if a path
      if (
        value.startsWith("http") ||
        value.startsWith("www") ||
        value.startsWith("./")
      ) {
        value = `<img src="${value}" width="32px" height="32px" />`;
      }
      h = h.replaceAll(emoji, value);
    }
  }
  c.innerHTML = h;
  return doc.documentElement.innerHTML;
}

export default function Bottomnav() {
  let maxchar = 280;
  let [chars, setChar] = useState(0);
  let [image, setImage] = useState("");
  let [file, setFile] = useState("");
  let [pContent, setPContent] = useState("");
  let [modalisOpen, setModalisOpen] = useState(false);
  let [mentionedUsers, setMentionedUsers] = useState([]);
  let [hasMention, setHasMention] = useState(false);
  let [error, setError] = useState(false);
  let [theme, setTheme] = useState(localStorage.getItem("theme"));
 
   
  let [isScrolling, setIsScrolling] = useState(false)
  let pRef = useRef();

  let [isTyping, setIsTyping] = useState(false);

  window.addEventListener("keydown", (e) => {
    setIsTyping(true);
  });
  window.addEventListener("keyup", (e) => {
    setIsTyping(false);
  });
  window.addEventListener("scroll", (e) => {
    if(window.scrollY > 0){
      setIsScrolling(true)
    }
    // check if mot scrolling
    if(window.scrollY === 0){
      setIsScrolling(false)
    }
  });

  let themewatcher = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
        setTheme(localStorage.getItem("theme"));
        if(themewatcher){
          themewatcher.disconnect()
        }
      }
    })
  }).observe(document.querySelector('html'), {
    attributes: true
  })
  function saveCaretPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.cloneRange();
    }
    return null;
  }

  function restoreCaretPositionToEnd(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handleContentInput(e) {
    let text = pRef.current.innerText; // Use innerText instead of innerHTML to get plain text

    let charCount = text.length;
    setChar(charCount);

    if (charCount >= maxchar) {
      setChar(maxchar);
      text = text.substring(0, maxchar);
      pRef.current.innerText = text;
    }

    // Process emojis and replace &lt; and &gt;
    text = handleEmojis(text);
    text = text.replaceAll(/&lt;/g, "<").replaceAll(/&gt;/g, ">");

    text = sanitizeHtml(text, {
      allowedTags: sanitizeHtml.defaults.allowedTag,
      allowedAttributes: {
        a: ["href"],
        span: ["class"],
      },
    });

    if (text.includes("@")) {
      // do not process already mentioned users
      let mentions = text.match(/@(\w+)/g);

      setHasMention(true);
      if (mentions) {
        const usernames = mentions.map((mention) => mention.replace("@", ""));
        api
          .collection("users")
          .getFullList("*", {
            filter: `username ~ "${usernames.join("|")}"`,
          })
          .then((res) => {
            if (res) {
              setMentionedUsers(res);
            } else {
              setMentionedUsers([]);
            }
          })
          .catch((err) => {
            console.log("Error fetching mentioned users", err);
          });
      }
    } else {
      setHasMention(false);
      setMentionedUsers([]);
    }
    pRef.current.innerHTML = text;
    restoreCaretPositionToEnd(pRef.current);

    setPContent(text);
  }
  var scrollTimer = -1;

  function bodyScroll() {
 

    if (scrollTimer != -1)
      clearTimeout(scrollTimer);

    scrollTimer =   setTimeout(scrollFinished, 1000);
    setIsScrolling(true)
  }
  window.addEventListener("scroll", bodyScroll, false);
  function scrollFinished() {
    console.log("scrolling finished")
    setIsScrolling(false)
  }
  useEffect(() => {
    if (pContent == "") {
      setChar(0);
    }
  }, [pContent]);

  function createPost() {
    document.getElementById("newpost").close();
    setModalisOpen(false);
    let form = new FormData();
    if (image) {
      form.append("file", file);
    }
    form.append("content", pRef.current.innerHTML);
    form.append("author", api.authStore.model.id);
    form.append("type", "text");
    form.append("likes", JSON.stringify([]));
    form.append("shares", JSON.stringify([]));
    form.append("repostedBy", JSON.stringify([]));

    api
      .collection("posts")
      .create(form)
      .then((res) => {
        pRef.current.innerHTML = "";
        setChar(0);
        setImage("");
        setFile("");
        setModalisOpen(false);
        document.getElementById("success").classList.remove("hidden");
        document.getElementById("success").classList.add("flex");
        setError(false);
        document.getElementById("success").onclick = () => {
          window.location.href = "/p/" + res.id;

          document.getElementById("success").classList.add("hidden");
          document.getElementById("success").classList.remove("flex");
        };
        setTimeout(() => {
          document.getElementById("success").classList.add("hidden");
          document.getElementById("success").classList.remove("flex");
        } , 3000)
        document.activeElement.blur();
      })
      .catch((e) => {
        document.getElementById("success").classList.remove("hidden");
        document.getElementById("success").classList.add("text-error");
        setError(true);

        document.getElementById("success").onclick = () => {
          console.clear();
          document.getElementById("success").classList.add("hidden");
          document.getElementById("success").classList.remove("text-error");
        };
        document.getElementById("newpost").close();
        document.activeElement.blur();
        setTimeout(() => {
          document.getElementById("success").classList.add("hidden");
          document.getElementById("success").classList.remove("flex");
        } , 3000)
      });
  }

  return (
    <> 
     <div
          
          id="success"
          className={`
          hidden
         fixed left-1/2
         top-12
               transform -translate-x-1/2 -translate-y-1/2
           rounded-lg cursor-pointer   
            flex-row gap-2
             p-2
          ${
            error ? `text-error  font-thin rounded 
            ${
              theme === "black" ? "text-white bg-[#ff41334b]" : "text-black  border border-base-200"
            }
            `: `text-sky-500  border-base-200 shadow rounded  ${theme === "black" ? "bg-base-300" : "bg-white"}   `   
          }
          `}
        >
          <p
          className="flex flex-row   gap-2"
          >
             {
               !error ? <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor"
               className="w-6 text-sky-500 h-6"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
               />
             </svg>
             : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6
             text-error
             ">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
           </svg>
           
             }
          </p>
           {
            error ?  'Error creating post' : 'Your post was sent!'
           }
        </div>
    <div className="  fixed bottom-8 left-[50%] transform -translate-x-1/2
    w-64">
      <div className="  fixed top-0 left-0"
     
      >
        
      </div>

      <div className={`
      
      ${
        isScrolling ? " bg-opacity-50" : "bg-opacity-100"
      }
      ${theme === 'black' ?   "border border-base-300 bg-black" : "bg-white border border-base-200 bg-opacity-100"}  mr-2    rounded-2xl w-full h-12 p-2`}
      >
        <div className="flex flex-row     mb-3   justify-between ">
          <div
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/";
              }
            }}
          >
            {window.location.origin + window.location.pathname ===
            window.location.origin + "/" ? (
              <svg
                className={`
                w-7 h-7
                cursor-pointer
                 ${ 
                  theme === "black" ? "fill-white" : ""
                 }
                `}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="home"
                
              >
                <path
               
                  d="M6.63477851,18.7733424 L6.63477851,15.7156161 C6.63477851,14.9350667 7.27217143,14.3023065 8.05843544,14.3023065 L10.9326107,14.3023065 C11.310188,14.3023065 11.6723007,14.4512083 11.9392882,14.7162553 C12.2062757,14.9813022 12.3562677,15.3407831 12.3562677,15.7156161 L12.3562677,18.7733424 C12.3538816,19.0978491 12.4820659,19.4098788 12.7123708,19.6401787 C12.9426757,19.8704786 13.2560494,20 13.5829406,20 L15.5438266,20 C16.4596364,20.0023499 17.3387522,19.6428442 17.9871692,19.0008077 C18.6355861,18.3587712 19,17.4869804 19,16.5778238 L19,7.86685918 C19,7.13246047 18.6720694,6.43584231 18.1046183,5.96466895 L11.4340245,0.675869015 C10.2736604,-0.251438297 8.61111277,-0.221497907 7.48539114,0.74697893 L0.967012253,5.96466895 C0.37274068,6.42195254 0.0175522924,7.12063643 0,7.86685918 L0,16.568935 C0,18.4638535 1.54738155,20 3.45617342,20 L5.37229029,20 C6.05122667,20 6.60299723,19.4562152 6.60791706,18.7822311 L6.63477851,18.7733424 Z"
                  transform="translate(2.5 2)"
                ></path>
              </svg>
            ) : (
              <svg
                  className={`
                w-7 h-7
                 ${theme === "black" ? "fill-[#434242]" : "fill-slate-200"}
                 hover:fill-sky-500
                 cursor-pointer
                `}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="home"
              >
                <path
                 
                  
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6.65721519,18.7714023 L6.65721519,15.70467 C6.65719744,14.9246392 7.29311743,14.2908272 8.08101266,14.2855921 L10.9670886,14.2855921 C11.7587434,14.2855921 12.4005063,14.9209349 12.4005063,15.70467 L12.4005063,15.70467 L12.4005063,18.7809263 C12.4003226,19.4432001 12.9342557,19.984478 13.603038,20 L15.5270886,20 C17.4451246,20 19,18.4606794 19,16.5618312 L19,16.5618312 L19,7.8378351 C18.9897577,7.09082692 18.6354747,6.38934919 18.0379747,5.93303245 L11.4577215,0.685301154 C10.3049347,-0.228433718 8.66620456,-0.228433718 7.51341772,0.685301154 L0.962025316,5.94255646 C0.362258604,6.39702249 0.00738668938,7.09966612 0,7.84735911 L0,16.5618312 C0,18.4606794 1.55487539,20 3.47291139,20 L5.39696203,20 C6.08235439,20 6.63797468,19.4499381 6.63797468,18.7714023 L6.63797468,18.7714023"
                  transform="translate(2.5 2)"
                ></path>
              </svg>
            )}
          </div>
          {window.location.origin + window.location.pathname ===
          window.location.origin + "/q" ? (
            <svg
              className={`w-7 h-7 ${
                theme === "black" ? " text-white" : ""
              } cursor-pointer`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              onClick={() => {
                if (window.location.pathname !== "/q") {
                  window.location.href = "/q";
                }
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          ) : (
            <svg
              className={`
              w-7 h-7
              cursor-pointer
              ${theme === "black" ? "text-[#434242]" : "text-slate-200"}
              hover:text-sky-500
              `}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              onClick={() => {
                if (window.location.pathname !== "/q") {
                  window.location.href = "/q";
                }
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          )}

          {modalisOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7
        cursor-pointer
      
           "
              onClick={() => {
                document.getElementById("newpost").close();
                setModalisOpen(false);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`
              w-7 h-7
              cursor-pointer
              ${theme === "black" ? "text-[#434242]" : "text-slate-200"}
              hover:text-sky-500
              `}
              onClick={() => {
                document.getElementById("newpost").showModal();
                setModalisOpen(true);
                pRef.current.focus();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
          {window.location.origin + window.location.pathname ===
          window.location.origin + "/notifications" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`
              w-7 h-7
              cursor-pointer
              ${theme === "black" ? "fill-white" : "fill-black"}
              `}
              onClick={() => {
                if (!window.location.href === "/notifications") {
                  return;
                }
                window.location.href = "/notifications";
              }}
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                if (window.location.pathname !== "/notifications") {
                  window.location.href = "/notifications";
                }
              }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`
              w-7 h-7
              cursor-pointer
              ${theme === "black" ? "text-[#434242]" : "text-slate-200"}
              hover:text-sky-500
              `}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
          <div
            className="cursor-pointer"
            onClick={() => {
              if (
                window.location.pathname !==
                "/u/" + api.authStore.model.username
              ) {
                window.location.href = "/u/" + api.authStore.model.username;
              }
            }}
          >
            {window.location.origin + window.location.pathname ===
            window.location.origin + "/u/" + api.authStore.model.username ? (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                className="rounded-full w-7 h-7  "
                alt={api.authStore.model.username + "'s avatar"}
              />
            ) : (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                className="rounded-full w-7 h-7
                opacity-50
                hover:opacity-100
                "
                alt={api.authStore.model.username + "'s avatar"}
              />
            )}
          </div>
        </div>
      </div>

      <dialog
        id="newpost"
        className="modal text-start   focus:outline-none"
        style={{
          backgroundColor: "white",

          fontSize: "16px",
        }}
      >
        <div className=" max-w-screen max-w-screen h-screen bg-base-100  w-screen  overflow-hidden  shadow-none fixed top-0 left-0 p-5">
          <div className="flex flex-row justify-between">
            <div className="flex cursor-pointer">
            <svg 
            className="w-5 h-5 mt-1  
            hover:rounded-full hover:bg-[#05050555] hover:text-white
            "
             onClick={() => {
              document.getElementById("newpost").close();
              setModalisOpen(false);
              pRef.current.innerHTML = "";
              setChar(0);
              setImage("");
              setFile("");
              document.activeElement.blur();
            }}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd"></path></svg>
               
              <span className="mx-5  font-bold" style={{ fontSize:"1rem" }}>
                Create Postr
              </span>
            </div>
            <button
              className=" btn btn-sm rounded-full text-"
              style={{ fontSize: ".8rem" }}
              onClick={createPost}
            >
              Post
            </button>
          </div>

          <div className="flex flex-row relative    gap-5 mt-8">
            <img
              src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
              className="rounded-full w-8 h-8"
              alt={api.authStore.model.username + "'s avatar"}
            />

            <h1 className="text-sm font-sans font-bold  ">
              @{api.authStore.model.username}
            </h1>
          </div>
          <div className="flex flex-col">
            <p
              contentEditable="true"
              suppressContentEditableWarning={true}
              className="w-full  h-[12vh]  text-sm mt-5 outline-none resize-none"
              id="post"
              ref={pRef}
              placeholder="What's on your mind?"
              onInput={debounce(handleContentInput, 100)}
              onPaste={handleContentInput}
              autoFocus
            ></p>

            {image ? (
              <div className="relative max-w-32">
                <span
                  className="
             hover:bg-[#05050555]  text-sm bg-[#05050555] text-white btn btn-circle btn-sm   cursor-pointer"
                  style={{
                    fontSize: ".7rem",
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                  }}
                  onClick={() => {
                    setImage("");
                    setFile("");
                  }}
                >
                  X
                </span>

                <img
                  src={image}
                  alt="post image"
                  className="w-32  rounded mt-2"
                />
              </div>
            ) : null}

            <div className="flex flex-row  mt-8  ">
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={(e) => {
                  setImage(URL.createObjectURL(e.target.files[0]));
                  setFile(e.target.files[0]);
                  e.target.value = "";
                }}
              />
              <label
                htmlFor="file"
                className="  text-white  rounded-lg cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-6 h-6 ${
                    theme === "black" ? "fill-slate-200" : "fill-base-300"
                  }`}
                  enableBackground="new 0 0 24 24"
                  viewBox="0 0 24 24"
                  
                >
                  <path d="M19,2H5C3.3438721,2.0018311,2.0018311,3.3438721,2,5v9.0683594V19c0.0018311,1.6561279,1.3438721,2.9981689,3,3h14c0.182312-0.0002441,0.3621216-0.0219727,0.5395508-0.0549316c0.0661011-0.012085,0.1291504-0.0303345,0.1936646-0.0466919c0.1060181-0.0270996,0.210083-0.0586548,0.3125-0.097229c0.0744629-0.0278931,0.1471558-0.0571289,0.218689-0.0906372c0.0839844-0.0395508,0.1642456-0.0853882,0.2444458-0.1327515c0.0751953-0.0441895,0.1511841-0.0856323,0.2219849-0.1359863c0.0057983-0.0041504,0.0123901-0.006897,0.0181885-0.0111084c0.0074463-0.0053711,0.013855-0.0120239,0.0209961-0.0178223c0.0136719-0.0110474,0.0308228-0.0164795,0.043335-0.0289917c0.0066528-0.0066528,0.008728-0.015564,0.0148926-0.0224609C21.5355225,20.8126221,21.9989624,19.9642944,22,19v-2.9296875V5C21.9981689,3.3438721,20.6561279,2.0018311,19,2z M19.5749512,20.9053955C19.3883667,20.9631958,19.1954956,20.9998779,19,21H5c-1.1040039-0.0014038-1.9985962-0.8959961-2-2v-4.7246094l3.7626953-3.7626953c0.684021-0.6816406,1.7905884-0.6816406,2.4746094,0l3.4048462,3.404541c0.0018921,0.0019531,0.0023804,0.0045776,0.0043335,0.0065308l6.9689941,6.9689941C19.6020508,20.8971558,19.588501,20.9012451,19.5749512,20.9053955z M21,19c-0.0006714,0.5162964-0.2020264,0.9821777-0.5234375,1.3369751l-6.7684326-6.7678223l1.055542-1.055481c0.6912231-0.6621094,1.7814331-0.6621094,2.4726562,0L21,16.2773438V19z M21,14.8632812l-3.0566406-3.0566406c-1.0737305-1.0722656-2.8129883-1.0722656-3.8867188,0l-1.055542,1.055542L9.9443359,9.8056641c-1.0744629-1.0722656-2.814209-1.0722656-3.8886719,0L3,12.8613281V5c0.0014038-1.1040039,0.8959961-1.9985962,2-2h14c1.1040039,0.0014038,1.9985962,0.8959961,2,2V14.8632812z M13.5,6C12.6715698,6,12,6.6715698,12,7.5S12.6715698,9,13.5,9c0.828064-0.0009155,1.4990845-0.671936,1.5-1.5C15,6.6715698,14.3284302,6,13.5,6z M13.5,8C13.223877,8,13,7.776123,13,7.5S13.223877,7,13.5,7c0.2759399,0.0005493,0.4994507,0.2240601,0.5,0.5C14,7.776123,13.776123,8,13.5,8z"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </dialog>
    </div>
    </>
  );
}

const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
