import Bookmark from "@/src/components/icons/bookmark";
import { api } from "../page";
import Settings from "@/src/components/icons/settings";
import { useRef, useEffect, useState } from "react";
import Scroller from "react-infinite-scroll-component";
import { Loading } from "@/src/components/icons/loading";
import Post from "@/src/components/post";
//@ts-ignore
import BottomNav from "@/src/components/bottomNav";
export default function Home(props: { swapPage: Function , setParams:Function,  setLastPage:Function, params:any, lastPage:string}) {
  let hasRan = useRef(false);
  let [posts, setPosts] = useState<any>([]);
  let [totalPages, setTotalPages] = useState(0);
  let [page, setPage] = useState(1);
  let [isInitialLoad, setIsInitialLoad] = useState(true);
  let [windowScroll, setWindowScroll] = useState(window.scrollY);  
  let [hasMore, setHasMore] = useState(true);
  function handleRatelimit(params: {
    limit: string;
    duration: string;
    used: string;
  }) {
    console.log(params);
  }
  async function loadMore() {
    console.log("loading more");
    let { ratelimited, limit, duration, used } =
      await api.authStore.isRatelimited("list");

    switch (true) {
      case ratelimited:
        handleRatelimit({ limit, duration, used });
        break;

      case page >= totalPages:
        console.log(totalPages);

        setHasMore(false);
        break;
      default:
        console.log("loading more");
        await api
          .list({
            collection: "posts",
            limit: 10,
            page: page,
            expand: ["author", "comments.user"],
            sort: `-created`
          })
          .then((e: any) => {
            setPosts([...posts, ...e.items]);
            setTotalPages(e.totalPages);
            setPage(page + 1);
          })
          .catch((e: any) => {
            console.log(e);
          });
        break;
    }
  }

  useEffect(() => {
    if (!hasRan.current) {
      window.onscroll = () => {
        setWindowScroll(window.scrollY);
      }
      props.setLastPage("home")
     
      api.authStore.update()
      api
        .list({ collection: "posts", limit: 10, page: 0, expand: ["author", "comments.user"], sort: `-created`})
        .then((e: any) => {
          console.log(e?.items[5].expand)
          setTotalPages(e.totalPages);
          setPosts(e.items);
        });
    }
    return () => {
      hasRan.current = true;
    };
  }, []);
  return (
    <>
      <main
        className=" p-5  relative   text-md  w-screen  justify-center flex flex-col mx-auto
  
           xl:text-sm md:text-sm"
      >
        {
          windowScroll > 1000
          && posts.length > 0
          ? 
          
          <div 
          onClick={()=>window.scrollTo({top:0, behavior:"smooth"})} 
          className="fixed top-4 p-3 w-fit h-10   translate-x-0 inset-x-0  mx-auto flex hero gap-2 text-white    rounded-full bg-[#43b1f1]">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7">
  <path fillRule="evenodd" d="M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 11-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z" clipRule="evenodd" />
</svg>

           <div className="border-none  -space-x-2  flex">
           {
            Array.from(Array(3).keys()).map((e:any)=>{
              let post = posts[e]
              return   <div className="flex hero gap-2">
              <div className="avatar border-none">
            <div className="w-8">
              <img src={
               `
                https://bird-meet-rationally.ngrok-free.app/api/files/_pb_users_auth_/${post?.expand.author.id}/${post?.expand.author.avatar}
               `
              } alt="avatar" className="rounded-full w-full h-full"
              />
            </div>
          </div>
           
          </div>
            })
           }
           
       </div> <p  className="text-sm" >
              posted
            </p>
            
          </div>
          : ""
        }
        <div className="flex  justify-between ">
          <div className="flex gap-2 hero">
            <div className="flex flex-col   w-full">
              <div className="flex  justify-between gap-2 w-full">
                <div className="flex gap-2 hero">
                  <div className="dropdown  ">
                    <label tabIndex={0}>
                      <img
                        src={api.authStore.img()}
                        alt={api.authStore.model.username}
                        className="rounded-full w-8 h-8 cursor-pointer"
                      ></img>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a
                        onClick={()=>{
                          props.swapPage("user")
                          props.setParams({user:api.authStore.model})
                        }}
                        >View Profile</a>
                      </li>
                      {api.authStore.model.postr_plus ? (
                        <li>
                          <a>
                            Your benefits
                            <span className="badge badge-outline border-blue-500 text-blue-500">
                              ++
                            </span>
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <a>Set Status</a>
                      </li>
                    </ul>
                  </div>
                  <p>@{api.authStore.model.username}</p>
                  {api.authStore.model.validVerified ? (
                    <div className="tooltip tooltip-bottom" data-tip="Verified">
                      <img
                        src="/icons/verified.png"
                        width={15}
                        height={15}
                        alt="verified"
                      ></img>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <Bookmark className="w-8 h-8 cursor-pointer"
                onClick={()=>{
                  props.swapPage("bookmarks")
                }}
                />
                <Settings className="w-8 h-8 cursor-pointer" />
              </div>
              {api.authStore.model.postr_plus ? (
                <span className="badge badge-outline  text-sky-500 z-[-1] p-2 mt-5   border-sky-500">
                  Postr ++
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        
        
        <div className="flex hero justify-between mt-5">
          <p>
            Following
          </p>
          <p>
            For You
          </p>
          <p>
            Trending
          </p>
        </div>
 
        <Scroller
          className="mt-6 flex flex-col gap-4  "
          dataLength={posts.length}
          hasMore={true}
          next={loadMore}
          loader={""}
        >
          {posts.length > 0
            ? posts.map((e: any) => {
                return (
                  <div className="mt-5" key={e.id}
                  id={e.id}
                  >
                    <Post {...e} swapPage={props.swapPage} setParams={props.setParams}
                    
                    ></Post>
                  </div>
                );
              })
            : Array.from(Array(10).keys()).map((e: any) => {
                return <Loading key={e}></Loading>;
              })}
        </Scroller>
        <BottomNav/>
      </main>
      
    </>
  );
}
