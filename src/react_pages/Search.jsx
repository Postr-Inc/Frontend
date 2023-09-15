import { useState, useEffect, useRef } from "react";
import { api } from ".";
import Bottomnav from "../components/Bottomnav";
import Modal from "../components/Modal";

export default function Search() {
  let [search, setSearch] = useState("");
  let [users, setUsers] = useState([]);
  let [isFollow, setIsFollow] = useState(false);
  let [searchUsers, setSearchUsers] = useState([]);
  let [isSearching, setIsSearching] = useState(false);
  let inputref = useRef(null);
  let [page, setPage] = useState(1);
  let [isLoadMore, setIsLoadMore] = useState(false);
  let [totalUsers, setTotalUsers] = useState(0);
  function loadUsers() {
    setIsLoadMore(true);
    api
      .collection("users")
      .getList(page, 10, {
        filter: `id != "${api.authStore.model.id}"`,
      })
      .then((res) => {
        setUsers((users) => [...users, ...res.items]);
        setTotalUsers(res.totalPages);
        setIsLoadMore(false);
        console.log(res.totalPages);
      });
  }
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (Number(page) === Number(totalUsers) && !isLoadMore) {
        return;
      }

      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 5 &&
        !isLoadMore
      ) {
        // Increment the page in a callback to ensure proper state update
        setPage(++page);
        console.log(page);

        loadUsers();
      }
    }, 1000);

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isLoadMore, users]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (search.trim() !== "") {
        api
          .collection("users")
          .getFullList("*", {
            filter: `username ~ "${search}"`,
          })
          .then((res) => {
            setIsSearching(false);
            setSearchUsers(res);
          })
          .catch(() => {
            setSearchUsers([]);
          });
      } else {
        setSearchUsers([]); // Clear results when search is empty
      }
    }, 1000);

    // Cleanup: Clear the timeout if the component unmounts or if the input changes
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [search]);
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div className=" p-5 flex flex-col  ">
      <div className="flex justify-between  mb-2  items-center">
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
        <h1 className="text-2xl " style={{ fontFamily: "Inter" }}>
          Search &nbsp;
        </h1>
        <div></div>
      </div>
      <div class="form-control mt-2 mb-8">
        <div class="input-group">
          <button class=" border-r-0 input-group-xs border  focus:bg-transparent hover:bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mx-2 h-4 w-4 border-l-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            onClick={() => {
              document.getElementById("search").showModal();
              inputref.current.focus();
            }}
            placeholder="Search…"
            class="
    w-screen
    input
     border-l-0
     focus:outline-none
    border-slate-200 input-sm  "
          />
        </div>

        {users.map((u) => {
          return (
            <div className="flex flex-col mt-6 mb-6 gap-2" key={u.id}>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                  {u.avatar ? (
                    <img
                      src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${u.id}/${u.avatar}`}
                      className="w-6  h-6 rounded-full"
                    />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8 h-8">
                        <span className="text-sm">
                          {u.username ? u.username.charAt(0).toUpperCase() : ""}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span
                      className="mx-2 text-sm cursor-pointer"
                      onClick={() => {
                        window.location.href = "/u/" + u.username;
                      }}
                    >
                      {u.username}
                    </span>
                    <span className="mx-2 text-sm text-slate-400">
                      {u.bio.substring(0, 20)}...
                    </span>
                  </div>
                  <button
                    className="btn-ghost rounded btn-sm w-24 end-5 absolute border-slate-200 hover:text-white focus:ring-0 hover:ring-0 hover:bg-transparent focus:bg-transparent"
                    onClick={() => {
                      const updatedFollowers = u.followers.includes(
                        api.authStore.model.id,
                      )
                        ? u.followers.filter(
                            (id) => id !== api.authStore.model.id,
                          )
                        : [...u.followers, api.authStore.model.id];
                      setIsFollow(!isFollow); // Toggle the isFollow state
                      api
                        .collection("users")
                        .update(u.id, {
                          followers: updatedFollowers,
                        })
                        .then(() => {
                          u.followers = updatedFollowers;
                        })
                        .catch((error) => {
                          console.error("Error updating followers:", error);
                        });
                    }}
                  >
                    {u.followers.includes(api.authStore.model.id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-12">
        <Bottomnav />
      </div>
      <Modal id="search" height="h-screen">
        <button className="flex justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400 w-12 mt-0"></div>
        </button>

        <div class="form-control mt-2">
          <div class="input-group">
            <button class=" border-r-0 input-group-xs border  focus:bg-transparent hover:bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-2 h-4 w-4 border-l-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <input
              type="text"
              ref={inputref}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!isSearching) {
                  setIsSearching(true);
                }
                setSearchUsers([]);
              }}
              placeholder="Search…"
              class="
    w-screen
    input
     border-l-0
     focus:outline-none
    border-slate-200 input-sm  "
            />
          </div>

          {searchUsers.length > 0 ? (
            searchUsers.map((u) => {
              return (
                <div className="flex flex-col mt-6 gap-2">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                      {u.avatar ? (
                        <img
                          src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${u.id}/${u.avatar}`}
                          className="w-8  h-8 rounded-full"
                        />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8 h-8">
                            <span
                              className="text-lg"
                              onClick={() => {
                                window.location.href = "/u/" + u.username;
                              }}
                            >
                              {u.username
                                ? u.username.charAt(0).toUpperCase()
                                : ""}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span
                          className="mx-2 text-sm cursor-pointer"
                          onClick={() => {
                            window.location.href = `/u/${u.username}`;
                          }}
                        >
                          {u.username}
                        </span>
                        <span className="mx-2 text-sm text-slate-400">
                          {u.bio.substring(0, 20)}...
                        </span>
                        <span className="mx-2 text-sm ">
                          {u.followers.length} Followers
                        </span>
                      </div>
                      <span
                        className="btn btn-ghost rounded btn-sm w-24 end-5 absolute border-slate-200 hover:text-white focus:ring-0 hover:ring-0 hover:bg-transparent focus:bg-transparent"
                        onClick={debounce(() => {
                          const updatedFollowers = u.followers.includes(
                            api.authStore.model.id,
                          )
                            ? u.followers.filter(
                                (id) => id !== api.authStore.model.id,
                              )
                            : [...u.followers, api.authStore.model.id];
                          setIsFollow(!isFollow); // Toggle the isFollow state
                          api
                            .collection("users")
                            .update(u.id, {
                              followers: updatedFollowers,
                            })
                            .then(() => {
                              u.followers = updatedFollowers;
                            })
                            .catch((error) => {
                              console.error("Error updating followers:", error);
                            });
                        })}
                      >
                        {u.followers.includes(api.authStore.model.id)
                          ? "Unfollow"
                          : "Follow"}
                      </span>
                    </div>
                  </div>

                  <div className="divider  rounded h-1"></div>
                </div>
              );
            })
          ) : isSearching ? (
            <div
              className="flex flex-col gap-2 mx-auto mt-16 justify-center "
              style={{ marginTop: "50%" }}
            >
              <span className="loading w-6  flex mx-auto mt-16"></span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </div>
  );
}
function debounce(fn, time) {
  let timeout;
  if (!time) {
    time = 1000;
  }
  // make sure it only goes once at a time
  return function () {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}
