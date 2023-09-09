import { useState } from "react";
import { api, oneSignal } from ".";
import Bottomnav from "../components/Bottomnav";
import Modal from "../components/Modal";
import Modal2 from "../components/Modal2";
export default function Settings() {
  let [emailVisibility, setEmailVisibility] = useState(
    api.authStore.model.emailVisibility
  );
  let [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem("notifications") === "true" ? true : false
  );
  let [recommendation_ratings, setrecommendation_ratings] = useState(localStorage.getItem("recommendation_ratings") === "true" ? true : false);

  return (
    <>
      <div className="p-2 w-scree font-normal text-sm mb-24">
        <div className="flex mx-5 flex-row justify-between">
          <span
            className="flex flex-row items-center gap-2 cursor-pointer
           
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={() => {
                window.history.back();
              }}
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          
          </span>
          <span className="font-semibold text-lg">
            Settings
               
          </span>
          <div>
            {""}
            {""}
            {""}
            {""}
          </div>
        </div>
        <div className="flex flex-col p-5">
          <div className="card card-compact w-full bg-base-100  shadow">
            
            <h1
              className="text-md font-bold   p-5 "
              aria-label="General Settings"
            >
               Account Management
            </h1>

            <div className="card-body flex flex-col">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                  <p>Logout of Postr</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Logout of your Postr account.
                  </span>
                </div>
                <a
                    className="text-sm cursor-pointer text-sky-500 absolute right-5"
                    onClick={() => {
                        api.authStore.clear()
                        window.location.href = "/";
                    }}
                >
                    Logout
                </a>
              </div>
              <div className="flex flex-row gap-5 mt-6">
                <div className="flex flex-col">
                  <p>Delete Account</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Remove All activity and account data from Postr.
                  </span>
                </div>
                <a
                    className="text-sm cursor-pointer text-error absolute right-5"
                    onClick={() => {
                        document.getElementById('delete').showModal();
                    }}
                >
                    Delete
                </a>
              </div>
              <div className="flex flex-row    ">
                <div className="flex flex-col">
                  <p>Deactivate Account</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Temporary disable your account.
                  </span>
                </div>
                <a
                    className="text-sm cursor-pointer text-warning absolute right-5"
                    onClick={() => {
                         if(api.authStore.model.deactivated){
                          api.collection('users').update(api.authStore.model.id, {deactivated:false})
                          .then(()=>{
                            api.collection('users').authRefresh()
                            window.location.href = "/"
                          })
                         }else{
                          document.getElementById('deactivate').showModal();
                         }
                    }}
                >
                   {
                    api.authStore.model.deactivated ? 'Reactivate' : 'Deactivate'
                   }
                </a>
              </div>
            </div>
            <h1
              className="text-md font-bold   p-5  "
              aria-label="General Settings"
            >
              What you see
            </h1>
            <div className="card-body flex flex-col">
              <div className="flex flex-row ">
                <div className="flex flex-col">
                  <p>Recommendation Ratings </p>
                  <span className="text-xs text-gray-500 w-60">
                    Get Prompted to share input to better organize your feed
                  </span>
                </div>
                <input
                  type="checkbox"
                  value=""
                  className={`
                  toggle
                  ${recommendation_ratings ? "bg-sky-500" : "bg-slate-200"}
                   border-slate-200
                   absolute
                     right-5    
                  `}
                    {...(recommendation_ratings ? { checked: true } : {})}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // request permission
                      localStorage.setItem("recommendation_ratings", true);
                      setrecommendation_ratings(true);
                      
                    } else {
                      e.target.checked = false;
                      localStorage.setItem("recommendation_ratings", false);
                      setrecommendation_ratings(false);
                    }
                  }}
                />
              </div>
              
            </div>
            <h1
              className="text-md font-bold   p-5 "
              aria-label="General Settings"
            >
              Notifications / Privacy
            </h1>

            <div className="card-body flex flex-col">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                  <p>Push Notifications</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Allow Postr to send you push notifications when you get a
                    new follower, like, comment, or mention.
                  </span>
                </div>
                <input
                  type="checkbox"
                  value=""
                  className={`
                  toggle
                  ${notificationsOn ? "bg-sky-500" : "bg-slate-200"}
                   border-slate-200
                   absolute
                     right-5    
                  `}
                    {...(notificationsOn ? { checked: true } : {})}
                  onChange={(e) => {
                    if (e.target.checked && "Notification" in window) {
                      // request permission
                      localStorage.setItem("notifications", true);
                      setNotificationsOn(true);
                      Notification.requestPermission().then(function (result) {
                        if (result === "granted") {
                          e.target.checked = true;
                        } else {
                          console.log("permission denied");
                          e.target.checked = false;
                        }
                      });
                    } else {
                      e.target.checked = false;
                      localStorage.setItem("notifications", false);
                      setNotificationsOn(false);
                    }
                  }}
                />
              </div>
              <div className="flex flex-row gap-5 mt-6">
                <div className="flex flex-col">
                  <p>Email Visibility</p>
                  
                  <span className={`badge badge-xs badge-outline
                  
                  p-2 mt-2 
                  ${
                    emailVisibility ? "badge-error" : "badge-success"
                  }
                  `}>
                    {emailVisibility ? "Public" : "Private"}
                  </span>

                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Change whether you want your email public or private.
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                <input
                  type="checkbox"
                  value=""
                  className={`toggle 
                  ${emailVisibility ? "bg-sky-500" : "bg-slate-200"}
                   absolute right-5
                   border-slate-200
                  `}
                  {...(emailVisibility ? { checked: true } : {})}
                  onChange={(e) => {
                    if (e.target.checked) {
                      api
                        .collection("users")
                        .update(api.authStore.model.id, {
                          emailVisibility: true,
                        })
                        .then(() => {
                          api.collection("users").authRefresh();
                          setEmailVisibility(true);
                        });
                    } else {
                      api
                        .collection("users")
                        .update(api.authStore.model.id, {
                          emailVisibility: false,
                        })
                        .then(() => {
                          api.collection("users").authRefresh();
                          e.target.checked = false;
                          setEmailVisibility(false);
                        });
                    }
                  }}
                />
               
                </div>
              </div>
            </div>
          </div>

          <div className="card card-compact w-full bg-base-100 mt-8 shadow">
            <h1 className="text-md font-bold  p-5  ">Support</h1>
            <div className="card-body flex flex-col">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                  <p>Report a Bug</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    Report a bug to the Postr team.
                  </span>
                </div>
                <a
                  className="text-sm cursor-pointer text-sky-500 absolute right-5"
                  onClick={() => {
                    window.location.href = "mailto:postr-inc@post.com";
                  }}
                  
                >
                  Report
                </a>
              </div>
            </div>
            <div className="card-body flex flex-col">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                  <p>Privacy Policy</p>
                  <span className="text-xs  text-gray-500 w-60 mt-2">
                    View our privacy policy.
                  </span>

                  <a
                    href="/privacy"
                    
                    className="text-sm text-sky-500 cursor-pointer absolute right-5"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body flex flex-col">
              <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                  <p>Terms Of Use</p>
                  <span className="text-xs text-gray-500 w-60 mt-2">
                    View our terms of use.
                  </span>

                  <a
                    href="/tos"
 
                    className="text-sm text-sky-500 cursor-pointer absolute right-5"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="mx-auto text-sm flex justify-center mb-2">
            v6.0.1 Flying Fox
        </span>
        <span className="mx-auto text-sm flex justify-center">
            &copy; 2023 Postr Inc. All Rights Reserved.
        </span>

      </div>

      <Modal2 id="delete" height="h-[50vh]"
      styles="w-72 "
      >
        

        <div className="flex  text-sm flex-col gap-2">
          <span className="mt-2 ">
            We recommend you deactivate your account instead of deleting it, if you want to take a break from Postr. If you delete your account, you will lose all your data and will not be able to recover it.
          </span>
       
          <div className="gap-2 flex-col flex ">
           
            <button
            style={{fontSize:'12px'}}
            className="text-sm btn bg-transparent focus:bg-transparent w-full text-error 
             
            cursor-pointer" onClick={() => {
              api.collection('users').delete(api.authStore.model.id)
              .then(()=>{
                api.authStore.clear()
                window.location.href = "/"
              })
            }
            }>
                Confirm
            </button>
            <button className="text-sm btn focus:bg-transparent bg-transparent w-full btn-md  cursor-pointer"
           style={{fontSize:'12px'}}
           onClick={() => {
                document.getElementById('delete').close()
            }
            }>
                Cancel
            </button>
          </div>
        </div>
        </Modal2>
        <Modal2 id="deactivate" height="h-[50vh]"
        styles="w-72 "
        >
       

        <div className="flex text-sm flex-col gap-2">
          <span className="mt-2 ">
           You can still use your account, but no one will be able to interact with you or see your content. You can reactivate your account by reactivating it from settings.
          </span>
       
          <div >
           <button className="text-sm text-sky-500 cursor-pointer" onClick={() => {
                document.getElementById('delete').close()
            }
            }>
                Cancel
            </button>
            <button className="text-sm text-sky-500 
            fixed right-5
            cursor-pointer" onClick={() => {
              api.collection('users').update(api.authStore.model.id, {deactivated:true})
              .then(()=>{
                api.collection('users').authRefresh()
                window.location.href = "/"
              })
            }
            }>
                Confirm
            </button>
          </div>
        </div>
        </Modal2>
      <Bottomnav />
    </>
  );
}
