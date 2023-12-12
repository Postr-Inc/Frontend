import { api } from "@/app/app/page";
import { useState } from "react";
export default function Comment(props:{
    id:string,
    text:string,
    deleteComment?:any,
    post:any,
    created:string,
    expand:any,
    swapPage?:any,
    setParams?:any,
    setComments?:any,
    comments?:any,
    likes:any
}) {


    let [likes, setLikes] = useState(props.likes)
    
   async function likeComment(){
        switch (likes.includes(api.authStore.model.id)) {
            case true:
              console.log("unlike");
              setLikes(likes.filter((id: any) => id != api.authStore.model.id));
              await api.update({
                collection: "comments",
                id: props.id,
                record: {
                  likes: likes.filter((id: any) => id != api.authStore.model.id),
                },
              });
              break;
      
            default:
              setLikes([...likes, api.authStore.model.id]);
              await api.update({
                collection:  "comments",
                id: props.id,
                record: { likes: [...likes, api.authStore.model.id] },
              });
              break;
          }
         
    }
    const created = () => {
        let date = new Date(props.created);
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let seconds = diff / 1000;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        let days = hours / 24;
        let weeks = days / 7;
        let months = weeks / 4;
        let years = months / 12;
        switch (true) {
          case seconds < 60:
            return `${Math.floor(seconds)}s`;
            break;
          case minutes < 60:
            return `${Math.floor(minutes)}m`;
            break;
          case hours < 24:
            return `${Math.floor(hours)}h`;
            break;
          case days < 7:
            return `${Math.floor(days)}d`;
            break;
          case weeks < 4:
            return `${Math.floor(weeks)}w`;
            break;
          case months < 12:
            return `${Math.floor(months)}mo`;
            break;
          case years > 1:
            return `${Math.floor(years)}y`;
            break;
          default:
            break;
        }
      };
  return (
    <div className="flex flex-col gap-2  first-letter:">
     <div className="flex flex-row gap-3 relative">
        <img src={api.cdn.url({id:props.expand.user.id, collection:'users', file:props.expand.user.avatar})} alt="avatar" className="rounded-full w-8 h-8"/>
         <div className="flex  gap-3   ">
         <p className="font-semibold" 
         onClick={()=>{
            if(props.swapPage){
                props.swapPage("user")
                props.setParams({user:props.expand.user})
            }
         }}
         >
            {props.expand.user.username}
        </p>
        <p>
            @{props.expand.user.username}
        </p>
 
        
        {
            props.expand.user.validVerified ? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className="w-6 h-6 fill-green-500">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          
            : ""
        }
        <p className="opacity-50 absolute end-12">{  created()} </p>

        
        <details className="dropdown h-0 dropdown-left absolute end-2  ">
  <summary className=" focus:outline-none">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
</svg>
  </summary>
  <ul className=" shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
    {
        props.expand.user.id == api.authStore.model.id ?  <li><a
        onClick={()=>{
            let dialog = document.getElementById("deleteComment")
            if(dialog){
                // @ts-ignore
                dialog.showModal()
            }
        }}
        >Delete</a></li>
        : ""
    }
    <li><a>Item 2</a></li>
  </ul>
</details>
<dialog id="deleteComment" className="modal">
  <div className=" bg-white shadow p-5 w-[80%] rounded-box items-center mx-auto">
   <div className="flex flex-col justify-center mx-auto">
   <h3 className="font-bold text-lg">Delete Comment</h3>
    <p className="py-4">You have selected to delete this comment. Are you sure?</p>
   </div>
  
      <form method="dialog" className="flex  gap-2  hero justify-between  ">
        {/* if there is a button in form, it will close the modal */}
        <button className="text-red-500"
        onClick={()=>{props.deleteComment()}}
        >
            Delete Comment
        </button>
        <button className=" ">
            Cancel
        </button >
      </form>
    
  </div>
</dialog>
        

        

         </div>
     </div>
     <p>
        {props.text}
     </p>
  
   <div className="flex flex-row gap-4 mt-2 ">
   <svg 
   onClick={()=>{likeComment()}}
   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  stroke={
         likes.includes(api.authStore.model.id) ? "red" : "currentColor"
     
   }
   fill={ 
    likes.includes(api.authStore.model.id) ? "red" : "none"
   }
   className="w-6 h-6">
  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="   cursor-pointer   w-6 h-6      "><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path></svg>
 
   </div>
   <p className="text-[#656565]">
    Reply
   </p>
    <p className="text-[#656565]">
      {likes.length} likes
    </p>
    </div>
  );
}   