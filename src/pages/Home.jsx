import { useEffect, useState } from "react";
import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../components/Modal";
function fetchPosts(page) {
  return api
    .collection("posts")
    .getList(page, 10, {
      expand: "author",
      sort: "-created",
      filter: `author.id != "${api.authStore.model.id}" && author.followers ?~ "${api.authStore.model.id}"`,
    })
    .then((posts) => {
      return posts.items;
    });
}
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(1).then((fetchedPosts) => {
      setPosts(fetchedPosts);
    });
  }, []);

  function fetchMorePosts() {
    fetchPosts(posts.length / 10 + 1).then((fetchedPosts) => {
      if (fetchedPosts.length < 10) {
        setHasMore(false);
      }
      setPosts(posts.concat(fetchedPosts));
    });
  }

  return (
    <div className="p-5 mt-2">
      <InfiniteScroll
        dataLength={posts.length || 0}
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
              <div key={post.id}>
                <Post
                  file={post.file}
                  author={post.expand.author}
                  likes={post.likes}
                  verified={post.expand.author.validVerified}
                  comments={post.comments}
                  content={post.content}
                  id={post.id}
                  created={post.created}
                />
                <Modal id={"comment" + post.id} height="h-screen w-screen">
                  <button className="flex justify-center mx-auto focus:outline-none">
                    <div className="divider  text-slate-400  w-12   mt-0"></div>
                  </button>
                  <div className="p-5">
                    <span className="justify-center mx-auto flex font-bold text-black">
                      Comments
                    </span>

                    <div className={`flex flex-row   gap-2 left-2  p-2  absolute bottom-${
                      window.innerWidth > 640 ? "16" :  "5"
                    }`}>
                      <img
                        src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <input
                        placeholder="Add a comment..."
                        className="w-72 rounded-full input input-sm   border-slate-200  px-2 py-1 focus:outline-none"
                      />
                      <button className="btn btn-sm btn-ghost text-sm text-sky-500 hover:bg-transparent focus:bg-transparent">
                        Post
                      </button>
                    </div>
                  </div>
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
