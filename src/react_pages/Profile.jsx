import { api } from ".";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import * as sanitizeHtml from "sanitize-html";

api.autoCancellation(false);
import Modal from "../components/Modal";
import Bottomnav from "../components/Bottomnav";
import Post from "../components/Post";
import { useEffect, useState } from "react";

export default function Profile(props) {
  console.log("rerender");
  let [profile, setProfile] = useState({});
  let [posts, setPosts] = useState([]);
  let [followers, setFollowers] = useState(
    profile.followers ? profile.followers : []
  );
  let [hasRequested, setHasRequested] = useState(false);
  let [pageSelected, setPageSelected] = useState("posts");
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
    }
  }
  function fetchPosts(page) {
    return api
      .collection("posts")
      .getList(page, 10, {
        filter: `author.username="${props.user}"`,
        expand: "author",
        sort: "-created",
      })
      .then((res) => {
        return {
          items: res.items,
          totalPages: res.totalPages,
          totalItems: res.totalItems,
        };
      });
  }

  useEffect(() => {
    api
      .collection("users")
      .getFirstListItem(`username="${props.user}"`)
      .then((res) => {
        setProfile(res);
        setFollowers(res.followers ? res.followers : []);
      });
    if (
      (profile.followers &&
        profile.followers.includes(api.authStore.model.id) &&
        profile.Isprivate) ||
      !profile.Isprivate
    ) {
      fetchPosts(1).then(function (fetchedPosts) {
        setPosts(fetchedPosts.items);
        setTotalPages(fetchedPosts.totalPages);
      });
    }
  }, [props.user]);

  let [page, setPage] = useState(1);
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
      });
    }
  }

  function edit() {
    let form = new FormData();
    form.append("username", edited.username);
    form.append("bio", edited.bio ? edited.bio : profile.bio);
    form.append("Isprivate", edited.Isprivate);
    form.append("avatar", edited.avatar ? edited.avatar : profile.avatar);
    api
      .collection("users")
      .update(profile.id, form)
      .then((res) => {
        setProfile(res);
        window.location.href = `/u/${res.username}`;
      });
    document.getElementById("editprofile").close();
  }

  return (
    <>
      <div className=" p-5 flex flex-row justify-between">
        <div
          className="flex flex-row
        cursor-pointer
        "
          onClick={() => {
            window.history.back();
          }}
        >
          <img src="/icons/backarrow.svg" className="w-5 h-5" alt="Back" />{" "}
        </div>
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
      <div className="flex flex-col  p-5 gap-2">
        <div className="flex flex-row  justify-between gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">{profile.username}</h1>
              <span className="text-gray-500 text-sm ">
                @{profile.username}
              </span>
            </div>
            <span
              className="text-gray-500 
      w-[80vw] max-w-[80vw] 
      "
            >
              {profile.bio}
            </span>
            <span className="text-gray-500 text-sm ">
              Followed by {followers ? followers.length : 0}{" "}
              {followers.length === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="indicator  absolute end-5">
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
              <img
                src="/icons/verified.png"
                className="w-5 h-5 absolute bottom-0  left-0
          rounded-full
           
          "
              />
            ) : (
              ""
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-row gap-5 w-[42vw] mt-5">
            {props.user === api.authStore.model.username ? (
              <>
                <button
                  className="bg-[#121212] w-full btn btn-sm   text-white rounded-md  "
                  onClick={() => {
                    document.getElementById("editprofile").showModal();
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
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
                          ? "text-[#12121212] btn-ghost border-slate-400"
                          : "bg-[#121212] text-white"
                      } w-full btn btn-sm   rounded-md  `}
                      onClick={() => {
                        alert("Request sent!");
                      }}
                    >
                      {hasRequested ? "Requested" : "Request Access"}
                    </button>
                    <button
                      className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
                      onClick={() => {
                        window.newpost.showModal();
                        document.getElementById(
                          "post"
                        ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}"> @${profile.username}<a/>`;
                      }}
                    >
                      Mention
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${
                        followers && followers.includes(api.authStore.model.id)
                          ? "text-[#121212] btn-ghost border-slate-400"
                          : "bg-[#121212] text-white"
                      } w-full btn btn-sm   rounded-md  `}
                      onClick={debounce(follow, 1000)}
                    >
                      {followers && followers.includes(api.authStore.model.id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                    <button
                      className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
                      onClick={() => {
                        window.newpost.showModal();
                        document.getElementById(
                          "post"
                        ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}"> @${profile.username}<a/>`;
                      }}
                    >
                      Mention
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className=" mt-6 flex flex-row justify-evenly">
          <a
            id="posts"
            className={`tab w-full tab-bordered
        ease-out  
        ${pageSelected === "posts" ? "ease-in tab-active" : ""}
        
        `}
            onClick={() => {
              setPageSelected("posts");
            }}
          >
            Postrs
          </a>
          <a
            className={`tab w-full tab-bordered
         ease-out
          ${pageSelected === "saved" ? "ease-in tab-active" : ""}
      `}
            onClick={() => {
              setPageSelected("saved");
            }}
            id="reposts"
          >
            Saved
          </a>
          <a
            className={`tab w-full tab-bordered
        ease-out
        
          ${pageSelected === "media" ? "ease-in tab-active" : ""}
          
        `}
            onClick={() => {
              setPageSelected("media");
            }}
            id="media"
          >
            {" "}
            Media
          </a>
        </div>

        <div className="flex flex-col gap-5 mt-12">
          {profile.followers &&
          !profile.followers.includes(api.authStore.model.id) &&
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

              <h1 className="text-xl mt-2">This account is private.</h1>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMorePosts}
              hasMore={hasMore}
            >
              {posts.length < 1 ? (
                <div className=" gap-8 flex flex-col">
                  <Loading />
                  <Loading />
                  <Loading />
                </div>
              ) : (
                // Display posts when there are posts
                <div>
                  {posts.map((p) => {
                    let id = Math.random() * 100000000000000000;

                    return (
                      <div key={id} className="mb-16">
                        <Post
                          content={p.content}
                          author={p.expand.author}
                          file={p.file}
                          likes={p.likes}
                          id={p.id}
                          created={p.created}
                          ondelete={() => {
                            window["delete" + id].showModal();
                          }}
                          comments={p.comments}
                        />
                        {/**
                         * @Modal
                         * @name: delete
                         * @description: Allows the user to delete a post that pertains to them
                         * @function: delete{props.id}
                         *
                         */}
                        <Modal id={"delete" + id} height="h-96">
                          <button className="flex justify-center mx-auto focus:outline-none">
                            <div className="divider  text-slate-400  w-12   mt-0"></div>
                          </button>
                          <div className="flex-col text-sm mt-8 flex">
                            <div className="form-control w-full ">
                              <label className="label flex text-lg flex-row">
                                Please confirm that you want to delete this post
                                - this action cannot be undone.
                              </label>
                            </div>
                            <div className="flex flex-row gap-5 mt-5">
                              <a
                                onClick={() => {
                                  document
                                    .getElementById("delete" + id)
                                    .close();
                                }}
                                className="absolute bottom-12 cursor-pointer text-sky-500 text-sm left-5"
                              >
                                Cancel
                              </a>
                              {/* The delete action should only be available when the post exists */}
                              {posts.includes(p) && (
                                <a
                                  onClick={debounce(() => {
                                    api.collection("posts").delete(p.id);
                                    let index = posts.indexOf(p);
                                    posts.splice(index, 1);
                                    setPosts([...posts]);
                                    document
                                      .getElementById("delete" + id)
                                      .close();
                                  }, 1000)}
                                  className="absolute bottom-12 text-sky-500 cursor-pointer text-sm end-5"
                                >
                                  Delete
                                </a>
                              )}
                            </div>
                          </div>
                        </Modal>
                        {/**
                         * @Modal
                         * @name: comment
                         * @description: Allows the user to comment on a post
                         * @function: comment{props.id}
                         */}
                        <Modal
                          id={"comment" + post.id}
                          height="h-screen w-screen"
                        >
                          <button className="flex justify-center mx-auto focus:outline-none">
                            <div className="divider  text-slate-400  w-12   mt-0"></div>
                          </button>
                          <div className="p-5">
                            <span className="justify-center mx-auto flex font-bold text-black">
                              Comments
                            </span>

                            <div
                              className={`flex flex-row   gap-2 left-2  p-2  absolute bottom-${
                                window.innerWidth > 640 ? "16" : "5"
                              }`}
                            >
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
                    );
                  })}
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>
      <Modal id="editprofile" height="h-screen">
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
                  let file = e.target.files[0];
                  setedited({ ...edited, avatar: file });
                }}
              />
            </label>
            <input
              type="text"
              placeholder={profile.username}
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300   focus:outline-none focus:ring-0"
              onChange={(e) => {
                let val = sanitizeHtml(e.target.value, {
                  allowedTags: [],
                  allowedAttributes: {},
                });

                setedited({ ...edited, username: val });
              }}
              name="username"
            />
            <label className="label mt-5">
              <span className="label-text font-bold text-sm">Bio</span>
            </label>
            <input
              type="text"
              placeholder={profile.bio}
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300   focus:outline-none focus:ring-0"
              onChange={(e) => {
                let val = sanitizeHtml(e.target.value, {
                  allowedTags: [],
                  allowedAttributes: {},
                });

                if (val.length < 100) {
                  setedited({ ...edited, bio: val });
                } else if (val.length > 100) {
                  alert("Bio cannot be more than 100 characters");
                } else {
                  setedited({ ...edited, bio: val });
                }
                setedited({ ...edited, bio: val });
              }}
            />
            <div className="form-control   mt-5">
              <label className="label cursor-pointer">
                <span className="label-text">Private Profile</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={profile.Isprivate ? true : false}
                  onChange={(e) => {
                    setedited({ ...edited, Isprivate: e.target.checked });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-5 mt-5">
            <a
              onClick={edit}
              className="absolute bottom-5 text-sky-500 text-sm end-5 "
            >
              Done
            </a>
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
