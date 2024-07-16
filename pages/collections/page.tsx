"use client";
import { Props } from "../../src/@types/types";
import { api } from "../../src/api/api";
import { BottomNav } from "../../src/components/BottomNav";
import { SideBarLeft, SideBarRight } from "../../src/components/Sidebars";
import { useEffect, useRef, useState } from "react";
export default function Collections(props: Props) {
  let [isClient, setClient] = useState(false);
  let [collections, setCollections] = useState([]);
  let [isFetching, setFetching] = useState({ status: false, type: "" });
  let [search, setSearch] = useState("");
  let initialized = useRef(false);
  useEffect(() => {
    if (typeof window !== "undefined") setClient(true);

    if (!initialized.current && typeof window !== "undefined") {
      initialized.current = true;
      api
        .list({
          collection: "collections",
          expand: ["posts", "members"],
          filter: `owner="${api.authStore.model().id}"`,
        })
        .then((res: any) => {
          setCollections(res.items);
        });
    }
  }, []);
  return (
    <>
      {isClient ? (
        <div className="relative xl:flex   lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ">
          <SideBarLeft {...props} />

          <div
            className=" xl:mx-24     text-md   
     relative 
     xl:w-[35vw]
     md:w-[50vw]    h-screen
    
            xl:text-sm md:text-sm"
          >
            <div className=" flex justify-between mt-2 gap-5 hero ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="xl:w-6 xl:h-6 w-5 h-5 cursor-pointer         "
              >
                <path
                  fill-rule="evenodd"
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div className="dropdown rounded w-full">
                <div tabIndex={0} role="button" className="w-full m-1">
                  <input
                    onChange={(e) => {
                      setSearch(e.target.value);
                      if (e.target.value.length > 0) {
                        setFetching({ status: true, type: "collections" });
                        api
                          .list({
                            collection: "collections",
                            filter: `name~"${e.target.value}"`,
                            limit: 10,
                            page: 0,
                            sort: "-created",
                            expand: ["owner", "members"],
                          })
                          .then((res) => {
                            setFetching({ status: false, type: "collections" });
                            //@ts-ignore
                            setCollections(res?.items);
                          });
                      } else {
                        setCollections([]);
                      }
                    }}
                    type="text"
                    placeholder="Find inspiration"
                    className="border focus:outline-none border-[#eaeaea] rounded-full p-3 w-full "
                  ></input>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-5 shadow bg-base-100 rounded-box w-full h-[15vh] "
                >
                  <div className="flex flex-col gap-5 hero mx-auto font-bold text-md">
                    <p>Search for collections</p>
                    {isFetching.status && isFetching.type == "search" ? (
                      <span className="loading loading-spinner text-blue-500"></span>
                    ) : (
                      ""
                    )}
                    {collections.length > 0
                      ? collections.map((col: {name: string}) => {
                          return (
                            <div>
                              {col.name}
                              <button className="btn">Import</button>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </ul>
              </div>

              <div className="flex gap-5">
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
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
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
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
            </div>

            <div className="">
              <p className="text-lg mt-12 font-bold">Your Collections</p>
              {collections.length == 0 && search.length == 0 ? (
                <div className="flex flex-col gap-5 hero mx-auto font-bold text-md">
                  <p>You don't have any collections yet</p>
                  <p>When you create a collection, it will appear here.</p>
                  <button
                    onClick={() => {
                      props.swapPage("createCollection");
                    }}
                    className="btn btn-md bg-blue-500 text-white"
                  >
                    Create a collection
                  </button>
                </div>
              ) : (
                ""
              )}
              {collections.length == 0 && search.length > 0 ? (
                <div className="flex flex-col gap-5 hero mx-auto font-bold text-md">
                  <p>No collections found</p>
                  <p>Try searching for something else.</p>
                </div>
              ) : (
                ""
              )}
              {collections.length > 0 ? (
                <div className="flex flex-col gap-5  mt-5 font-bold text-md">
                  {collections.map((col: {name: string, members: any[] }) => {
                    return (
                      <div className="flex gap-2 flex-col">
                        <div className="flex gap-2 hero">
                          <div className="bg-blue-500 p-2 rounded-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-7 h-7"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>

                          <div className="flex flex-col gap-2">
                            <p>
                              {col.name} - Members: {col.members.length}
                            </p>
                            <p>Test</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="xl:hidden lg:hidden">
              <BottomNav {...props} />
            </div>
          </div>

          <SideBarRight {...props} />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
