import { api } from ".";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import * as sanitizeHtml from "sanitize-html";

api.autoCancellation(false);
import Modal from "../components/Modal";
import Bottomnav from "../components/Bottomnav";
import Post from "../components/Post";
import Comment from "../components/Comments";
import { useEffect, useState } from "react";

export default function Profile(props) {
  let [profile, setProfile] = useState({});
  let [array, setarray] = useState([]);
  let [followers, setFollowers] = useState(
    profile.followers ? profile.followers : [],
  );
  let [hasRequested, setHasRequested] = useState(false);
  let [pageSelected, setPageSelected] = useState("posts");
  let [loading, setLoading] = useState(true);
  let [hasMore, setHasMore] = useState(true);
  let [edited, setedited] = useState({});
  const [totalPages, setTotalPages] = useState(0);
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
        image: `https://postrapi.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`,
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
            ? "-created,-likes"
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
      .getFirstListItem(`username="${props.user}"`)
      .then((res) => {
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
        edited.username ? edited.username : profile.username,
      );
      form.append("bio", edited.bio !== undefined ? edited.bio : profile.bio);
      form.append(
        "Isprivate",
        edited.Isprivate ? edited.Isprivate : profile.Isprivate,
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
          alert(e);
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
              <h1 className="text-xl font-bold">
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
            <span className="text-gray-500 text-sm ">
              Followed by {followers ? followers.length : 0}{" "}
              {followers.length === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="indicator  absolute  end-5">
            {profile.avatar ? (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full  avatar"
              />
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-16">
                  <span className="text-lg">
                    {profile.username
                      ? profile.username.charAt(0).toUpperCase()
                      : ""}
                  </span>
                </div>
              </div>
            )}

            {profile.validVerified ? (
              <span className="">
                <img
                  src="/icons/verified.png"
                  className="w-5 h-5 absolute border-white border-1 bg-base-300  bottom-0  left-0
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
            <div className="flex flex-row gap-5 w-[42vw] mt-8">
              {props.user === api.authStore.model.username ? (
                <>
                  <button
                    className="bg-[#121212] w-full btn btn-sm  h-text-sm text-white rounded-md  uppercase"
                    onClick={() => {
                      document.getElementById("editprofile").showModal();
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className={`btn btn-sm btn-ghost w-full uppercase border-slate-200
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
                                 ? ` uppercase text-white btn-ghost border-slate-200 `
                                 : ` text-[#12121212] btn-ghost border-slate-200 `
                             }
                            `
                            : document
                                .querySelector("html")
                                .getAttribute("data-theme") === "black"
                            ? `uppercase bg-[#121212] text-white`
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
                             ? "uppercase text-white rounded border border-white"
                             : "text-[#121212]"
                         }
                        
                        `}
                        onClick={() => {
                          window.newpost.showModal();
                          document.getElementById(
                            "post",
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
                              ? "uppercase text-white rounded border "
                              : "text-white bg-black hover:bg-black focus:bg-black"
                            : ""
                        } w-full btn btn-sm   rounded-md  `}
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
                              ? "uppercase text-white rounded border border-white"
                              : "text-[#121212] border-slate-200"
                          }

                        `}
                        onClick={() => {
                          window.newpost.showModal();
                          document.getElementById(
                            "post",
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
          !profile.followers.includes(api.authStore.model.id) &&
          profile.$dead === true &&
          profile.Isprivate ? (
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
                          likes={p.likes}
                          comments={p.comments}
                          created={p.created}
                          image={p.image}
                          post={p}
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
                          likes={c.likes}
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

      <Modal
        id="editprofile"
        height={`
      h-screen ${
        document.querySelector("html").getAttribute("data-theme") === "black"
          ? "bg-base-200 rounded"
          : "bg-white"
      }
      `}
      >
        <button className="flex justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400  w-12   mt-0"></div>
        </button>
        <div className="flex-col text-sm mt-8 flex">
          <div className="form-control w-full ">
            <label className="label flex flex-row">
              <span className="label-text font-bold text-sm">Name</span>
              <label htmlFor="profileinput">
                <img
                  src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`}
                  id="profilepicin"
                  className="rounded-full w-12 h-12 absolute end-5 "
                  alt="Avatar"
                />
              </label>

              <input
                type="file"
                className="hidden"
                id="profileinput"
                accept="image/*"
                onChange={(e) => {
                  setedited({ ...edited, avatar: e.target.files[0] });
                  document.getElementById("profilepicin").src =
                    URL.createObjectURL(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <input
              type="text"
              placeholder={profile.username}
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300  bg-transparent  focus:outline-none focus:ring-0"
              onInput={(e) => {
                setedited({ ...edited, username: e.target.value });
              }}
              name="username"
            />
            <label className="label mt-5">
              <span className="label-text font-bold text-sm">Bio</span>
            </label>
            <input
              type="text"
              placeholder={profile.bio}
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300   bg-transparent focus:outline-none focus:ring-0"
              onInput={(e) => {
                setedited({ ...edited, bio: e.target.value });
              }}
            />
            <div className="form-control   mt-5">
              <label className="label cursor-pointer">
                <span className="label-text">Private Profile</span>
                <input
                  type="checkbox"
                  className={`toggle rounded-full`}
                  {...(edited.Isprivate ? "checked" : "")}
                  onInput={(e) => {
                    setedited({ ...edited, Isprivate: e.target.checked });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="absolute bottom-12 flex flex-row gap-5  ">
            <button
              onClick={edit}
              className="  text-sky-500 text-sm end-5 cusor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
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
