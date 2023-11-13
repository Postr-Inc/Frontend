import { useEffect, useState } from "react";
import Bottomnav from "../components/Bottomnav";
import { api } from ".";
import Post from "../components/Post";
import Loading from "../components/Loading";

export default function Bookmarks() {
  let [bookmarks, setBookmarks] = useState([]);
  let [accessbile, setaccessible] = useState(
    JSON.parse(localStorage.getItem("accessbile")),
  );
  let theme = document.documentElement.getAttribute("data-theme");
  useEffect(() => {
    api
      .collection("users")
      .getOne(api.authStore.model.id, {
        expand: "bookmarks,bookmarks.author,bookmarks.comments",
      })
      .then((user) => {
        setBookmarks(user.expand.bookmarks);
      });
  }, []);

  console.log(api.authStore.model);

  return (
    <div className="p-5 mb-6">
      <div className="flex flex-row justify-between">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6 cursor-pointer
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
            onClick={() => {
              window.history.back();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <h1
          className={`text-2xl flex mx-auto justify-center items-center
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
          style={{ fontFamily: "Inter" }}
        >
          Bookmarks
        </h1>

        <div></div>

        <div className="flex flex-row gap-5">
          <div className="dropdown  dropdown-end">
            <label tabIndex={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 cursor-pointer
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className={`dropdown-content p-2 z-[1] menu  shadow rounded   w-52
              ${
                accessbile && theme === "black"
                  ? `
                bg-base-300    text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 bg-black  text-white antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
            >
              <li>
                {bookmarks.length > 0 || api.authStore.model.bookmarks > 0 ? (
                  <a
                    onClick={() => {
                      bookmarks.forEach((post) => {
                        let bookmarked = post.bookmarked;
                        api.collection("posts").update(post.id, {
                          bookmarked: [
                            ...bookmarked.filter(
                              (id) => id !== api.authStore.model.id,
                            ),
                          ],
                        });
                      });
                      api
                        .collection("users")
                        .update(api.authStore.model.id, {
                          bookmarks: [],
                        })
                        .then(() => {
                          setBookmarks([]);
                        });
                    }}
                  >
                    Clear All Bookmarks
                  </a>
                ) : (
                  <a>Clear All Bookmarks</a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {api.authStore.model.bookmarks < 1 ? (
        <div
          className={`p-5 flex flex-col mt-8 
              ${
                accessbile && theme === "black"
                  ? `
                text-white antialiased   drop-shadow-md not-sr-only  
                `
                  : accessbile && theme === "light"
                  ? `
                 text-black  antialiased   drop-shadow-md not-sr-only 
                `
                  : ""
              }
              `}
        >
          <span className="  font-bold text-2xl ">
            Save posts to view them here
          </span>
          <span className="text-sm">
            Dont let your favorite posts get away. Tap the save icon on the
            bottom of any post to add it to this collection. So you can easily
            find it later.
          </span>
        </div>
      ) : 
      bookmarks.length > 0 ?
      (
        bookmarks.map((post) => {
          let key = Math.random();
          return (
            <div key={key} className="mt-8">
              <Post
                file={post.file}
                author={post.expand.author}
                likes={post.likes}
                verified={post.expand.author.validVerified}
                comments={[]}
                content={post.content}
                id={post.id}
                created={post.created}
                bookmarked={post.bookmarked}
              />
            </div>
          );
        })
      ) : <>
       <div className="flex flex-col gap-5  mt-5">
       <Loading />
       <Loading />
       
       </div>
      </>
      }
      <div className="mt-8">
        <Bottomnav />
      </div>
    </div>
  );
}
