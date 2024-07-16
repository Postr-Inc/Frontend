"use client";
import { useRef, useState, useEffect } from "react";
import Post from "src/components/post";
import { Loading } from "/src/components/icons/loading"; 
import { api } from "src/api/api";
import { SideBarLeft, SideBarRight } from "src/components/Sidebars"; 
import { BottomNav } from "src/components/BottomNav";

export default function Bookmarks(props: any) {
  let initialized = useRef(false);
  let [bookmarks, setBookmarks] = useState<any>([]);
  let [isClient, setClient] = useState(false);
  let [loading, setLoading] = useState(false);
  async function loadBookmarks() { 
    setLoading(true);
    let res: any = await api.read({
      collection: "users",
      cacheKey: `bookmarks-${api.authStore.model().id}`,
      id: api.authStore.model().id,
      expand: [
        "bookmarks",
        "bookmarks.author", 
      ],
    });  
    setBookmarks(res.hasOwnProperty("bookmarks") ? res.expand.bookmarks : []);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
  if (!initialized.current && typeof window !== "undefined") {
    loadBookmarks();
    initialized.current = true;
  }
  useEffect(() => {
    if (typeof window !== "undefined") setClient(true);
  }, [bookmarks]);

  return (
    <>
      {isClient ? (
        <div className="relative xl:flex  sm:p-2  lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ">
          <SideBarLeft
            {...props}
          />
          <div className="flex flex-col gap-5">
            <div className={`
              sticky  
              ${
                theme === "dark"  ? "bg-transparent" : "bg-white"
              }
              z-[999] xl:mx-24 p-3 sm:p-2 top-0"
              `}>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col ">
                  <p className="font-bold">Bookmarks</p>
                  <p>@{api.authStore.model().username}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div
              className=" xl:mx-24      text-md   
      relative 
      xl:w-[35vw]
      md:w-[80vw]
     
             xl:text-sm md:text-sm"
            >
              <div className="mb-32">
                 {
                  loading ? (
                    <div className="sm:p-2">
                      <Loading />
                    </div>
                  )  : (
                    <div>
                      
                      {
                        bookmarks.length > 0 ? bookmarks.map((post: any) => {
                          console.log(post);
                          return (
                            <Post
                              {...post}
                              key={post.id}
                              post={post}
                              page={"bookmarks"}
                              params={props.params}
                              setParams={props.setParams}
                              currentPage={props.currentPage}
                              swapPage={props.swapPage}
                              deleteBookmark={async () => {
                                setBookmarks(
                                  bookmarks.filter(
                                    (bookmark: any) => bookmark.id !== post.id
                                  )
                                );
                              }}
                               
                            />
                          )  
                        })
                          :   <div
                          className="  flex flex-col sm:mt-2 mt-6 xl:justify-center xl:mx-auto  xl:p-5 lg:p-5 lg:justify-center lg:mx-auto
                    w-[22rem] xl:w-[30rem]
                   drop-shadow-md not-sr-only   p-2
                
              "
                        >
                          <span className="  font-bold text-2xl mt-2 ">
                            Save posts to view them here
                          </span>
                          <span className="text-sm">
                            Dont let your favorite posts get away. Tap the bookamark
                            icon on the bottom of any post to add it to this
                            collection. So you can easily find it later.
                          </span>
                        </div>
                         
                      }
                      
                      </div>
                    )} 
              </div>

              <div className="xl:hidden lg:hidden">
                <BottomNav
                   {...props}
                />
              </div>
            </div>
          </div>

          <SideBarRight
            params={props.params}
            setParams={props.setParams}
            currentPage={props.currentPage}
            swapPage={props.swapPage}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
