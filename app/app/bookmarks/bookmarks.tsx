import { useRef, useState } from "react";
import Post from "@/src/components/post";
import { Loading } from "@/src/components/icons/loading";
import Bookmark from "@/src/components/icons/bookmark";
import BottomModal from "@/src/components/Bottomupmodal";
import { api } from "@/src/api/api";
export default function Bookmarks(props: any) {
  let initialized = useRef(false);
  let [bookmarks, setBookmarks] = useState<any>([]);
  async function loadBookmarks() {
    let res: any = await api.list({
      collection: "users",
      page: 0,
      limit: 1,
      expand: ["bookmarks", "bookmarks.author", "bookmarks.comments", "bookmarks.comments.user"],
      filter: `id= "${api.authStore.model.id}"`,
    });
   setTimeout(() => {
    setBookmarks(res.items[0].expand.bookmarks);
   }, 1000);
          
  }
  if (!initialized.current) {
    loadBookmarks();
    initialized.current = true;
  }
  return <div className="p-2">
     <div className="flex  p-2   justify-between">
        <svg
          onClick={() => {
            setBookmarks([]);
            props.setLastPage("bookmarks")
            props.swapPage("home");
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5
             
              
             "
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clip-rule="evenodd"
          ></path>
        </svg>
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
          onClick={() => {
            //@ts-ignore
            document.getElementById("bookmarksModal")?.showModal();
          }}
        >
          <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
      </div>

    <div className="p-2 mt-6 flex flex-col gap-5">
    {
      api.authStore.model.bookmarks.length > 0 && bookmarks && bookmarks.length < 1 ? Array.from(Array(10).keys()).map((i) => {
        return <Loading />
      }) : api.authStore.model.bookmarks.length > 0 && bookmarks ? bookmarks.map((bookmark: any) => {
        return (
          <Post key={bookmark.id} {...bookmark} swapPage={props.swapPage} setParams={props.setParams} />
        );
      }) : <div className=" mx-auto justify-center flex flex-col">
        <h1 className="text-2xl font-bold text-center">No Bookmarks 😢</h1>
         
         <p className="text-gray-500 text-sm  text-center prose
        w-[300px] break-normal mt-3 
         ">
          Clicking the bookmark icon on a post will add it to your bookmarks.
         </p>
        
      </div>
    }
    </div>
    <BottomModal  height={`
    ${
      api.authStore.model.bookmarks.length  < 1 ? "h-24" : "h-[40vh]"
    }
    relative`} id="bookmarksModal">
      <p className={`w-full   text-red-500
      ${
        api.authStore.model.bookmarks.length  < 1 ? "hidden" : ""
      }
      `}
      
      >
        Clear all bookmarks?
      </p>
      <div className="p-5">
      <button 
      onClick={()=>{
        //@ts-ignore
        document.getElementById("bookmarksModal")?.close();
      }}
      className="btn rounded-full  
      translate-x-0 inset-x-0 mx-auto
      left-0 p-5  w-[95%] btn-ghost absolute bottom-2  border-slate-200 focus:outline-none">
        Cancel
      </button>
      </div>
    </BottomModal>
  </div>
}
