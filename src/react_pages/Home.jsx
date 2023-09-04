import { useEffect, useState, useRef } from "react";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../components/Modal";
import Comment from "../components/Comments";
import sanitizeHtml from "sanitize-html";
import { api } from ".";
function fetchPosts(page) {
  return api
    .collection("posts")
    .getList(page, 10, {
      expand: "author,comments.user",
      sort: "-created",
      filter: ``,
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
  const pRef = useRef();
  const [totalPages, setTotalPages] = useState(0);
  const [comments, setComments] = useState([]); // [postid, comments
  const [chars, setChars] = useState(0); // [postid, comments
  let [page, setPage] = useState(1);
  let [comment, setComment] = useState("");
  useEffect(() => {
    fetchPosts(1).then((fetchedPosts) => {
      setPosts(fetchedPosts.items);
      setTotalPages(fetchedPosts.totalPages);
    });
  }, []);

  function fetchMorePosts() {
    if (page >= totalPages) {
      setHasMore(false);
    } else {
      const nextPage = page + 1;
      fetchPosts(nextPage).then((fetchedPosts) => {
        setPage(nextPage);
        setPosts([...posts, ...fetchedPosts.items]);
        fetchPosts.items?.map((post) => {
          setComments([...comments, ...post.expand.comments]);
        });
      });
    }
  }

  function handleComment(e) {
    if (chars >= maxChars) {
      e.target.innerText = e.target.innerText.slice(0, maxChars);
      e.target.classList.add("border-red-500");
    } else {
      e.target.classList.remove("border-red-500");
    }

    setChars(e.target.value.length);
    setComment(
      sanitizeHtml(e.target.value, {
        allowedTags: [],
        allowedAttributes: {},
      })
    );
  }

  function createComment(postId) {
    api
      .collection("comments")
      .create({
        user: api.authStore.model.id,
        text: comment,
        post: postId,
        likes: JSON.stringify([]),
      })
      .then((comment) => {
        setComments([...comments, comment]);
        setComment("");
        document.getElementById("comment" + postId).classList.remove("open");
        api.collection("posts").update(postId, {
          comments: JSON.stringify([
            ...posts.find((p) => p.id === postId).comments,
            comment.id,
          ]),
        });
      });
  }

  return (
    <div className="p-5 mt-2">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<Loading />} // Display loading indicator while fetching more posts
      >
        <div className="flex flex-col gap-5 mb-8" key="postcontainer">
          {posts.length < 1 ? (
            <div className=" gap-5 flex flex-col">
              <Loading />
              <Loading />
              <Loading />
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id}  >
                <Post
                  file={post.file}
                  author={post.expand.author}
                  likes={post.likes}
                  verified={post.expand.author.validVerified}
                  comments={post.expand.comments ? post.expand.comments : []}
                  content={post.content}
                  id={post.id}
                  created={post.created}
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
