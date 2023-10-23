import { useState, useEffect, useRef } from "react";
import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Modal from "../components/Modal";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";

export default function Search() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("posts");
  const searchIconRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Handle different search types
  function handleSearch(value) {
    console.log(value)
    setItems([]);
    setSearch(value);
 if (value.startsWith("@") && value.trim().length > 1) {
      // Handle "@" followed by username
      setType("users");
      setPage(0);
      fetchData(value.slice(1)); // Exclude the "@" character
    } else if(value.startsWith('$') && value.trim().length > 1) {
      // Handle other keywords
      setPage(1);
      setType("keywords");
      fetchData(value.slice(1)); // Exclude the "$" character
      setIsSearching(true);
    }
    else if (value.startsWith('#') && value.trim().length > 1) {
      setPage(1);
      setType("tags");
      fetchData(value.slice(1)); // Exclude the "#" character
      setIsSearching(true);

    }
    else{ 
      setItems([]);
      setPage(0);
      setType("posts");
      fetchData(value);
      setIsSearching(true);
    }
  }
  
  // Fetch data based on search type
  function fetchData(query) {
    
    
    if (type === "users") {
      api
        .collection("users")
        .getList(page, 10, {
          sort: `+followers:length,-following:length,created`,
          filter: `username ~ "${query}"`,
          expand: "followers",
        })
        .then((res) => {
          const uniqueItems = res.items.filter((i) => !items.find((item) => item.id === i.id));
          setItems([...items, ...uniqueItems]); // Append new items to the existing items
          setTotal(res.totalPages);
        });
      return;
    }
    api
      .collection(
        type === "tags" || type === "keywords"
          ? "posts"
          : type === "users"
          ? "users"
          : "posts"
      )
      .getList(page, 10, {
        expand: "author",
        sort: "-created",
        filter:
          type === "tags"
            ? `tags ?~ "${query}" && author.Isprivate != true && author.deactivated != true`
            : type === "keywords"
            ? `content ~ "${query}" && author.Isprivate != true && author.deactivated != true`
            : type === "users"
            ? `username ?~ "${query}" `
            : `author.id != "${api.authStore.model.id}" && author.deactivated != true && author.Isprivate != true && author.followers !~ "${api.authStore.model.id}"`,
      })
      .then((res) => {
        // sort by date
       
        // remove dupe by id
        const uniqueItems = res.items.filter((i) => !items.find((item) => item.id === i.id));
        // sort by date
       uniqueItems.sort((a, b) => {
          return new Date(b.created) - new Date(a.created);
        });
        
        setItems([...items, ...uniqueItems]); // Append new items to the existing items
        setTotal(res.totalPages);
        
     
      });
  }

  function loadMoreItems() {
    console.log(page, total)
    if(Number(page) >= Number(total)) {
      setHasMore(false);
      return
    }
    setHasMore(true);
    setPage(page + 1);
    fetchData(search);
  }

  useEffect(() => {
   fetchData();
  }, []);

  return (
    <div className=" flex flex-col   p-5  ">
      <div className="flex  flex-row  gap-5 justify-between  ">
        <span className=" p-1  w-1 mr-5 bg-transparent border-none focus:bg-transparent hover:bg-transparent ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 hover:cursor-pointer"
            onClick={() => {
              window.history.back();
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
              id="search-icon"
              ref={searchIconRef}
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
        input input-bordered   w-72  
        rounded-full
        input-sm
        "
            onFocus={() => {
              searchIconRef.current.style.color = "#3b82f6";
            }}
            onBlur={() => {
              searchIconRef.current.style.color = "#9CA3AF";
            }}
            onInput={(e) => {handleSearch(e.target.value)}}
            onKeyUp={(e) => {
              setIsTyping(false);
            }}
            placeholder="Search #tags, @Users, or keywords"
            required
          />
        </div>

        <div></div>
      </div>
      <h1 className="font-bold text-xl     text-sky-500   mt-5 mb-2 ">
        {type === "tags"
          ? `${search}`
          : type === "keywords"
          ? ""
          : type === "users"
          ? `${search}`
          : "For You"}
      </h1>
      <div className="flex flex-col gap-2   mt-5 ">
        <InfiniteScroll
          dataLength={items.length}
          next={loadMoreItems}
          hasMore={hasMore}
          
        >
          {items.length > 0 ? (
            items.map((item) => {
              return type === "tags" ||
                type === "keywords" ||
                type === "posts" ?
               
                (
                 
                <div>
                  {
                    item.content ?  <Post
                    key={item.id}
                    content={item.content}
                    author={item.expand ? item.expand.author : ""}
                    id={item.id}
                    tags={item.tags}
                    likes={item.likes}
                    comments={item.comments}
                    created={item.created}
                    file={item.file}
                    verified={item.expand ? item.expand.author.validVerified : ""}
                    bookmarked={item.bookmarked}
                    color={item.textColor}
                  />
                  : ""
                  }
                </div>
              
              ) : (
                item.username && item.followers && item.bio ? (
                  <div className="flex flex-row justify-between items-center p-2 mb-8">
                    <div className="flex flex-row   gap-2">
                      {item.avatar ? (
                        <img
                          src={
                            api.baseUrl +
                            "/api/files/_pb_users_auth_/" +
                            item.id +
                            "/" +
                            item.avatar
                          }
                          alt=""
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-12 h-12">
                            <span className="text-sm">
                              {item.username[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col  mr-5">
                        <a
                          className="  text-sm capitalize"
                          href={`/u/${item.username}`}
                        >
                          {item.username}
                        </a>
                        <h1 className="text-gray-500 text-sm">{item.name}</h1>
                        <p className="text-gray-500 text-sm">
                          {item.bio ? item.bio : ""}
                        </p>
                        <div className="flex flex-row gap-2 mt-2">
                          <p className="text-gray-500 text-sm">
                            {item.followers ? item.followers.length : 0} Followers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className={`
                      ${
                        document.documentElement.getAttribute("data-theme") === "black" ? "bg-blue-500 border-none" : "bg-base-100 border border-slate-200 text-black"
                      }
                      btn btn-sm    rounded-full px-8 capitalize py-1 text-sm `}>
                        Message
                      </button>
                      {item.followers &&
                      !JSON.parse(
                        JSON.stringify(item.followers)
                      ).includes(api.authStore.model.id) ? (
                        <button className={`
                        ${
                          document.documentElement.getAttribute("data-theme") === "black" ? "bg-base-200 border-none" : "bg-[#121212] hover:bg-[#121212] border border-slate-200 text-white"
                        }
                        btn btn-sm   rounded-full px-8 capitalize py-1 text-sm `}>
                          Follow
                        </button>
                      ) : (
                        <button
                          className={`
                          ${
                            document.documentElement.getAttribute("data-theme") === "black" ? "bg-base-200 border-none" : "bg-[#121212] hover:bg-[#121212] border border-slate-200 text-white"
                          }
                          btn btn-sm text-white capitalize  rounded-full px-5 py-1 text-sm  

                    ${
                      document.documentElement.getAttribute("data-theme") ===
                      "black"
                        ? "boder border-gray-500"
                        : " border border-slate-200"
                    }
                    
                  `}
                        >
                          Following
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              );
            })
          ) : (
            <div>
              {!isSearching ? <Loading /> : ""}
            </div>
          )}
        </InfiniteScroll>
      </div>

      <div className="mt-12">
        <Bottomnav />
      </div>
    </div>
  );
}
