"use client";

import { Props } from "@/src/@types/types";
import { api } from "@/src/api/api";
import { SideBarLeft, SideBarRight } from "@/src/components/Sidebars";
import { Loading } from "@/src/components/icons/loading";
import Post from "@/src/components/post";
import { Comme } from "next/font/google";
import { useEffect, useState } from "react";
import Comment from "@/src/components/comment";
import { BottomNav } from "@/src/components/BottomNav";

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
     if(props.params.hasOwnProperty("post")){
        setRecord(props.params.post)
     }else{
        api.read({
            collection: props.type || props.params.type,
            id: props.id || props.params.id,
            cacheKey: `${props.type || props.params.type}-${props.id || props.params.id}-status`,
            expand: ["author", "comments", "comments.user", "likes", "followers", "following"],
         }).then((res) => { 
            setRecord(res);
         });
     }
     
   }
  }, []);
  useEffect(() => {
    if(record){
        document.title = `${record.expand.author.username.charAt(0).toUpperCase() + record.expand.author.username.slice(1)} on Postr "${record.content.slice(0, 20)}..." - Postr`
    }
  }, [record]);
  console.log(record)
  return (
      <div
       className=" relative xl:flex  xl:w-[80vw]  lg:flex w-full  justify-center xl:mx-auto"
      >
        <SideBarLeft
         {...props}
     >

     </SideBarLeft>
     <div className="  xl:w-[35vw]
         md:w-[50vw]  xl:mx-24 border-[#f8f7f7] border-2">
        <div className="flex hero gap-5  p-2 xl:mx-5 lg:mx-5 md:mx-5 bg-white w-full">
        <div className="hover:border-slate-200 hover:bg-white btn-ghost btn btn-circle btn-sm bg-white  " 
        > 
        <span data-tip="Go back" className="tooltip tooltip-bottom"> 
        <svg 
        onClick={() => {
            let lastPage = props.lastPage;  
            props.swapPage(lastPage);
        }}
        viewBox="0 0 24 24" aria-hidden="true"  
        className="w-6 h-6 cursor-pointer  xl:w-6 xl:h-6
        "
        ><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
        </span>
        </div>
            <h1>{props.type.charAt(0).toUpperCase() + props.type.slice(1)}</h1>
        </div>
        <div className="mx-2 p-1 mt-5">
        {
            record ? <Post {...record} 
            showFullDate={true} 
            {...props}
            /> : <div>
                <div className="flex flex-col gap-5 w-full">
                     <Loading />
                </div>
            </div>
        }
        {
            record ? <div>
                <div className="flex flex-col gap-5 w-full">
                {
                    record.expand.comments && record.expand.comments.length > 0 ?
                                record.expand.comments.map((comment:any) => {
                                    console.log(comment)
                                    return <div key={comment.id}>
                                          <Comment {...comment} post={record} user={comment.expand.user} statusPage={true} />
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