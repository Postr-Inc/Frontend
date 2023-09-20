import { useState, useEffect, useRef } from "react";
import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Modal from "../components/Modal";
import Post from '../components/Post'
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../components/Loading'
export default function Search() {
  let [search, setSearch] = useState("");
  let [items, setItems] = useState([]);
  let [isSearching, setIsSearching] = useState(false);
  let inputref = useRef(null);
  let [page, setPage] = useState(1);
  let [isLoadMore, setIsLoadMore] = useState(false);
  let [total, setTotal] = useState(0);
  let [type, setType] = useState("posts");
  function loadMoreItems() {
    setIsLoadMore(true);
    api
      .collection(type === 'tags' ? 'posts' : type === 'keywords' ? 'posts' : type === 'users' ? 'users' : 'posts')
      .getList(page, 10, {
        expand: 'author',
        sort: "+likes:length,-comments:length,created",
         filter:  type === 'tags' ? `tags ~ "${search}"  && author.Isprivate != true && author.deactivated != true` :  
         type === 'keywords' ? `content ~ "${search}"  && author.Isprivate != true && author.deactivated != true` 
         : type === 'users'  ? `username ~ "${search}"  && author.Isprivate != true && author.deactivated != true` 
         : `author.id != "${api.authStore.model.id}" && author.deactivated != true
         && author.Isprivate != true && author.followers !~ "${api.authStore.model.id}" 
         `,
      })
      .then((res) => {
        // sort by date
        res.items.sort((a, b) => {
          return new Date(b.created) - new Date(a.created);
        });
        
        setItems([...items, ...res.items]);
        setTotal(res.totalPages);
        setIsLoadMore(false);
      });
  }
  


  function handleSearch(e) {

  }
 
  useEffect(() => {
    loadMoreItems();
    setType('posts')
  }, []);
  return (
    <div className=" flex flex-col   ">
      <div className="flex p-2 flex-row justify-between  ">
        <span className=" btn btn-sm bg-transparent border-none focus:bg-transparent hover:bg-transparent " style={{ fontSize: "1rem" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
            onClick={() => {
              if (Object.keys(edited).length > 0) {
                document.getElementById("discard").showModal();
              } else {
                document.getElementById("editprofile").close();
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </span>

        <div class="relative flex flex-row">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            
          </div>

          <input
            type="search"
            id="default-search"
            class="block  p-4 pl-10 text-sm
        input input-bordered   w-72 rounded-md
        input-sm
        "
            placeholder="Search #tags, @Users, or keywords"
            required
          />
        </div>
        <h1 className="  capitalize text-md font-bold text-rose-500 btn btn-sm bg-transparent border-none focus:bg-transparent hover:bg-transparent">Search</h1>
    
       

      </div>
      <h1 className="font-bold text-xl  p-5 ">For You</h1>
      <div className="flex flex-col gap-2 p-5">
       
       <InfiniteScroll 
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={isLoadMore}
        loader={
          <div className="flex flex-col gap-5">
            <Loading />
            <Loading />
            <Loading />
          </div>
        }
        >
      {items.map((item) => {
          return (
            type === "tags" || "keywords"  || "posts" ?
             <Post key={item.id} content={item.content} author={item.expand.author}
              id={item.id}
              tags={item.tags}
             likes={item.likes} comments={item.comments}
             created={item.created}
             
             />
           :<></>
           
          );
        })}
        </InfiniteScroll>
         
      </div>
       
      <div className="mt-12">
        <Bottomnav />
      </div>
    </div>
  );
}
function debounce(fn, time) {
  let timeout;
  if (!time) {
    time = 1000;
  }
  // make sure it only goes once at a time
  return function () {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}
