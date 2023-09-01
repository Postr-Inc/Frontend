import { useEffect, useState } from "react";
import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Loading from "../components/Loading";
import Post from "../components/Post";
import InfiniteScroll from 'react-infinite-scroll-component';
function fetchPosts(page) {
    return api.collection('posts').getList(page, 10, {
      expand: 'author',
      sort: 'created',
      filter: `author.id != "${api.authStore.model.id}"`
    }).then((posts) => {
       return posts.items
    })
  }
export default function Home() {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
  
    useEffect(() => {
      fetchPosts(1).then((fetchedPosts) => {
        setPosts(fetchedPosts);
      });
    }, []);
    
  
    const fetchMorePosts = () => {
      const nextPage =  Math.floor(posts.length / 10) + 1;
      fetchPosts(nextPage).then((fetchedPosts) => {
        if (fetchedPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
        }
      });
    };
  
    return (
      <div className="p-5 mt-2">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={<Loading />} // Display loading indicator while fetching more posts
        >
          <div className="flex flex-col gap-5" key="postcontainer">
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
  
