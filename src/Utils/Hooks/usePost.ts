import { api } from "@/src";
import { createSignal } from "solid-js";

export default function usePost(postData: any) { 
  let [likes, setLikes] = createSignal<any[]>(postData.likes || []);
  let [comments, setComments] = createSignal<any[]>([]);
  let [commentLength, setCommentLength] = createSignal(
    postData?.comments?.length || 0
  );
  let [views, setViews] = createSignal<any[]>(postData.views || []);
  function updateLikes(userid: string, isComment: boolean = false) {
    let index = likes().findIndex((like) => like === userid);
    if (index === -1) {
      setLikes([...likes(), userid]);
    } else {
      let newLikes = likes().filter((like) => like !== userid);
      setLikes(newLikes);
    }
    api
      .collection(isComment ? "comments" : "posts")
      .update(postData.id, { likes: likes() });
  }
 
  return { likes, updateLikes, comments, views, commentLength };
}
