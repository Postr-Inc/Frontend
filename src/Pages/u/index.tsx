import { api } from "@/src";
import ArrowLeft from "@/src/components/Icons/ArrowLeft";
import Calendar from "@/src/components/Icons/Calendar";
import Ellipse from "@/src/components/Icons/Ellipse";
import Link from "@/src/components/Icons/Link";
import Search from "@/src/components/Icons/search";
import Verified from "@/src/components/Icons/Verified";
import { joinClass } from "@/src/Utils/Joinclass";
import Post from "@/src/components/PostRelated/Post";
import useNavigation from "@/src/Utils/Hooks/useNavigation";
import useTheme from "@/src/Utils/Hooks/useTheme";
import { HttpCodes } from "@/src/Utils/SDK/opCodes";
import Page from "@/src/Utils/Shared/Page";
import StringJoin from "@/src/Utils/StringJoin";
import { Item } from "@kobalte/core/menubar";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import EditProfileModal from "@/src/components/Modals/EditProfileModal";
import { Portal } from "solid-js/web";
import useFeed from "@/src/Utils/Hooks/useFeed";
import { useParams } from "@solidjs/router";
import LoadingIndicator from "@/src/components/Icons/loading";
async function handleFeed(
  type: string,
  params: any,
  page: number,
  user = api.authStore.model,
  otherOptions: {
    filter?:  string, 
    sort?: string,
  }
) { 
  return api.collection(type).list(page, 10, {
    expand: ["author", "likes", "comments", "repost", "repost.author", "author.followers"],
    sort: otherOptions.sort || "-created",
    cacheKey: `/u/${params().id}_${type}_${page}/${JSON.stringify(otherOptions)}`,
    filter: otherOptions.filter || `author.username="${params().id}"`,
  });
}
export default function User() {
  const { params, route, navigate, goBack } = useNavigation("/u/:id");
  const u = useParams();
  const [user, setUser] = createSignal(null, { equals: false }) as any;
  const { theme } = useTheme();
  const [view, setView] = createSignal("posts") as any;
  let [loading, setLoading] = createSignal(true); 
  let [posts, setPosts] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(0);
  let [notFound, setNotFound] = createSignal(false);
  let [feedLoading, setFeedLoading] = createSignal(false);
  let [totalPages, setTotalPages] = createSignal(0); 
  createEffect(() => {
    api.checkAuth()
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    // more on scroll
    window.onscroll = function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setCurrentPage(currentPage() + 1);
        console.log("scrolling")
      }
    }

    
    

    api.collection("users")
      .list(1, 1, {
        filter: StringJoin("username", "=", `"${u.id}"`),
        expand: ["followers", "following"],
        cacheKey: `/u/user_${u.id}`
      })
      .then((data: any) => {
        if (!data.items[0]) {
          setNotFound(true);
          console.log("not found")
          setLoading(false);
          return;
        } 
        if (data.opCode === HttpCodes.OK) {
          setUser(data.items[0]);
          handleFeed("posts", params, currentPage(), data.items[0], {
            filter: `author.username="${params().id}"`, 
            sort: '-pinned',
          }).then((data: any) => {
            if (data.opCode === HttpCodes.OK) { 
              setPosts(data.items); 
              setTotalPages(data.totalPages); 
              setLoading(false);
            }
          });
        }
      });



    //@ts-ignore
    setRelevantText("You might also like") 
    setCurrentPage(1)
  }, [params().id]);

  createEffect(() => {
    console.log("current page", currentPage())
    if (currentPage() > 1) { 
      console.log("fetching more")
      handleFeed(view(), params, currentPage(), user(), {
        filter: `author.username="${params().id}"`, 
        sort: '-pinned',
      }).then((data: any) => {
        if (data.opCode === HttpCodes.OK) {
          setPosts([...posts(), ...data.items]);
          setFeedLoading(false);
        }
      });
    }
  }, [currentPage()]);



  function swapFeed(type: string) {
    setFeedLoading(true)
    switch (type) {
      case "posts":
        handleFeed("posts", params, currentPage(), user(), {
          filter: `author.username="${params().id}"`, 
        }).then((data: any) => {
          if (data.opCode === HttpCodes.OK) {
            let pinned = data.items.filter((p: any) => p.pinned); 
            let notPinned = data.items.filter((p: any) => !p.pinned);
            data.items = [...pinned, ...notPinned]; 
            setPosts(data.items); 
          } 
        });
        break;
      case "Replies":
        handleFeed("comments", params, currentPage(), user(), {
          filter: `author.username="${params().id}"`, 
        }).then((data: any) => {
          console.log(data)
          if (data.opCode === HttpCodes.OK) {
            setPosts(data.items); 
          }
        });
        break;
      case "Likes":
        console.log(`likes.id ="${api.authStore.model.id} && author.username != "${params().id}"`)
        handleFeed("posts", params, currentPage(), user(), {
          filter: `likes.id ="${user().id}"`, 
        }).then((data: any) => {
          if (data.opCode === HttpCodes.OK) {
            console.log(data)
            setPosts(data.items); 
          }
        });
        break;
      case "snippets":
         
        break;
    }
    setTimeout(() => {
      setFeedLoading(false)
    }, 1000)
  }

  function follow(type: string) {
    console.log(type)
    let followers = user().followers as any[]
    let isFollowing = api.authStore.model.following
    switch (type) {
      case "unfollow":
        followers = followers.filter((u) => u != api.authStore.model.id)
        console.log(followers)
        user().followers = followers
        setUser({ ...user(), followers })
        setLoading(false)
        isFollowing = isFollowing.filter((d) => d != user().id)
        break;
      case "follow":
        followers.push(api.authStore.model.id)
        user().followers = followers
        setUser({ ...user(), followers })
        setLoading(false)
        !isFollowing.includes(user().id) && isFollowing.push(user().id)
        break;
    }
    console.log(isFollowing)
    api.collection("users").update(user().id, {
      followers,
    }, {
      expand: ["followers", "following"],
      cacheKey: `/u/user_${user().username}`
    })
    api.collection("users").update(api.authStore.model.id, { following: isFollowing }, {
      expand: ["followers", "following"],
      cacheKey: `/u/${api.authStore.model.username}`
    })
  }
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]; 
  createEffect(() => {
    if(user() && !api.subscriptions.has("users" + user().id)) { 
      api.collection("users").subscribe(user().id, {
        cb: (data: any) => { 
          setUser(data)
          api.updateCache("users", user().id, data)
        },
      })
    }
  }, [user()]);
  return (
    <Page {...{ params, route, navigate, id: "user" }}>
      <Switch>
        <Match when={notFound()}>
          <div class="flex flex-col items-center justify-center h-screen bg-white z-[99999]  ">
            <div class="text-2xl">User not found</div>
          </div>
        </Match>
        <Match when={loading()}>
          <div class={joinClass("flex flex-col items-center justify-center h-screen  z-[99999]  ", theme() === "dark" ? "bg-white" : "bg-black")}>
            <div class="loading loading-spinner text-blue-500">
            </div>
          </div>
        </Match>
        <Match when={!loading()}>
          <div class="flex flex-col relative">
            <div
              class="flex flex-row justify-between p-2 h-[10rem]"
              style={{
                "background-size": "cover",
                "background-image":
                  user() && user().banner
                    ? `url(${ user().banner.includes("blob") ? user().banner : api.cdn.getUrl("users", user().id, user().banner)})`
                    : "linear-gradient(90deg, #ff5858 0%, #f09819 49%, #ff5858 100%)",
              }}
            >
              <div>
                <ArrowLeft
                  class="p-2 h-[2.2rem] bg-base-200 cursor-pointer rounded-full bg-opacity-50"
                  onClick={() => goBack()}
                />
              </div>

              <div class="flex flex-row gap-2"> 
                <Search class="p-2 h-[2.2rem] bg-base-200 rounded-full bg-opacity-50 xl:hidden" />
                   
                <Ellipse class="p-2 h-[2.2rem] bg-base-200 rounded-full bg-opacity-50 xl:hidden" />
              </div>
            </div>

            <div class="flex justify-between items-center ">
              <Switch>
                <Match when={user() && user().avatar}>
                  <img
                    src={user().avatar.includes("blob") ? user().avatar : api.cdn.getUrl("users", user().id, user().avatar)}
                    class="rounded-full xl:w-24 xl:h-24 w-[5rem] h-[5rem] mx-1 border-2  -mt-12 object-cover"
                  />
                </Match>
                <Match when={!user() || !user().avatar}>
                  <div class="rounded-full w-24 h-24 mx-1 border-4 border-white -mt-12 bg-base-300 flex items-center justify-center">
                    <p class="text-2xl text-black">{user() && user().username[0]}</p>
                  </div>
                </Match>
              </Switch>
              <Switch>
                <Match
                  when={user() && user().id != api.authStore.model.id && user().followers.includes(api.authStore.model.id)}
                >
                  <button
                  style={{
                    "border-radius":"9999px"
                  }}
                    class={
                      theme() === "dark"
                        ? "bg-white text-black p-2 w-24 mr-2 mt-2 text-sm"
                        : "bg-black text-white p-2 rounded-full w-24 mr-2 text-sm"
                    }
                    onclick={() => follow("unfollow")}
                  >
                    Unfollow
                  </button>
                </Match>
                <Match
                  when={
                    !user() && user().id != api.authStore.model.id || user().id != api.authStore.model.id && !user().followers.includes(api.authStore.model.id)
                  }
                >
                  <button
                  
                  style={{
                    "border-radius":"9999px"
                  }}
                    class={
                      theme() === "dark"
                        ? "bg-white text-black p-2 mt-2 w-24 mr-2 text-sm"
                        : "bg-black text-white p-2 rounded-full  mt-2 w-24 mr-2 text-sm"
                    }
                    onclick={() => follow("follow")}
                  >
                    Follow
                  </button>
                </Match>
              </Switch>
              <Show when={user() && user().id === api.authStore.model.id}>
                <button
                  onClick={() => document.getElementById("editProfileModal").showModal()}
                  class={
                    joinClass(theme() === "dark"
                      ? "bg-white text-black p-2 w-24 mr-2 text-sm"
                      : "bg-black text-white p-2 rounded-full w-24 mr-2 text-sm", "sm:mt-2 md:mt-3")
                  }
                >
                  Edit Profile
                </button>
              </Show>
            </div>
          </div>
          <div class="flex flex-col p-2">
            <h1 class="text-2xl font-bold flex hero gap-2">
              {user() ? user().username : "Loading..."}
              <Show when={user() && user().verified}>
                <Verified class="h-7 w-7 text-white stroke-white fill-blue-500" />
              </Show>
            </h1>
            <span class="text-sm mt-1 opacity-60">
              @{user() && user().username}
              {user() && user().id.slice(0, 5)}
            </span>
            <p class=" mt-2">{user() && user().bio}</p>
            <div class="flex flex-row gap-5 mt-2">
              {user() && user().social && (
                <p class="flex flex-row gap-1 items-center text-sm  ">
                  <Link class="h-4 w-4" />
                  <a href={user() && user().social} class="text-blue-500">
                    {user() && user().social.split("/")[2].split(".")[0]}
                  </a>
                </p>
              )}
              <p class="flex flex-row gap-2 items-cente text-sm opacity-50">
                {" "}
                <Calendar class="h-5 w-5" /> Joined{" "}
                {user() && months[new Date(user().created).getMonth()]}{" "}
                {user() && new Date(user().created).getFullYear()}
              </p>
            </div>

            <div class="flex flex-row gap-2 mt-2">
              {user() && user().following && (
                <p>
                  <span class="font-bold">{user().following.length} </span>{" "}
                  <span class="text-gray-500"> Following</span>
                </p>
              )}
              {user() && user().followers && (
                <p>
                  <span class="font-bold">{user().followers.length} </span>
                  <span class="text-gray-500"> Followers</span>
                </p>
              )}
            </div>
          </div>
          <Show when={user()}>
            <Show when={!user()}>
              <div class="w-screen justify-center flex mx-auto"></div>
            </Show>
            <div class="flex flex-row justify-between p-2 border-b-base-200">
              <p
                class="flex flex-col cursor-pointer border-b-gray-500"
                onClick={() => {
                  setView("posts");
                  swapFeed("posts");
                }}
              >
                Posts
                <Show when={view() === "posts"}>
                  {/**
             * animate slide in from left
             */}
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full transition-all duration-300 ease-in-out"></span>
                </Show>
              </p>
              <p
                onClick={() => {
                  setView("Replies")
                  swapFeed("Replies")
                  console.log("replies")
                }} class="flex flex-col  cursor-pointer">
                Replies
                <Show when={view() === "Replies"}>
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full  "></span>
                </Show>
              </p>
              <p onClick={() => {
                setView("Likes")
                swapFeed("Likes")
              }} class="flex flex-col  cursor-pointer">
                Likes
                <Show when={view() === "Likes"}>
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full  "></span>
                </Show>
              </p>
              <p onClick={() => setView("snippets")} class="flex flex-col">
                Snippets
                <Show when={view() === "snippets"}>
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full  "></span>
                </Show>
              </p>
            </div>
            <div class="flex flex-col">

              <Switch>
                <Match when={feedLoading()}>
                  <For each={Array.from({ length: 10 })}>
                    {() => <LoadingIndicator />}
                  </For>
                </Match>
                <Match when={!feedLoading()}>
                  {posts().length > 0 && (
                    <For each={posts()}>
                      {(item: any, index: any) => {
                        let copiedObj = { ...item };
                        return (
                          <div
                            class={joinClass(
                              index() == posts().length - 1 && posts().length > 1
                                ? "sm:mb-[70px]"
                                : ""
                            )}
                          >
                            {" "}
                            <Post
                              noBottomBorder={index() == posts().length - 1}
                              author={copiedObj.author}
                              comments={copiedObj.comments}
                              content={copiedObj.content}
                              created={copiedObj.created}
                              id={copiedObj.id}
                              likes={copiedObj.likes}
                              navigate={navigate}
                              pinned={copiedObj.pinned}
                              expand={copiedObj.expand}
                              route={route}
                              files={copiedObj.files}
                              isPoll={copiedObj.isPoll}
                              pollOptions={copiedObj.pollOptions}
                              isRepost={copiedObj.isRepost}
                              pollVotes={copiedObj.pollVotes}
                              pollEnds={copiedObj.pollEnds}
                              whoVoted={copiedObj.whoVoted || []}
                              params={params}
                            />{" "}
                          </div>
                        );
                      }}
                    </For>
                  )}
                </Match>
              </Switch>
            </div>
          </Show>
        </Match>
      </Switch>
      <Portal>
        <EditProfileModal  updateUser={(data: any) => { setUser({ ...user(), ...data }) }} />
      </Portal>
    </Page>
  );
}
