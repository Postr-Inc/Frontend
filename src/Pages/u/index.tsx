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
async function handleFeed(
  type: string,
  params: any,
  page: number,
  user = api.authStore.model
) {
  switch (type) {
    case "posts":
      return api.collection("posts").list(page, 10, {
        expand: ["author", "likes", "comments", "repost", "repost.author"],
        cacheKey: `user_${params().id}_posts`,
        filter: `author.username="${params().id}"`,
      });
  }
}
export default function User() {
  const { params, route, navigate, goBack } = useNavigation("/u/:id");
  const [user, setUser] = createSignal(null, { equals: false }) as any;
  const { theme } = useTheme();
  const [view, setView] = createSignal("posts") as any;
  const [feed, setFeed] = createSignal([]) as any;
  let [loading, setLoading] = createSignal(true);
  console.log(route());
  createEffect(() => {
    api
      .collection("users")
      .list(1, 1, {
        cacheKey: `user_${params().id}`,
        filter: StringJoin("username=", `"${params().id}"`),
        expand: ["followers.followers", "following.following", "following", "followers"],
      })
      .then(async (d: any) => {
        if (d.opCode == HttpCodes.OK) {
          setUser(d.items[0]);
          let feed = (await handleFeed(view(), params, 1)) as any;
          console.log(feed);
          setFeed(feed.items);
          console.log(d.items[0] );
          if(api.authStore.model.id === d.items[0].id) {
            let Relevant = d.items[0].expand.followers
            let arr = []
            // create an array of the followers of the followers
            Relevant.forEach((d: any) => {
              if(d.hasOwnProperty("expand") && d.id !== api.authStore.model.id) { 
                d.expand.followers.forEach((f: any) => {
                   arr.push(f)
                })
              } 
            })
            setRelevantPeople(arr)
          }else{
            setRelevantPeople(d.items[0].expand.following)
          } 
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      });
      setRelevantText("You might also like")
  }, [params().id]);

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
  return (
    <Page {...{ params, route, navigate, id: "user" }}>
      <Switch>
        <Match when={loading() }>
          <div class="flex flex-col items-center justify-center h-screen bg-white z-[99999]  ">
            <div class="loading loading-spinner text-blue-500">
            </div>
          </div>
        </Match>
        <Match when={!loading()  }>
          <div class="flex flex-col relative">
            <div
              class="flex flex-row justify-between p-2 h-[8rem]"
              style={{
                "background-size": "cover",
                "background-image":
                  user() && user().banner
                    ? `url(${api.cdn.getUrl("users", user().id, user().banner)})`
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
                    src={api.cdn.getUrl("users", user().id, user().avatar)}
                    class="rounded-full xl:w-24 xl:h-24 w-[5rem] h-[5rem] mx-1 border-2  -mt-4 object-cover"
                  />
                </Match>
                <Match when={!user() || !user().avatar}>
                  <div class="rounded-full w-24 h-24 mx-1 border-4 border-white -mt-4 bg-base-300"></div>
                </Match>
              </Switch>
              <Switch>
                <Match
                  when={user() && user().id != api.authStore.model.id && user().followers.includes(api.authStore.model.id)}
                >
                  <button
                    class={
                      theme === "dark"
                        ? "bg-white text-black p-2 w-24 mr-2 text-sm"
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
                    class={
                      theme === "dark"
                        ? "bg-white text-black p-2 w-24 mr-2 text-sm"
                        : "bg-black text-white p-2 rounded-full w-24 mr-2 text-sm"
                    }
                    onclick={() => follow("follow")}
                  >
                    Follow
                  </button>
                </Match>
              </Switch>
              <Show when={user().id === api.authStore.model.id}>
                <button
                  onClick={() => document.getElementById("editProfileModal").showModal()}
                  class={
                    theme === "dark"
                      ? "bg-white text-black p-2 w-24 mr-2 text-sm"
                      : "bg-black text-white p-2 rounded-full w-24 mr-2 text-sm"
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
            <div class="flex flex-row justify-between p-2 border-b">
              <p
                class="flex flex-col border-b-gray-500"
                onClick={() => setView("posts")}
              >
                Posts
                <Show when={view() === "posts"}>
                  {/**
             * animate slide in from left
             */}
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full transition-all duration-300 ease-in-out"></span>
                </Show>
              </p>
              <p onClick={() => setView("Replies")} class="flex flex-col">
                Replies
                <Show when={view() === "Replies"}>
                  <span class="bg-blue-500 w-full text-white p-[0.15rem] rounded-full  "></span>
                </Show>
              </p>
              <p onClick={() => setView("Likes")} class="flex flex-col">
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

              {feed().length > 0 && (
                <For each={feed()}>
                  {(item: any, index: any) => {
                    let copiedObj = { ...item };
                    console.log(copiedObj);
                    return (
                      <div
                        class={joinClass(
                          index() == feed().length - 1 && feed().length > 1
                            ? "sm:mb-[70px]"
                            : ""
                        )}
                      >
                        {" "}
                        <Post
                          noBottomBorder={index() == feed().length - 1}
                          author={copiedObj.author}
                          comments={copiedObj.comments}
                          content={copiedObj.content}
                          created={copiedObj.created}
                          id={copiedObj.id}
                          likes={copiedObj.likes}
                          navigate={navigate}
                          expand={copiedObj.expand}
                          route={route}
                          files={copiedObj.files}
                          isRepost={copiedObj.isRepost}
                          params={params}
                        />{" "}
                      </div>
                    );
                  }}
                </For>
              )}
            </div>
          </Show>
        </Match>
      </Switch>
      <Portal>
        <EditProfileModal />
      </Portal>
    </Page>
  );
}
