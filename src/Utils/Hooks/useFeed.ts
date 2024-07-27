import { api } from "@/src";
import { createEffect, createSignal } from "solid-js";
import { HttpCodes } from "../SDK/opCodes";

async function list(currentPage: any, feed: any) {
  return new Promise((resolve, reject) => {
    api
      .collection("posts")
      .list(currentPage(), 10, {
        order: "dec",
        filter:
          feed() === "recommended"
            ? `author.id != "${api.authStore.model.id}"`
            : "",
        recommended: true,
        expand: [
          "comments.likes",
          "comments",
          "author",
          "author.following",
          "author.followers",
          "author.followers.following",
          "author.TypeOfContentPosted",
          "likes",
          "repost.likes",
          "repost.author",
          "repost"
        ],
      })
      .then((data: any) => {
        if (data.opCode !== HttpCodes.OK) {
          console.log(data);
          reject(data);
        }
        resolve(data);
      });
  });
}
/**
 * @description Rule of thumb move line heavy code and make it its own hook ( Best practice ) 
 * @param _for 
 */
export default function useFeed(_for: string) {
  const [feed, setFeed] = createSignal(_for === "home" ? "recommended" : "all");
  const [currentPage, setCurrentPage] = createSignal(1);
  const [posts, setPosts] = createSignal<any[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [hasMore, setHasMore] = createSignal(true);
  const [refresh, setRefresh] = createSignal(false);
  createEffect(() => {
    console.log(feed())
    // HANDLE SCROLLING
    async function handleScroll() {
      // Check if the user has scrolled to the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return;
      }
    
      // Prevent fetching if already loading or refreshing
      if (loading() || refresh()) {
        return;
      }
    
      // Check if there are more pages to fetch
      if (hasMore()) {
        setLoading(true); // Set loading to true before fetching
        try {
          const currentPageValue = currentPage() + 1;
          setCurrentPage(currentPageValue);
          console.log("fetching page " + currentPageValue);
          const data = await list(currentPageValue, feed) as any;
          setPosts((prevPosts) => [...prevPosts, ...data?.items]);
    
          // Update hasMore if there are no more pages to load
          if (data?.totalPages <= currentPageValue) {
            setHasMore(false);
          }
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false); // Ensure loading is set to false after fetching
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    // handle refresh mobile swipe
    function handleTouchStart(e: TouchEvent) {
      if (e.touches[0].clientY < 50) {
        setRefresh(true);
      }
    }
    function handleTouchEnd(e: TouchEvent) {
      setRefresh(false);
    }
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    
  });
  list(currentPage, feed)
    .then((data: any) => { 
      setPosts([...posts(), ...data?.items]);
      setLoading(false);
      let relevantPeople = []
      for (let i = 0; i < data?.items.length; i++) {  
        if(data?.items[i].expand.author.followers.length < 1) continue;
        let followers = data?.items[i].expand.author.expand.followers
        if(followers.length < 1) continue;
        for (let j = 0; j < followers.length; j++) {
          if (followers[j].id !== api.authStore.model.id   && relevantPeople.length < 5 && !followers[j].followers.includes(api.authStore.model.id) ) {
            relevantPeople.push(followers[j]);
          } 
        }
      } 
      //@ts-ignore
      window.setRelevantPeople && setRelevantPeople(relevantPeople);
      if (data?.totalPages <= currentPage()) {
        setHasMore(false);
      }
    })
    .catch((e) => {
      console.log(e);
      setError(e);
    });
  return { feed, currentPage, posts, loading, error, hasMore, setFeed };
}
