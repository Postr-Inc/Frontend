import { useEffect, useState, useRef } from "react";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../components/Modal";
import Comment from "../components/Comments";
import sanitizeHtml from "sanitize-html";
import { api } from ".";
function fetchPosts(page, pageSelected) {
  return api
    .collection("posts")
    .getList(page, 10, {
      expand: "author,comments.user",
      sort: `
      ${
        pageSelected === "posts"
          ? "-created"
          : "" || pageSelected === "recommended"
          ? "-author.followers"
          : "" || pageSelected === "top"
          ? "-likes, -created"
          : ""
          
      }
      `,
      filter: `
      ${
        pageSelected === "posts"
          ?  `author.followers ~ "${api.authStore.model.id}" && author.id != "${api.authStore.model.id}" && author.deactivated != true`
          : "" || pageSelected === "recommended"
          ? `author.id != "${api.authStore.model.id}" && author.followers !~ "${api.authStore.model.id}" && author.deactivated != true`
          : "" || pageSelected === "top"
          ? `author.id != "${api.authStore.model.id}" && author.deactivated != true`
          : ""
      }

      `,
    })
    .then((posts) => {
      return {
        items: posts.items,
        totalPages: posts.totalPages,
        totalItems: posts.totalItems,
      };
    });
}
export default function Home() {
  let maxChars = 80;
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
 
  const [totalPages, setTotalPages] = useState(0);
  const [comments, setComments] = useState([]); // [postid, comments
 
  let [page, setPage] = useState(1);
 
  let [pageSelected, setPageSelected] = useState("posts");
  useEffect(() => {
    setTotalPages(0)
    setPosts([]);
    setPage(1)
    fetchPosts(1, pageSelected).then((fetchedPosts) => {
      setPosts(fetchedPosts.items);
      setTotalPages(fetchedPosts.totalPages);
    });
  }, [pageSelected]);

  function fetchMorePosts() {
    if (Number(page) >= Number(totalPages)) {
      setHasMore(false);
      console.log(page, totalPages)
    } else {
      const nextPage = page + 1;
      fetchPosts(nextPage, pageSelected).then((fetchedPosts) => {
        console.log(fetchedPosts)
        setPage(nextPage);
        setPosts([...posts, ...fetchedPosts.items]);
        setTotalPages(fetchedPosts.totalPages)
        fetchPosts.items?.map((post) => {
          setComments([...comments, ...post.expand.comments]);
        });
      });
    }
  }

 
   
  return (
    <div className="p-5 mt-2    ">
      <div className="flex flex-row justify-between">
        <h1 className=" text-2xl" style={{ fontFamily: "Pacifico" }}>
          Postr
        </h1>

        <div></div>

        <div className="flex flex-row gap-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              window.location.pathname = "/bookmarks"
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
               if(window.location.pathname !== "/settings"){
                 window.location.pathname = "/settings"
               }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <div
        className=" font-medium   mb-6 flex flex-row justify-between mt-4 gap-1"
        style={{ fontFamily: "Inter", fontSize: "14px" }}
      >
        <a
          className={`
         cursor-pointer
         text-lg  ${
           pageSelected === "posts" ? "underline underline-offset-[10px]" : ""
         }`}
          onClick={() => {
            if (pageSelected !== "posts") {
              setPageSelected("posts");
            }
          }}
        >
          Following
        </a>
        <a
          onClick={() => {
            if (pageSelected !== "recommended") {
              setPageSelected("recommended");
            }
          }}
          className={`
         cursor-pointer
         text-lg  ${
           pageSelected === "recommended"
             ? "underline underline-offset-[10px]"
             : ""
         }`}
        >
          Recommended
        </a>
        <a
          onClick={() => {
            if (pageSelected !== "top") {
              setPageSelected("top");
            }
          }}
          className={`
             cursor-pointer
          text-lg ${
            pageSelected === "top" ? "underline underline-offset-[10px]" : ""
          } `}
        >
          Top Posts
        </a>
      </div>
      <div className="flex flex-row gap-5">
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<Loading />} // Display loading indicator while fetching more posts
      >
        <div className="flex flex-col gap-5 mt-8 mb-8" key="postcontainer">
          {posts.length < 1 ? (
            <div className=" gap-5 flex flex-col">
              <Loading />
              <Loading />
              <Loading />
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id}>
                <Post
                  file={post.file}
                  author={post.expand.author}
                  likes={post.likes}
                  verified={post.expand.author.validVerified}
                  comments={post.expand.comments ? post.expand.comments : []}
                  content={post.content}
                  id={post.id}
                  created={post.created}
                  bookmarked={post.bookmarked}
                />

                <Modal id={"moreinfo" + post.id} height="h-75">
                  <button className="flex justify-center mx-auto focus:outline-none">
                    <div className="divider  text-slate-400  w-12   mt-0"></div>
                  </button>
                  <h1 className="text-md justify-center flex mx-auto font-bold">
                    Why You're Seeing This Post
                  </h1>
                  <span className="text-md justify-center mt-5 flex mx-auto cursor-text ">
                    There are various reasons why you may see content on your
                    feed. Postr shows posts based on who you follow.
                  </span>
                  <div className="flex mt-6  gap-5 items-center">
                    <div className="avatar placeholder">
                      <div className=" ring-2 ring-slate-200 rounded-full w-12 h-12">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm cursor-text ">
                      This post was made by {post.expand.author.username} and
                      was posted on {new Date(post.created).toDateString()}.
                    </p>
                  </div>

                  {post.expand.author.followers.includes(
                    api.authStore.model.id
                  ) ? (
                    <div className="flex gap-5 items-center">
                      {post.expand.author.avatar ? (
                        <img
                          src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${post.expand.author.id}/${post.expand.author.avatar}`}
                          className="w-12 h-12 rounded-full object-cover mt-5"
                        />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content mt-5 border-slate-200 rounded-full w-12 h-12">
                            <span className="text-xs cursor-text">
                              {post.expand.author.username.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-sm mt-5">
                        You are following {post.expand.author.username}.
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </Modal>
              </div>
            ))
          )}
        </div>
      </InfiniteScroll>

      <div className="mt-8">
        <Bottomnav />
      </div>
    </div>
  );
}
