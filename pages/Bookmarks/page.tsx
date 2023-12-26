"use client";
import { useRef, useState, useEffect } from "react";
import Post from "@/src/components/post";
import { Loading } from "@/src/components/icons/loading";
import BottomModal from "@/src/components/Bottomupmodal";
import { api } from "@/src/api/api";
import { SideBarLeft, SideBarRight } from "@/src/components/Sidebars";
import Scroller from "react-infinite-scroll-component";
import BottomNav from "@/src/components/BottomNav";
import Bookmark from "@/src/components/icons/bookmark";

export default function Bookmarks(props: any) {
  let initialized = useRef(false);
  let [bookmarks, setBookmarks] = useState<any>([]);
  let [isClient, setClient] = useState(false);
  async function loadBookmarks() {
    if (api.cacehStore.has("bookmarks")) {
      let cache = JSON.parse(api.cacehStore.get("bookmarks")).value;
      setBookmarks(cache);
      return;
    }
    let res: any = await api.read({
      collection: "users",
      id: api.authStore.model().id,
      expand: [
        "bookmarks",
        "bookmarks.author",
        "bookmarks.comments",
        "bookmarks.comments.user",
      ],
    });
    console.log(res);
    api.cacehStore.set(
      "bookmarks",
      res.expand["bookmarks"] ? res.expand["bookmarks"] : [],
      1000 * 60 * 60 * 24 * 7
    );
    setBookmarks(res.expand["bookmarks"] ? res.expand["bookmarks"] : []);
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
            params={props.params}
            setParams={props.setParams}
            currentPage={props.currentPage}
            swapPage={props.swapPage}
          />
          <div className="flex flex-col gap-5">
            <div className="sticky bg-white z-[999] xl:mx-24 p-3 top-0">
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
              className=" xl:mx-24     text-md   
      relative 
      xl:w-[35vw]
      md:w-[80vw]
     
             xl:text-sm md:text-sm"
            >
              <div className="mb-32">
                {api.authStore.model().bookmarks.length > 0 ? (
                  bookmarks.map((post: any) => {
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
                        updateCache={(key: string, value: any) => {
                          console.log("updating cache");
                          let cache = JSON.parse(
                            api.cacehStore.get("bookmarks")
                          );
                          cache.value.forEach((e: any, index: number) => {
                            if (e.id === key) {
                              cache.value[index] = value;
                            }
                          });
                          for (var i in api.cacehStore.keys()) {
                            let key = api.cacehStore.keys()[i];
                            if (key.includes("user-feed") || key.includes("home")) {
                               
                                let cache = JSON.parse(api.cacehStore.get(key));
                                cache.value.items.forEach((e: any, index: number) => {
                                  if (e.id ===  value.id) {
                                    cache.value.items[index] = value;
                                    api.update({id: e.id, collection: "posts", record: value, cacheKey: key})
                                    
                                  }
                                });
                                api.cacehStore.set(key, cache.value, 1000 * 60 * 60 * 24 * 7);
                                
                            }
                          }
                          api.cacehStore.set(
                            "bookmarks",
                            cache.value,
                            1000 * 60 * 60 * 24 * 7
                          );
                        }}
                      />
                    );
                  })
                ) : (
                  <div
                    className="p-5 flex flex-col mt-6 justify-center mx-auto  
              w-[30rem]
             drop-shadow-md not-sr-only  
          
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
                )}
              </div>

              <div className="xl:hidden lg:hidden">
                <BottomNav
                  params={props.params}
                  setParams={props.setParams}
                  currentPage={props.currentPage}
                  swapPage={props.swapPage}
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
