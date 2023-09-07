import React, { useState, useRef, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import Modal from "./Modal";
import { api } from "../react_pages";
 

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
  let pRef = useRef();

  let [isTyping, setIsTyping] = useState(false);

  window.addEventListener("keydown", (e) => {
    setIsTyping(true);
  });
  window.addEventListener("keyup", (e) => {
    setIsTyping(false);
  });

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
  
  

  useEffect(() => {
    if (pContent == "") {
      setChar(0);
    }
  }, [pContent]);

  function createPost() {
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
        window.location.href = "/p/" + res.id
        
      });
    document.getElementById("newpost").close();
  }
  return (
    <div className=" fixed  bottom-[5vh] left-[15vw] flex justify-center mx-auto w-[70vw]">
      <div className=" border border-slate-200 mr-2   bg-white rounded-2xl w-full h-12 p-2">
        <div className="flex flex-row  gap-2  mb-3   justify-between ">
          <div
            onClick={() => {
              if(window.location.pathname !== "/"){
                window.location.href = "/"
              }
            }}
          >
            {window.location.origin + window.location.pathname ===
            window.location.origin + "/" ? (
              <svg
              className="w-7 h-7  cursor-pointer"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="home"><path fill="#200E32" d="M6.63477851,18.7733424 L6.63477851,15.7156161 C6.63477851,14.9350667 7.27217143,14.3023065 8.05843544,14.3023065 L10.9326107,14.3023065 C11.310188,14.3023065 11.6723007,14.4512083 11.9392882,14.7162553 C12.2062757,14.9813022 12.3562677,15.3407831 12.3562677,15.7156161 L12.3562677,18.7733424 C12.3538816,19.0978491 12.4820659,19.4098788 12.7123708,19.6401787 C12.9426757,19.8704786 13.2560494,20 13.5829406,20 L15.5438266,20 C16.4596364,20.0023499 17.3387522,19.6428442 17.9871692,19.0008077 C18.6355861,18.3587712 19,17.4869804 19,16.5778238 L19,7.86685918 C19,7.13246047 18.6720694,6.43584231 18.1046183,5.96466895 L11.4340245,0.675869015 C10.2736604,-0.251438297 8.61111277,-0.221497907 7.48539114,0.74697893 L0.967012253,5.96466895 C0.37274068,6.42195254 0.0175522924,7.12063643 0,7.86685918 L0,16.568935 C0,18.4638535 1.54738155,20 3.45617342,20 L5.37229029,20 C6.05122667,20 6.60299723,19.4562152 6.60791706,18.7822311 L6.63477851,18.7733424 Z" transform="translate(2.5 2)"></path></svg>
            ) : (
              <svg
              className="w-7 h-7 text-slate-200  cursor-pointer"
              xmlns="http://www.w3.org/2000/svg" width="24"
              
            height="24" viewBox="0 0 24 24" id="home"><path fill="none" stroke="#bcbcbc" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.65721519,18.7714023 L6.65721519,15.70467 C6.65719744,14.9246392 7.29311743,14.2908272 8.08101266,14.2855921 L10.9670886,14.2855921 C11.7587434,14.2855921 12.4005063,14.9209349 12.4005063,15.70467 L12.4005063,15.70467 L12.4005063,18.7809263 C12.4003226,19.4432001 12.9342557,19.984478 13.603038,20 L15.5270886,20 C17.4451246,20 19,18.4606794 19,16.5618312 L19,16.5618312 L19,7.8378351 C18.9897577,7.09082692 18.6354747,6.38934919 18.0379747,5.93303245 L11.4577215,0.685301154 C10.3049347,-0.228433718 8.66620456,-0.228433718 7.51341772,0.685301154 L0.962025316,5.94255646 C0.362258604,6.39702249 0.00738668938,7.09966612 0,7.84735911 L0,16.5618312 C0,18.4606794 1.55487539,20 3.47291139,20 L5.39696203,20 C6.08235439,20 6.63797468,19.4499381 6.63797468,18.7714023 L6.63797468,18.7714023" transform="translate(2.5 2)"></path></svg>
            )}
          </div>
          {
            window.location.origin + window.location.pathname === 
            window.location.origin + '/q' ? 
            <svg
            className="w-7 h-7 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            onClick={() => {
              if(window.location.pathname !== "/q"){
                window.location.href = "/q"
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          : 
          <svg
          className="w-7 h-7 text-slate-300 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          onClick={() => {
            if(window.location.pathname !== "/q"){
              window.location.href = "/q"
            }
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
          }
          
          {modalisOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 cursor-pointer"
              onClick={() => {
                document.getElementById("newpost").showModal();
                setModalisOpen(true);
              }}
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          ) : (
            <svg
              onClick={() => {
                document.getElementById("newpost").showModal();
                pRef.current.focus();
                setModalisOpen(true);
              }}
              className="w-7 h-7 text-slate-300 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}
          {window.location.origin + window.location.pathname === window.location.origin + "/notifications" ? (
           
           
           <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 cursor-pointer"
              onClick={() => {
                if(!window.location.href === "/notifications"){
                  return
                }
                window.location.href = "/notifications"
              }}
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                if(window.location.pathname !== "/notifications"){
                  window.location.href = "/notifications"
                }
              }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7 text-slate-300 cursor-pointer"
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
              if(window.location.pathname !== "/u/" + api.authStore.model.username){
                window.location.href = "/u/" +  api.authStore.model.username
              }
            }}
          >
            {window.location.origin + window.location.pathname ===
            window.location.origin + "/u/" + api.authStore.model.username ? (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                className="rounded-full w-7 h-7 mx-2"
                alt={api.authStore.model.username + "'s avatar"}
              />
            ) : (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                className="rounded-full w-7 h-7
                opacity-50
                "
                alt={api.authStore.model.username + "'s avatar"}
              />
            )}
          </div>
        </div>
      </div>

      <dialog id="newpost" className="modal text-start bg-base-100 focus:outline-none"
      style={{backgroundColor: "white", fontFamily: "Inter", fontSize: "16px"}}
      >
      <div className=" max-w-screen max-w-screen h-screen w-screen overflow-auto shadow-none fixed top-0 left-0 p-5">
       <div className="flex flex-row justify-between">
        <img src="/icons/backarrow.svg" alt="back arrow" className="w-7 h-7 cursor-pointer" onClick={() => {
          document.getElementById("newpost").close();
          setModalisOpen(false);
          pRef.current.innerHTML = "";
          setChar(0);
          setImage("");
          setFile("");
          document.activeElement.blur();
        }} />
        <button className=" " onClick={createPost}>Proceed</button>
        </div>

        <div className="flex flex-row relative    gap-5 mt-8"
        
        >
          <img src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
           className="rounded-full w-12 h-12" alt={api.authStore.model.username + "'s avatar"} />
          
           <h1  className="text-sm font-sans   ">@{api.authStore.model.username}</h1>



     

          
        
        </div>
        <div className="flex flex-col">
        <p contentEditable="true" suppressContentEditableWarning={true} className="w-full  h-[12vh]  mt-5 outline-none resize-none"
           
           ref={pRef}
           placeholder="What's on your mind?"
           onInput={debounce(handleContentInput, 100)}
           onPaste={handleContentInput}
           autofocus
           onBlur={(e) => {
              e.target.focus()
           }}
          
        ></p>
 
       
        <div className="flex flex-row justifyy">
       <input type="file" id="file" className="hidden" onChange={(e) => {
         setImage(URL.createObjectURL(e.target.files[0]))
         setFile(e.target.files[0])
         e.target.value = ""
        }
        } />
        <label htmlFor="file" className="  text-white mt-12 rounded-lg cursor-pointer">
        <svg
        className="w-8 h-8 text-slate-300 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="image"><path fill="#d8d8ff" d="M13.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path><path fill="#b2b1ff" d="M19 2H5a3.009 3.009 0 0 0-3 3v8.86l3.88-3.88a3.075 3.075 0 0 1 4.24 0l2.871 2.887.888-.888a3.008 3.008 0 0 1 4.242 0L22 15.86V5a3.009 3.009 0 0 0-3-3zm-5.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path><path fill="#6563ff" d="M10.12 9.98a3.075 3.075 0 0 0-4.24 0L2 13.86V19a3.009 3.009 0 0 0 3 3h14c.815 0 1.595-.333 2.16-.92L10.12 9.98z"></path><path fill="#d8d8ff" d="m22 15.858-3.879-3.879a3.008 3.008 0 0 0-4.242 0l-.888.888 8.165 8.209c.542-.555.845-1.3.844-2.076v-3.142z"></path></svg>


          </label>
        </div>
      </div>
      
      <p className={`text-sm font-sans mt-8 ${chars >= maxchar ? "text-red-500" : "text-slate-300"}` }
      
      >{chars}/{maxchar}</p>
        {
          image ?
           <div className="flex flex-row relative justify-center">
             <img src={image} alt="post image" className="w-full  rounded mt-2" />
             <span className="absolute  text-sm font-sans top-5 
             hover:bg-[#05050555] border-none right-2 bg-[#05050555] text-white btn btn-circle btn-sm   cursor-pointer" onClick={() => {
                setImage("")
                setFile("")
              }}>X</span>
            </div>
           : null
        }
      </div>
      
         
      </dialog>
      
    </div>
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
}
