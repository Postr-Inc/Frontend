// @ts-nocheck
"use client"; 
import { Props } from "../../src/@types/types";
import { api } from "../../src/api/api";
import { SideBarLeft, SideBarRight } from "../../src/components/Sidebars";
import { Loading } from "../../src/components/icons/loading";
import Post from "../../src/components/post";
import { Comme } from "next/font/google";
import { useEffect, useState } from "react";
import Comment from "../../src/components/comment";
import { BottomNav } from "../../src/components/BottomNav";

export default function Status(props: {
    setParams: (params: any) => void | any;
    params: any;
    lastPage: any;
    swapPage: (page: any) => void | any;
    setLastPage: (page: any) => void | any;
    currentPage: any;
    type: any;
    id: any;
    
}){

  if(typeof window === "undefined") return <></>
  let [record, setRecord] = useState<any>(null); 
  useEffect(() => {
   if(typeof window !== "undefined"){
    if(api.cacheStore.has(`${props.type || props.params.type}-${props.id || props.params.id}-status`)){
        setRecord(JSON.parse(api.cacheStore.get(`${props.type || props.params.type}-${props.id || props.params.id}-status`)).value);
    }else{
        api.read({
            collection: props.type || props.params.type,
            id: props.id || props.params.id,
            cacheKey: `${props.type || props.params.type}-${props.id || props.params.id}-status`,
            expand: ["author", "comments", "comments.user", "likes", "followers", "following", "repost.author", "views"],
         }).then((res) => {  
            setRecord(res);
            api.cacheStore.set(`${props.type || props.params.type}-${props.id || props.params.id}-status`, res, 1000 * 60 * 5);
         });
    }
     
     
   }
  }, []);
  useEffect(() => {
    if(record){ 
        //@ts-ignore
        window.engamentReferer = record.id; 
        let views = record.views;
        if(!views.includes(api.authStore.model().id) && api.authStore.model().id !== record.author){
            views.push(api.authStore.model().id);
            api.update({
                collection: "posts",
                id: props.id || props.params.id,
                cacheKey: `${props.type || props.params.type}-${props.id || props.params.id}-status`,
                invalidateCache:[`user-home-feed-${api.authStore.model().id}`, `user-feed-posts-1-${record.author}`],
                record: {
                    views
                }
            }).then((res) => {
                setRecord({...record, views})
            })
        }
        document.title = `${record.expand.author.username.charAt(0).toUpperCase() + record.expand.author.username.slice(1)} on Postr "${record.content.slice(0, 20)}..." - Postr`
    }
  }, [record]); 
  return (
      <div
       className=" relative xl:flex  2xl:w-[80vw]  lg:flex w-full  justify-center xl:mx-auto"
      >
        <SideBarLeft
         {...props}
     >

     </SideBarLeft>
     <div className={`  xl:w-[35vw]
         md:w-[50vw]  xl:mx-24 
         ${
            //@ts-ignore
            theme == 'dark' ? `
            ${
            record && record.comments.length > 0 && 'border-[#121212] border-2'
            }
            ` :  record && record.comments.length > 0 && 'border-[#f8f7f7] border-2'
         }
         `}>
        <div className={`flex hero gap-5    mt-2 xl:mx-5 lg:mx-5 md:mx-5 
        ${
            //@ts-ignore
            theme == 'dark' ? 'bg-black text-white' : 'bg-white text-black'
        }    
        w-full`}>
        <div className={`  p-2 
        ${
            theme == 'dark' ? 'bg-black text-white fill-white hover:border-slate-200' : 'hover:border-slate-200 hover:bg-white'
        }
        btn-ghost btn btn-circle btn-sm    `} 
        > 
        <span data-tip="Go back" className="tooltip tooltip-bottom"> 
        <svg 
        onClick={() => { 
            props.goBack()
        }}
        viewBox="0 0 24 24" aria-hidden="true"  
        className="w-6 h-6 cursor-pointer  xl:w-6 xl:h-6
        "
        ><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
        </span>
        </div> 
        </div>
        <div className=" mt-5">
        {
            record ? <Post {...record} 
            showFullDate={true}  
            showFullContent={true}
            actions={
                {
                    clicks_user_profile: () =>{
                        //@ts-ignore
                        window.referedFrom = "status_"  + record.id;
                    }
                }
            }
            cacheKey={`${props.type || props.params.type}-${props.id || props.params.id}-status`}
            {...props}
            /> : <div>
                <div className="flex flex-col gap-5 p-2 w-full">
                     <Loading />
                </div>
            </div>
        }
        {
            record ? <div>
                <div className="flex flex-col  w-full">
                {
                    record.expand.comments && record.expand.comments.length > 0 ?
                                record.expand.comments.map((comment:any) => { 
                                    return <div key={comment.id}
                                    style={{
                                        borderTop: theme == 'dark' ? '1px solid #121212' : '1px solid #f8f7f7'
                                    }}
                                     className={`
                                         
                                        `}
                                    >
                                          <Comment {...comment} 
                                          currentPage={props.currentPage}
                                          post={record} user={comment.expand.user} statusPage={true} />
                                    </div>
                                })
                                :  <div className="mx-auto justify-center w-full flex mt-2 hero flex-col">
                                <h1 className="text-2xl font-bold text-center">No Comments 😢</h1>
                  
                                <p
                                  className="text-gray-500 text-sm  text-center prose
                                  w-[300px] break-normal mt-6
                                  "
                                >
                                  Be the first to comment on this post.
                                </p>
                              </div>
                            }
                </div>
            </div> : ""
        }
        </div>
     </div>
     <SideBarRight
     {...props}
     >

     </SideBarRight> 
      <div className="xl:hidden lg:hidden">
        
     <BottomNav {...props} />
      </div>
      </div>
  )
}