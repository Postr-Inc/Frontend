import { api } from "@/src";
import { createSignal } from "solid-js";

export default function usePost(postData: any){ 
     let [likes, setLikes] = createSignal<any[]>(postData.likes || [])
     let [comments, setComments] = createSignal<any[]>(postData.comments || [])
     let [views, setViews] = createSignal<any[]>(postData.views || [])
     function updateLikes(userid: string){
         let index = likes().findIndex((like) => like === userid)
         if(index === -1){
             setLikes([...likes(), userid]) 
         }else{
             let newLikes = likes().filter((like) => like !== userid)
             setLikes(newLikes) 
         } 
         api.collection("posts").update(postData.id, {likes: likes()})
     }
  
     return {likes, updateLikes, comments, views}
}