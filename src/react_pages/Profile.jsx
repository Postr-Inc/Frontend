import { api } from ".";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import * as sanitizeHtml from "sanitize-html";

api.autoCancellation(false);
import Bottomnav from "../components/Bottomnav";
import Post from "../components/Post";
import Comment from "../components/Comments";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";

export default function Profile(props) {
  let [profile, setProfile] = useState({});
  let [array, setarray] = useState([]);
  let [followers, setFollowers] = useState(
    profile.followers ? profile.followers : []
  );
  let [hasRequested, setHasRequested] = useState(false);
  let [pageSelected, setPageSelected] = useState("posts");
  let [loading, setLoading] = useState(true);
  let [hasMore, setHasMore] = useState(true);
  let [edited, setedited] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  let [saved, setSaved] = useState(false);
  let [error, seterror] = useState("");
  let biomax = 190;
  function follow() {
    if (followers.includes(api.authStore.model.id)) {
      let index = followers.indexOf(api.authStore.model.id);
      followers.splice(index, 1);
      setFollowers([...followers]);
      api.collection("users").update(profile.id, {
        followers: followers,
      });
    } else {
      setFollowers([...followers, api.authStore.model.id]);
      api.collection("users").update(profile.id, {
        followers: [...followers, api.authStore.model.id],
      });
      api.collection("notifications").create({
        recipient: profile.id,
        author: api.authStore.model.id,
        type: "follow",
        title: `${api.authStore.model.username} followed you`,
        image: `${api.baseUrl}/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`,
        url: `/u/${api.authStore.model.username}`,
        notification_title: `${api.authStore.model.username} followed you`,
        notification_body: `Open Postr to see more`,
      });
    }
  }
  function fetchInfo(type, page) {
    type === "likes" ? (type = "posts") : (type = type);
    type === "collections" ? (type = "posts") : (type = type);

    return api
      .collection(type)
      .getList(page, 10, {
        filter:
          pageSelected === "comments"
            ? `user.username="${props.user}"`
            : pageSelected === "posts"
            ? `author.username="${props.user}"`
            : pageSelected === "collections"
            ? `author.username="${props.user}" && file != ""`
            : `author.username != "${props.user}" && likes ~ "${profile.id}"`,
        sort: `${
          pageSelected === "comments"
            ? "-created"
            : pageSelected === "posts"
            ? "-pinned,-created"
            : "-created"
        }`,
        expand: "author,post,user,post.author",
      })
      .then((res) => {
        return res;
      });
  }
  useEffect(() => {
    let theme = localStorage.getItem("theme");

    if (!theme) {
      localStorage.setItem("theme", "black");
      document.querySelector("html").setAttribute("data-theme", "black");
    } else {
      document.querySelector("html").setAttribute("data-theme", theme);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (e.matches) {
            document.querySelector("html").setAttribute("data-theme", "black");
            localStorage.setItem("theme", "black");
          } else {
            document.querySelector("html").setAttribute("data-theme", "white");
            localStorage.setItem("theme", "white");
          }
        });
    }
  }, []);

  useEffect(() => {
    setarray([]);
    setTotalPages(null);

    api
      .collection("users")
      .getFirstListItem(`username="${props.user}"`, {
        expand: "followers",
      })
      .then((res) => {
        console.log(res);
        if (res.deactivated) {
          let profile = {
            username: "User not found",
            bio: "",
            avatar: "",
            followers: [],
            Isprivate: true,
            $dead: true,
          };
          setProfile(profile);
          return;
        }
        setProfile(res);
        setFollowers(res.followers ? res.followers : []);
      });

    if (
      (profile.followers &&
        profile.followers.includes(api.authStore.model.id) &&
        profile.Isprivate) ||
      (!profile.Isprivate && !profile.deactivated)
    ) {
      fetchInfo("posts", 1).then(function (fetchedPosts) {
        if (fetchedPosts.items.length < 10) {
          setHasMore(false);
        } else if (fetchedPosts.items > 1) {
          setLoading(true);
        }
        setarray(fetchedPosts.items);
        setTotalPages(fetchedPosts.totalPages);
      });
    }
  }, [props.user]);

  let [page, setPage] = useState(1);
  useEffect(() => {
    setTotalPages([]);
    setarray([]);
    setPage(1);
    if (pageSelected) {
      fetchInfo(pageSelected, 1).then(function (fetchedPosts) {
        if (fetchedPosts.items.length < 10) {
          setHasMore(false);
        } else if (fetchedPosts.items > 1) {
          setLoading(true);
        } else if (fetchedPosts.items.length < 1) {
          setLoading(false);
        }
        setarray(fetchedPosts.items);
        setTotalPages(fetchedPosts.totalPages);
      });
    }
  }, [pageSelected]);

  function fetchMore() {
    fetchInfo(pageSelected, page + 1).then(function (fetchedPosts) {
      setPage(page + 1);
      setarray([...array, ...fetchedPosts.items]);
      setTotalPages(fetchedPosts.totalPages);
    });
  }

  function edit() {
    if (edited !== "{}") {
      let form = new FormData();
      form.append(
        "username",
        edited.username ? edited.username : profile.username
      );
      form.append("bio", edited.bio !== undefined ? edited.bio : profile.bio);
      form.append(
        "Isprivate",
        edited.Isprivate ? edited.Isprivate : profile.Isprivate
      );
      form.append("avatar", edited.avatar ? edited.avatar : profile.avatar);
      api
        .collection("users")
        .update(profile.id, form)
        .then((res) => {
          setProfile(res);
          if (edited.username) {
            window.location.href = `/u/${edited.username}`;
          }
          setedited({});
        })
        .catch((e) => {
          seterror(
            e.data.data.username
              ? e.data.data.username.message
              : e.data.data.bio
              ? e.data.data.bio.message
              : e.data.data.avatar
              ? e.data.data.avatar.message
              : e.data.data.Isprivate
              ? e.data.data.Isprivate.message
              : ""
          );
          setedited({});
        });
      document.getElementById("editprofile").close();
    }
  }

  return (
    <>
      <div
        className="  flex flex-row justify-between
       p-5
      "
        style={{ fontFamily: "Inter !important" }}
      >
        <span
          className="flex flex-row items-center gap-2 cursor-pointer
           
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            onClick={() => {
              window.history.back();
            }}
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="text-xl " style={{ fontFamily: "pacifico" }}>
          {profile.username ? "@" + profile.username : "Loading..."}
        </span>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            if (
              window.location.pathname ===
              "/u/" + api.authStore.model.username
            ) {
              window.location.href = "/settings";
            } else {
              window.options.showModal();
            }
          }}
        >
          •••
        </div>
      </div>

      <div className="flex flex-col   p-5 gap-2">
        <div className="flex flex-row  justify-between gap-5">
          <div className="flex flex-col gap-2s">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold pb-2">
                {profile.username ? profile.username : "Loading..."}
              </h1>
            </div>
            <span
              className="text-gray-500 
      w-[80vw] max-w-[80vw]  
      "
            >
              {profile.bio ? profile.bio : ""}
            </span>
            <div className="flex flex-col mt-2">
              <span className="text-gray-500 text-sm  flex flex-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2 mt-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                Joined{" "}
                {profile.created
                  ? new Date(profile.created).toLocaleDateString()
                  : "Loading..."}
              </span>

              <span className="text-gray-500 text-sm mt-2">
                Followed by {followers ? followers.length : 0}{" "}
                {followers.length === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
          <div className="indicator  absolute  end-5">
            {profile.avatar ? (
              <img
                src={`${api.baseUrl}/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full  avatar"
              />
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-16">
                  <span className="text-lg capitalize">
                    {profile.username}
                  </span>
                </div>
              </div>
            )}

            {profile.validVerified ? (
              <span className="">
                <img
                  src="/icons/verified.png"
                  className="w-5 h-5 absolute border-white border-1 bg-base-100  bottom-0  left-0
          rounded-full
           
          "
                />
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div>
          {profile.$dead === undefined ? (
            <div className="flex flex-row gap-5 w-[42vw] mt-2">
              {props.user === api.authStore.model.username ? (
                <>
                  <button
                    className="bg-[#121212] w-full btn btn-sm  h-text-sm text-white rounded-md  capitalize"
                    onClick={() => {
                      document.getElementById("editprofile").showModal();
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className={`btn btn-sm btn-ghost w-full capitalize border-slate-200
                    ${
                      document
                        .querySelector("html")
                        .getAttribute("data-theme") === "black"
                        ? "text-white"
                        : "text-[#121212]"
                    }
                    rounded-md `}
                    onClick={() => {
                      navigator.share({
                        title: `Follow ${profile.username} on Postr!`,
                        text: profile.bio,
                        url: window.location.href,
                      });
                    }}
                  >
                    Share
                  </button>
                </>
              ) : (
                <>
                  {profile.Isprivate &&
                  !followers.includes(api.authStore.model.id) ? (
                    <>
                      <button
                        className={`${
                          hasRequested
                            ? `
                             ${
                               document
                                 .querySelector("html")
                                 .getAttribute("data-theme") === "black"
                                 ? ` capitalize text-white btn-ghost border-slate-200 `
                                 : ` text-[#12121212] btn-ghost border-slate-200 `
                             }
                            `
                            : document
                                .querySelector("html")
                                .getAttribute("data-theme") === "black"
                            ? `capitalize bg-[#121212] text-white`
                            : `bg-white text-[#121212]`
                        } w-full btn btn-sm   rounded-md  `}
                        onClick={() => {
                          alert("Request sent!");
                        }}
                      >
                        {hasRequested ? "Requested" : "Request Access"}
                      </button>
                      <button
                        className={`
                         btn btn-sm btn-ghost w-full  ${
                           document
                             .querySelector("html")
                             .getAttribute("data-theme") === "black"
                             ? "capitalize text-white rounded border border-white"
                             : "text-[#121212]"
                         }
                        
                        `}
                        onClick={() => {
                          window.newpost.showModal();
                          document.getElementById(
                            "post"
                          ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}">u/${profile.username}<a/>`;
                        }}
                      >
                        Mention
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`${
                          followers &&
                          followers.includes(api.authStore.model.id)
                            ? document
                                .querySelector("html")
                                .getAttribute("data-theme") === "black"
                              ? " text-white rounded border "
                              : "text-white bg-black hover:bg-black focus:bg-black"
                            : ""
                        } w-full btn btn-sm   rounded-md  capitalize`}
                        onClick={debounce(follow, 1000)}
                      >
                        {followers && followers.includes(api.authStore.model.id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                      <button
                        className={`
                          btn btn-sm btn-ghost w-full  ${
                            document
                              .querySelector("html")
                              .getAttribute("data-theme") === "black"
                              ? "capitalize text-white rounded border border-white"
                              : "text-[#121212] border-slate-200"
                          }

                        `}
                        onClick={() => {
                          window.newpost.showModal();
                          document.getElementById(
                            "post"
                          ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}">u/${profile.username}<a/>`;
                        }}
                      >
                        Mention
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div
          className=" font-medium p-2 flex flex-row justify-between mt-6 "
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
            Postrs
          </a>
          <a
            onClick={() => {
              if (pageSelected !== "comments") {
                setPageSelected("comments");
              }
            }}
            className={`
         cursor-pointer
         text-lg  ${
           pageSelected === "comments"
             ? "underline underline-offset-[10px]"
             : ""
         }`}
          >
            Replies
          </a>
          <a
            onClick={() => {
              if (pageSelected !== "collections") {
                setPageSelected("collections");
              }
            }}
            className={`
             cursor-pointer
          text-lg ${
            pageSelected === "collections"
              ? "underline underline-offset-[10px]"
              : ""
          } `}
          >
            Collections
          </a>
          <a
            onClick={() => {
              if (pageSelected !== "likes") {
                setPageSelected("likes");
              }
            }}
            className={`
             cursor-pointer
          text-lg ${
            pageSelected === "likes" ? "underline underline-offset-[10px]" : ""
          } `}
          >
            Likes
          </a>
        </div>

        <div className="flex flex-col gap-5 mt-12">
          {profile.followers &&
          profile.Isprivate &&
          !profile.followers.includes(api.authStore.model.id) &&
          profile.id !== api.authStore.model.id ? (
            <div className="flex flex-col justify-center  items-center mx-auto mt-8 gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>

              <h1 className="text-xl mt-2">
                {profile.$dead
                  ? "This account is deactivated"
                  : "This account is private"}
              </h1>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={array.length}
              next={fetchMore}
              hasMore={hasMore}
            >
              {pageSelected === "posts" &&
              profile.$dead === undefined &&
              array.length > 0 ? (
                array.map((p) => {
                  if (p.expand && p.expand.author) {
                    return (
                      <div className="mb-16" key={p.id}>
                        <Post
                          id={p.id}
                          file={p.file}
                          pinned={p.pinned}
                          author={p.expand.author}
                          content={p.content}
                          tags={p.tags}
                          likes={p.likes}
                          comments={p.comments}
                          created={p.created}
                          image={p.image}
                          post={p}
                          color={p.textColor}
                          ondelete={() => {
                            let index = array.indexOf(p);
                            array.splice(index, 1);
                            setarray([...array]);
                            document.getElementById(p.id).remove();
                            api.collection("posts").delete(p.id);
                          }}
                        />
                      </div>
                    );
                  }
                })
              ) : pageSelected === "comments" &&
                profile.$dead === undefined &&
                array.length > 0 ? (
                array.map((c) => {
                  if (c.expand && c.expand.user && c.expand.post) {
                    let id = c.id;
                    return (
                      <div
                        className="mb-16"
                        key={id}
                        onClick={() => {
                          window.location.href = `/p/${c.expand.post.id}`;
                          window.onpopstate = function () {
                            document.getElementById(id).scrollIntoView();
                          };
                        }}
                      >
                        <Comment
                          id={c.id}
                          text={c.text}
                          likes={c.likes}
                          created={c.created}
                          user={c.expand.user}
                          post={c.expand.post}
                        />
                      </div>
                    );
                  }
                })
              ) : pageSelected === "likes" &&
                profile.$dead === undefined &&
                array.length > 0 ? (
                array.map((l) => {
                  let id = l.id;
                  if (l.expand && l.expand.author) {
                    return (
                      <div
                        className="mb-16"
                        key={id}
                        onClick={() => {
                          window.location.href = `/p/${l.expand.post.id}`;
                          window.onpopstate = function () {
                            document.getElementById(id).scrollIntoView();
                          };
                        }}
                      >
                        <Post
                          key={id}
                          id={l.id}
                          file={l.file}
                          pinned={l.pinned}
                          author={l.expand.author}
                          content={l.content}
                          likes={l.likes}
                          color={post.textColor}
                          tags={l.tags}
                          created={l.created}
                          comments={l.comments}
                          ondelete={() => {
                            let index = array.indexOf(l);
                            array.splice(index, 1);
                            setarray([...array]);
                            document.getElementById(id).remove();
                            api.collection("posts").delete(l.id);
                          }}
                        />
                      </div>
                    );
                  }
                })
              ) : pageSelected === "collections" &&
                profile.$dead === undefined &&
                array.length > 0 ? (
                array.map((c) => {
                  let id = c.id;
                  if (c.expand && c.expand.author) {
                    return (
                      <div
                        className="mb-16"
                        key={id}
                        onClick={() => {
                          window.location.href = `/p/${c.expand.post.id}`;
                          window.onpopstate = function () {
                            document.getElementById(id).scrollIntoView();
                          };
                        }}
                      >
                        <Post
                          key={id}
                          id={c.id}
                          file={c.file}
                          pinned={c.pinned}
                          author={c.expand.author}
                          content={c.content}
                          created={c.created}
                          tags={c.tags}
                          likes={c.likes}
                          color={c.textColor}
                          comments={c.comments}
                        />
                      </div>
                    );
                  }
                })
              ) : (
                <div className="flex    mt-0">
                  <h1 className="font-bold  ">
                    {profile.$dead ? (
                      "This account is private"
                    ) : pageSelected === "collections" && array.length < 1 ? (
                      <>
                        <h1 className="text-2xl  w-64">
                          Likes ❤️ Cameras .... action! 🎬
                        </h1>
                        <p className="mt-4 text-slate-300 font-normal">
                          {props.user === api.authStore.model.username
                            ? ` Your photo and video posts will show up here.`
                            : `  When ${props.user} posts a image or video post, it'll show up here.`}
                        </p>
                      </>
                    ) : pageSelected === "likes" &&
                      array.length < 1 &&
                      !loading ? (
                      <>
                        <h1 className="text-2xl w-64">
                          {props.user === api.authStore.model.username
                            ? ` Go like some posts!`
                            : `  ${props.user}f hasn't liked any posts yet.`}
                        </h1>
                        <p className="mt-4 text-slate-800 font-normal">
                          {props.user === api.authStore.model.username
                            ? `  When you like a post, it'll show up here.`
                            : `  When ${props.user} likes a post, it'll show up here.`}
                        </p>
                      </>
                    ) : pageSelected === "comments" && array.length < 1 ? (
                      <>
                        <h1 className="text-2xl w-96">
                          {props.user === api.authStore.model.username
                            ? ` Go comment on some posts!`
                            : `  ${props.user} hasn't commented on any posts yet.`}
                        </h1>
                        <p className="mt-4 text-slate-300 font-normal">
                          {props.user === api.authStore.model.username
                            ? `  When you comment on a post, it'll show up here.`
                            : `  When ${props.user} comments on a post, it'll show up here.`}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </h1>
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>

      <dialog
        id="editprofile"
        className="modal text-start  fixed top-0 left-0  focus:outline-none"
        style={{
          backgroundColor: "white",

          fontSize: "16px",
        }}
      >
        <div className=" max-w-screen max-w-screen h-screen bg-base-100  w-screen  overflow-hidden  shadow-none   ">
          <div className="flex p-5 flex-row justify-between">
            <div className="flex cursor-pointer">
              <span className="  " style={{ fontSize: "1rem" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-6 fill-white
                  ${
                    document
                      .querySelector("html")
                      .getAttribute("data-theme") === "black"
                      ? "text-white"
                      : "text-black"
                  }
                  h-6`}
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
            </div>

            <p className="text-xl text-white font-bold">Edit Profile</p>
            <button
              className={`
              ${
                Object.keys(edited).length > 0
                  ? "text-blue-500"
                  : "opacity-50 cursor-not-allowed"
              }
              `}
              style={{ fontSize: ".8rem" }}
              {...(Object.keys(edited).length > 0
                ? { onClick: edit }
                : { disabled: true })}
            >
              Save
            </button>
          </div>

          <div className=" w-screen justify-center mx-auto items-center  mt-8 flex flex-col">
            <div
              className={`card card-compact bg-base-100 text-sm  w-[90vw] 
            ${
              document.querySelector("html").getAttribute("data-theme") ===
              "black"
                ? " bg-base-100"
                : "bg-white"
            }
            
            rounded   `}
            >
              <div className="card-body">
                <div className="indicator  ">
                  <span
                    className={`indicator-item
                    bg-base-300
                    rounded-full p-1 mt-2 mr-2
              hover:text-sky-500 hover:cursor-pointer flex justify-start
              `}
                  >
                    <label htmlFor="avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3   h-3 cursor-pointer"
                      >
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                      </svg>
                    </label>
                  </span>

                  {profile.avatar || edited.avatar ? (
                    <img
                      src={
                        edited.avatar
                          ? URL.createObjectURL(edited.avatar)
                          : profile.avatar
                          ? `${api.baseUrl}/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`
                          : ""
                      }
                      className="w-16 h-16 rounded-full border border-1 border-base-300 avatar"
                    />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-16">
                        <span className="text-lg">
                          {profile.username
                            ? profile.username.charAt(0).tocapitalize()
                            : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    onChange={(e) => {
                      setedited({ ...edited, avatar: e.target.files[0] });
                      e.target.value = null;
                    }}
                  />
                </div>
                <h2 className="card-title">
                  <div className="flex flex-row gap-5 justify-between">
                    {edited.username ? edited.username : profile.username}
                    <div
                      className="tooltip"
                      data-tip={`Profile is ${
                        edited.Isprivate || profile.Isprivate
                          ? "private"
                          : "public"
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (edited.Isprivate || profile.Isprivate) {
                            setedited({ ...edited, Isprivate: false });
                            profile.Isprivate = false;
                          } else {
                            setedited({ ...edited, Isprivate: true });
                            profile.Isprivate = true;
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {edited.Isprivate || profile.Isprivate ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </h2>
                <p className="text-sm ">
                  @
                  {edited.username
                    ? edited.username + "_" + profile.id
                    : profile.username + "_" + profile.id}
                </p>
                <div className="relative flex flex-col">
                  <input
                    id="username"
                    type="text"
                    className={`input text-sm   focus:bg-transparent
                    bg-transparent
                    focus:ring-0
                    ${
                      document
                        .querySelector("html")
                        .getAttribute("data-theme") === "black"
                        ? " border-base-200"
                        : "border border-slate-200"
                    }
                    focus:outline-none rounded input-bordered mt-4`}
                    placeholder={profile.username}
                    value={edited.username ? edited.username : ""}
                    onInput={(e) => {
                      if (e.target.value < 1) {
                        // remove username key from object
                        let { username, ...rest } = edited;
                        setedited(rest);
                      } else {
                        setedited({ ...edited, username: e.target.value });
                      }
                    }}
                  />
                  <label
                    className={`
                  absolute bottom-4 right-4
                  ${
                    edited.username
                      ? edited.username.length < 5
                        ? "hidden"
                        : ""
                      : profile.username
                      ? profile.username.length < 20
                        ? "hidden"
                        : ""
                      : ""
                  }
                 `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="cursor-pointer w-5 h-5"
                      onClick={() => {
                        setedited({ ...edited, username: undefined });
                        document.getElementById("username").value = "";
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>

                <div className="flex flex-col relative">
                  <textarea
                    className={`textarea tet-sm h-[10rem] focus:outline-none  
                    ${
                      document
                        .querySelector("html")
                        .getAttribute("data-theme") === "black"
                        ? "border  border-base-200"
                        : "border border-slate-200"
                    }
                    resize-none rounded mt-4`}
                    placeholder={profile.bio}
                    value={edited.bio ? edited.bio : ""}
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        // remove bio from keys
                        let { bio, ...rest } = edited;
                        setedited(rest);
                      } else {
                        setedited({ ...edited, bio: e.target.value });
                      }
                    }}
                  ></textarea>
                  <label
                    className={`
                  absolute bottom-4 right-4
                  text-sm ${
                    edited.bio
                      ? edited.bio.length > biomax
                        ? "text-red-500"
                        : "text-gray-500"
                      : profile.bio
                      ? profile.bio.length > biomax
                        ? "text-red-500"
                        : "text-gray-500"
                      : "text-gray-500"
                  } 
                  `}
                  >
                    {edited.bio
                      ? biomax - edited.bio.length
                      : profile.bio
                      ? biomax - profile.bio.length
                      : biomax}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="discard" className="modal">
        <div
          className={`modal-box  text-sm w-[80vw] rounded ${
            document.querySelector("html").getAttribute("data-theme") ===
            "black"
              ? "bg-[#121212] text-white"
              : "bg-white text-black"
          }`}
        >
          <h3 className="font-bold">Discard Unsaved Changes?</h3>
          <p
            className={`mt-2 ${
              document.querySelector("html").getAttribute("data-theme") ===
              "black"
                ? "opacity-50"
                : "text-slate-500"
            }`}
          >
            Are you sure you want to discard your unsaved changes?
          </p>

          <div className="flex flex-col w-full mt-8 gap-5">
            <button
              className="btn h-min-[.5em] h-[.5em] bg-primary btn-sm text-white    rounded w-full capitalize "
              onClick={() => {
                document.getElementById("editprofile").close();
                document.getElementById("discard").close();
                setedited({});
              }}
            >
              Discard
            </button>
            <button
              className="btn btn-ghost border btn-sm hover:bg-transparent hover:border foucs:border border-slate-200 w-full rounded capitalize"
              onClick={() => {
                document.getElementById("discard").close();
              }}
            >
              Keep Editing
            </button>
          </div>
        </div>
      </dialog>

      {error ? (
        <div className="flex justify-center fixed top-0   transform  translate-x-[15vw] mt-8  ">
          <Alert className=" alert w-fit rounded bg-[#ff5454d1] flex">
            <div
              className="flex flex-row gap-2 items-center hover:cursor-pointer"
              onClick={() => {
                seterror("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6  h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>

              {error}
            </div>
          </Alert>
        </div>
      ) : (
        ""
      )}
      <div className="mt-8">
        <Bottomnav />
      </div>
    </>
  );
}
function debounce(fn, time) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, time);
  };
}
