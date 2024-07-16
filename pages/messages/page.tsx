//@ts-nocheck
"use client";
import Page from "@/src/components/shared/Page";
import { use, useEffect, useLayoutEffect, useState } from "react";
import { api } from "@/src/api/api";
import { Props } from "@/src/@types/types";
import Modal from "@/src/components/Modal";
import { BottomNav } from "@/src/components/BottomNav";
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
export default function Messages(props: Props) {
  if (typeof window == "undefined") return <></>;
  let [ActiveMessageChannel, setActiveMessageChannel] = useState<any>(null);
  let [MessageChannels, setMessageChannels] = useState<any>([]);
  let [isCreatingAGroup, setIsCreatingAGroup] = useState(false);
  let [SearchResults, setSearchResults] = useState<any>([]);
  let [isTyping, setIsTyping] = useState(false);
  let [SearchQuery, setSearchQuery] = useState("");
  let [currentMessageContent, setCurrentMessageContent] = useState("");
  let [Messages, setMessages] = useState<any>([]);
  useLayoutEffect(() => {
    if (api.cacheStore.get(`chats-${api.authStore.model().id}`)) {
      setMessageChannels(
        JSON.parse(api.cacheStore.get(`chats-${api.authStore.model().id}`))
          .value
      );

      return;
    }
    api
      .list({
        collection: "chats",
        cacheKey: `chats-${api.authStore.model().id}`,
        cacheTime: 1000 * 60 * 60, // 1 hour
        filter: `members ~"${api.authStore.model().id}"`,
        limit: 100,
        page: 0,
        expand: ["members", "messages", "messages.owner"],
      })
      .then((data) => {
        console.log(data);
        api.cacheStore.set(
          `chats-${api.authStore.model().id}`,
          data.items,
          1000 * 60 * 60
        );
        setMessageChannels(data.items);
      });
  }, []);

  // Debounce function to handle search
  const handleSearch = debounce((query) => {
    api
      .list({
        collection: "users",
        cacheKey: `search-${query}`,
        cacheTime: 1000 * 60 * 60, // 1 hour
        filter: `username ~"${query}" && id != "${api.authStore.model().id}"`,
        limit: 100,
        page: 0,
        expand: ["followers", "following"],
      })
      .then((data) => {
        console.log(data);
        setSearchResults(data.items);
      });
  }, 300); // 300ms debounce delay

  useEffect(() => {
    const handleKeyDown = (e) => {
      setIsTyping(true);
    };

    const handleKeyUp = () => {
      setIsTyping(false);
      handleSearch(SearchQuery);
    };

    document
      .getElementById("search-people")
      .addEventListener("keydown", handleKeyDown);
    document
      .getElementById("search-people")
      .addEventListener("keyup", handleKeyUp);

    return () => {
      if (document.getElementById("search-people")) {
        document
          .getElementById("search-people")
          .removeEventListener("keydown", handleKeyDown);
        document
          .getElementById("search-people")
          .removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [SearchQuery]);

  if (ActiveMessageChannel) {
    setTimeout(() => {
      document.getElementById("message-container").scrollTo({
        top: 1000000,
        behavior: "smooth",
      });
    }, 1000);
  }
  if (
    ActiveMessageChannel &&
    !api.isSubscribed(`chat-${ActiveMessageChannel.id}`)
  ) {
    api.subscribe(
      { event: "*", collection: "chats", userId: api.authStore.model().id },
      (data) => {
        if (
          data.record.chat === ActiveMessageChannel.id &&
          data.record.owner !== api.authStore.model().id
        ) {
          setMessages([...Messages, data.record]);
          ActiveMessageChannel.messages.push(data.record.id);
          if (!ActiveMessageChannel.expand.hasOwnProperty("messages")) {
            ActiveMessageChannel.expand.messages = [data.record];
          } else {
            ActiveMessageChannel.expand.messages.push(data.record);
          }
          api.cacheStore.set(
            `chat-${api.authStore.model().id}-${ActiveMessageChannel.id}`,
            ActiveMessageChannel,
            1000 * 60 * 60
          );
          document.getElementById(`message-${data.record.id}`)?.scrollTo({
            top: 1000000,
            behavior: "smooth",
          });
        }
      }
    );
  }

  const createMesaage = debounce(() => {
    // add current message to the messages array
    setMessages([
      ...Messages,
      {
        content: currentMessageContent,
        owner: api.authStore.model().id,
        expand: {
          owner: api.authStore.model(),
        },
      },
    ]);
    let owner = api.authStore.model();
    delete owner.email;
    delete owner.token;
    api
      .create({
        collection: "messages",
        expand: ["chat"],
        cacheKey: `message-${api.authStore.model().id}-${
          ActiveMessageChannel.id
        }`,
        record: {
          content: currentMessageContent,
          expand: {
            owner: owner,
            chat: ActiveMessageChannel,
          },
          chat: ActiveMessageChannel.id,
          owner: api.authStore.model().id,
        },
      })
      .then((data) => {
        api.update({
          collection: "chats",
          id: ActiveMessageChannel.id,
          expand: ["members", "messages"],
          cacheKey: `chat-${api.authStore.model().id}-${
            ActiveMessageChannel.id
          }`,
          record: {
            messages: [...ActiveMessageChannel.messages, data.id],
          },
        });
        ActiveMessageChannel.messages.push(data.id);
        ActiveMessageChannel.expand.messages.push(data);
        api.cacheStore.set(
          `chat-${api.authStore.model().id}-${ActiveMessageChannel.id}`,
          ActiveMessageChannel,
          1000 * 60 * 60
        );
      });
  }, 300);

  useEffect(() => {
    if (ActiveMessageChannel) {
      const handleKeyDown = (e) => {
        setIsTyping(true);
      };
    }
  }, [currentMessageContent]);

  return (
    <Page {...props} hideRight={true} hideBottomNav={ActiveMessageChannel}>
      <div className="flex  xl:w-[62.5vw] lg:w-[62.5vw] md:w-[62.5vw]">
        <div
          className={`      text-md   
         relative  w-full p-2
          
         `}
        >
          <div className="sm:hidden">
            <div className="flex justify-between mt-2  p-2  w-full">
              <h1 className="text-2xl font-bold">Messages</h1>
              <span className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <svg
                  onClick={() => {
                    //@ts-ignore
                    document.getElementById("createChat").showModal();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="xl:hidden lg:hidden md:hidden">
            {!ActiveMessageChannel ? (
              <div className="flex justify-between mt-2  p-2  w-full">
                <h1 className="text-2xl font-bold">
                  {ActiveMessageChannel
                    ? ActiveMessageChannel.expand.members[0].username ===
                      api.authStore.model().username
                      ? ActiveMessageChannel.expand.members[1].username
                      : ActiveMessageChannel.expand.members[0].username
                    : "Messages"}
                </h1>
                <span className="flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <svg
                    onClick={() => {
                      //@ts-ignore
                      document.getElementById("createChat").showModal();
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>
              </div>
            ) : (
              <div className="flex justify-between mt-2   p-2  w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-7 h-7"
                  onClick={() => {
                    setActiveMessageChannel(null);
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z"
                    clipRule="evenodd"
                  />
                </svg>

                <div className="flex flex-col  hero ">
                  <img
                    src={api.cdn.url({
                      collection: "users", 
                      id: ActiveMessageChannel.expand.members[0].id === api.authStore.model().id ? ActiveMessageChannel.expand.members[1].id : ActiveMessageChannel.expand.members[0].id,
                      file: ActiveMessageChannel.expand.members[0].avatar === api.authStore.model().avatar ? ActiveMessageChannel.expand.members[1].avatar : ActiveMessageChannel.expand.members[0].avatar,
                    })}
                    className="w-7 h-7 rounded"
                  />

                  <h1 className="text-lg font-bold">
                    {ActiveMessageChannel
                      ? ActiveMessageChannel.expand.members[0].username ===
                        api.authStore.model().username
                        ? ActiveMessageChannel.expand.members[1].username
                        : ActiveMessageChannel.expand.members[0].username
                      : "Messages"}
                  </h1>
                  <p className="text-sm">
                    {ActiveMessageChannel.expand.members[0].username ===
                    api.authStore.model().username
                      ? ActiveMessageChannel.expand.members[1].bio
                      : ActiveMessageChannel.expand.members[0].bio}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="sm:hidden">
            {MessageChannels.length > 0 ? (
              <>
                <div className="flex flex-col gap-5 mt-2">
                  <input
                    type="text"
                    id="search"
                    className="w-full p-3 rounded-full"
                    placeholder="Search Direct Messages"
                  />
                  <br></br>
                  {MessageChannels.map((channel) => {
                    return (
                      <div
                        onClick={() => {
                          if (channel.expand.hasOwnProperty("messages")) {
                            setMessages(channel.expand.messages);
                          } else {
                            setMessages([]);
                          }
                          // scroll to the bottom of the chat

                          setActiveMessageChannel(channel);
                        }}
                        key={channel.id}
                        className={`flex flex-row gap-2 p-3 mt-2 first-letter:
                       
                        ${
                          theme === "dark"
                            ? "hover:bg-[#313131]"
                            : "hover:bg-[#f9f9f9]"
                        }
                            cursor-pointer`}
                      >
                        <img
                          src={api.cdn.url({
                            collection: "users", 
                            id: channel.expand.members[0].id === api.authStore.model().id ? channel.expand.members[1].id : channel.expand.members[0].id,
                            file: channel.expand.members[0].avatar === api.authStore.model().avatar ? channel.expand.members[1].avatar : channel.expand.members[0].avatar,
                          })}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <p className="font-bold">
                            { channel.expand.members[0].username === api.authStore.model().username
                              ? channel.expand.members[1].username
                              : channel.expand.members[0].username}
                          </p>
                          <p className="text-sm">
                            {channel.expand.messages &&
                            channel.expand.messages.length > 0
                              ? channel.expand.messages[
                                  channel.expand.messages.length - 1
                                ].content
                              : "Start a conversation"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mt-12 p-2 sm:hidden">
                <h1 className="text-2xl font-extrabold sm:h">
                  Welcome to your mailbox!
                </h1>
                <p className="text-sm">
                  Drop some memes, share posts, and chat with friends with
                  private conversations
                </p>
                <button
                  onClick={() => {
                    //@ts-ignore
                    document.getElementById("createChat").showModal();
                  }}
                  className="bg-[#1a4173] text-white rounded-full p-5 w-fit mt-5"
                >
                  Start chatting
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className={` sm:hidden     text-md   
         relative  w-full  relative
         ${
           theme === "dark"
             ? "xl:border xl:border-[#121212]"
             : "border border-[#e5e7eb]"
         }
         `}
        >
          <div className="flex justify-between mt-2   p-2  w-full">
            {ActiveMessageChannel ? (
              <div className="w-full">
                <h1>
                  {ActiveMessageChannel.expand.members[0].username ===
                  api.authStore.model().username
                    ? ActiveMessageChannel.expand.members[1].username
                    : ActiveMessageChannel.expand.members[0].username}
                </h1>
                <div
                  id="message-container"
                  className="scroll"
                  style={{
                    overflowX: "scroll",
                    width: "100%",
                  }}
                >
                  {Messages.length > 0 ? (
                    Messages.map((message) => {
                      return message.owner === api.authStore.model().id ? (
                        <div
                          id={`message-${message.id}`}
                          className="chat chat-start"
                        >
                          <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                              <img
                                alt={message.expand.owner.username}
                                src={api.cdn.url({
                                  collection: "users",
                                  id: message.owner,
                                  file: message.expand.owner.avatar,
                                })}
                              />
                            </div>
                          </div>
                          <div className="chat-header mx-5">
                            {message.expand.owner.username}
                            <time className="text-xs opacity-50 mx-5">
                              {new Date(message.created).toLocaleTimeString()}
                            </time>
                          </div>
                          <div className="chat-bubble rounded-full">
                            {message.content}
                          </div>
                          <div className="chat-footer opacity-50">
                            Delivered
                          </div>
                        </div>
                      ) : (
                        <div
                          id={`message-${message.id}`}
                          className="chat chat-end w-full"
                        >
                          <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                              <img
                                alt={message.expand.owner.username}
                                src={api.cdn.url({
                                  collection: "users",
                                  id: message.owner,
                                  file: message.expand.owner.avatar,
                                })}
                              />
                            </div>
                          </div>
                          <div className="chat-header">
                            {message.expand.owner.username}
                            <time className="text-xs opacity-50 mx-5">
                              {new Date(message.created).toLocaleTimeString()}
                            </time>
                          </div>
                          <div className="chat-bubble rounded-full">
                            {message.content}
                          </div>
                          <div className="chat-footer opacity-50">
                            Seen at 12:46
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div>
                      <p>Start a conversation</p>
                    </div>
                  )}
                </div>

                <div
                  className={`
                 absolute bottom-0  left-0 right-0 p-3
                    
                    `}
                >
                  <div className="flex flex-row gap-2 bg-base-200 hero rounded-md p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>

                    <span
                      contentEditable={true}
                      className="w-full focus:outline-none mx-5
                        overflow-hidden 
                        "
                      onInput={(e) => {
                        setCurrentMessageContent(e.target.innerText);
                      }}
                      onFocus={(e) => {
                        //@ts-ignore
                        e.target.innerText = "";
                      }}
                    >
                      Send a message
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7"
                      onClick={createMesaage}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="justify-center  p-2    flex flex-col mt-[200px]">
                <h1 className="text-2xl font-bold">Select a message </h1>
                <p className="text-sm">
                  Open existing messages, or start a new conversation with a
                  group or individual.
                </p>
                <button
                  onClick={() => {
                    //@ts-ignore
                    document.getElementById("createChat").showModal();
                  }}
                  className="bg-[#1a4173] text-white rounded-full p-5 w-fit mt-5"
                >
                  Start a new conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="xl:hidden lg:hidden md:hidden mt-2 mx-2 border-slate-200 overflow-auto">
        {ActiveMessageChannel || MessageChannels.length > 0 ? (
          ActiveMessageChannel ? (
            <div>
              <div
                className="scroll overflow-auto"
                style={{
                  height: "calc(100vh - 210px)",
                  width: "100%",
                }}
              >
                {Messages.length > 0 ? (
                  Messages.map((message, index) => {
                    return message.owner === api.authStore.model().id ? (
                      <div
                        id={`message-${message.id}`}
                        className={`chat chat-start`}
                        style={{
                          ...(index === Messages.length - 1
                            ? { marginBottom: "100px" }
                            : {}),
                        }}
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt={message.expand.owner.username}
                              src={api.cdn.url({
                                collection: "users",
                                id: message.owner,
                                file: message.expand.owner.avatar,
                              })}
                            />
                          </div>
                        </div>
                        <div className="chat-header mx-5">
                          {message.expand.owner.username}
                          <time className="text-xs opacity-50 mx-5">
                            {new Date(message.created).toLocaleTimeString()}
                          </time>
                        </div>
                        <div className="chat-bubble border-none rounded-full">
                          {message.content}
                        </div>
                        <div className="chat-footer opacity-50">Delivered</div>
                      </div>
                    ) : (
                      <div
                        id={`message-${message.id}`}
                        className="chat chat-end w-full"
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt={message.expand.owner.username}
                              src={api.cdn.url({
                                collection: "users",
                                id: message.owner,
                                file: message.expand.owner.avatar,
                              })}
                            />
                          </div>
                        </div>
                        <div className="chat-header">
                          {message.expand.owner.username}
                          <time className="text-xs opacity-50 mx-5">
                            {new Date(message.created).toLocaleTimeString()}
                          </time>
                        </div>
                        <div className="chat-bubble rounded-full">
                          {message.content}
                        </div>
                        <div className="chat-footer opacity-50">
                          Seen at 12:46
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <h1>Start a conversation</h1>
                  </>
                )}
              </div>
              <div
                className={`
                 absolute bottom-0  left-0 right-0 p-3
                    ${
                      theme === "dark"
                        ? "border border-l-0 border-r-0 border-[#313131]  bg-[#121212]"
                        : "  bg-white"
                    }
                    `}
              >
                <div className="flex flex-row gap-2 bg-base-200 hero rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>

                  <span
                    contentEditable={true}
                    className="w-full focus:outline-none mx-5
                        overflow-hidden 
                        "
                    onInput={(e) => {
                      setCurrentMessageContent(e.target.innerText);
                    }}
                    onFocus={(e) => {
                      //@ts-ignore
                      e.target.innerText = "";
                    }}
                  >
                    Send a message
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                    onClick={createMesaage}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </div>
              </div>
              <BottomNav {...props} />
            </div>
          ) : (
            <>
              <input
                type="text"
                id="search"
                className="w-full p-3 rounded-full"
                placeholder="Search Direct Messages"
              />
              <br></br>

              <div className="mt-5">
                {MessageChannels.map((channel) => {
                  return (
                    <div
                      onClick={() => {
                        setActiveMessageChannel(channel);
                        if (channel.expand.hasOwnProperty("messages")) {
                          setMessages(channel.expand.messages);
                        } else {
                          setMessages([]);
                        }
                      }}
                      key={channel.id}
                      className={`flex flex-row gap-2  first-letter:
                     
                    ${
                      theme === "dark"
                        ? "hover:bg-[#11111175]"
                        : "hover:bg-[#f9f9f9]"
                    }
                        cursor-pointer`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex hero">
                          <img
                            src={api.cdn.url({
                              collection: "users", 
                              id: channel.expand.members[0].id === api.authStore.model().id ? channel.expand.members[1].id : channel.expand.members[0].id,
                              file: channel.expand.members[0].avatar === api.authStore.model().avatar ? channel.expand.members[1].avatar : channel.expand.members[0].avatar,
                            })}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flexmt-2 flex-col gap-2">
                            <p className="text-md  font-bold mx-2 first-letter:uppercase">
                              {channel.expand.members[0].username ===
                              api.authStore.model().username
                                ? channel.expand.members[1].username
                                : channel.expand.members[0].username}
                                &nbsp;
                                @ {channel.expand.members[0].username === api.authStore.model().username ? channel.expand.members[1].username : channel.expand.members[0].username}
                            </p>
                            <p className="text-md mx-2">
                              {channel.expand.messages && channel.expand.messages.length > 0
                                ? channel.expand.messages[channel.expand.messages.length - 1].content
                                : "Start a conversation"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        ) : (
          <div className=" flex flex-col gap-2 mt-12 p-5 h-full">
            <h1 className="text-2xl font-bold">Welcome to your MailBox!</h1>
            <p className="text-sm">
              Drop some memes, share posts, and chat with friends with private
              conversations
            </p>
            <button
              onClick={() => {
                //@ts-ignore
                document.getElementById("createChat").showModal();
              }}
              className="bg-[#1a4173] text-white   rounded-full p-5 w-fit mt-2"
            >
              Start a new conversation
            </button>
          </div>
        )}
      </div>

      <dialog
        id="createChat"
        className={`dialog  
        ${
          theme === "dark" ? "bg-[#121212] text-white" : "bg-white text-black"
        }  
        `}
        style={{
          borderRadius: "10px",
        }}
      >
        <div
          className={`  
          ${
            theme === "dark" ? "bg-[#121212] text-white" : "bg-white text-black"
          }
          xl:w-[500px]  w-screen h-screen xl:h-80 lg:h-80 scroll lg:relative fixed top-0 left-0 xl:relative`}
        >
          <div className="flex justify-between hero p-2">
            {!isCreatingAGroup ? (
              <svg
                onClick={() => {
                  //@ts-ignore
                  document.getElementById("createChat").close();
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 cursor-pointer h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={() => {
                  setIsCreatingAGroup(false);
                }}
                className="w-7 h-7"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {isCreatingAGroup ? "Create a group" : "Start a new conversation"}
            <button className="btn btn-sm rounded-full">Next</button>
          </div>
          <div
            className={`flex hero gap-5 p-2 mt-5
          ${
            theme === "dark"
              ? "border border-l-0 border-r-0 border-[#313131] border-t-0"
              : "border border-[#eeeeee]"
          }
          `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <div
              id="search-people"
              contentEditable={true}
              className="w-full focus:outline-none "
              onInput={(e) => {
                setSearchQuery(e.target.innerText);
              }}
              onFocus={(e) => {
                //@ts-ignore
                e.target.innerText = "";
              }}
              onBlur={(e) => {
                //@ts-ignore
                e.target.innerText = isCreatingAGroup
                  ? "Add people to group"
                  : "Search People";
              }}
            >
              {isCreatingAGroup ? "Add people to group" : "Search People"}
            </div>
          </div>
          {!isCreatingAGroup && SearchResults.length < 1 && (
            <div
              className={`
                 p-3
                  ${
                    theme === "dark"
                      ? "border border-l-0 border-r-0 border-[#313131] border-t-0"
                      : "border border-[#eeeeee]"
                  }
                  `}
            >
              <button
                onClick={() => {
                  setIsCreatingAGroup(true);
                }}
                className="w-full flex  hero gap-2  "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-7 fill-blue-500 h-7"
                >
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                </svg>
                Create a group
                <div></div>
              </button>
            </div>
          )}

          <div className="flex flex-col">
            {SearchResults.map((result) => {
              return (
                <div
                  onClick={async () => {
                    if (!isCreatingAGroup) {
                      let channel = await api.create({
                        collection: "chats",
                        cacheKey: `chat-${result.id}-${
                          api.authStore.model().id
                        }`,
                        invalidateCache: [`chats-${api.authStore.model().id}`],
                        expand: ["members", "messages"],
                        record: {
                          members: [result.id, api.authStore.model().id],
                          messages: [],
                          isGroupChat: false,
                        },
                      });
                      setActiveMessageChannel(channel);
                      setMessageChannels([...MessageChannels, channel]);
                      api.cacheStore.set(`chats-${api.authStore.model().id}`, [
                        ...MessageChannels,
                        channel,
                      ]);
                    }
                  }}
                  key={result.id}
                  className={`flex flex-row gap-2 p-3 first-letter:
                    ${
                      theme === "dark"
                        ? "border border-l-0 border-r-0 border-[#313131] border-t-0"
                        : "border border-[#cacaca]"
                    }
                    ${
                      theme === "dark"
                        ? "hover:bg-[#313131]"
                        : "hover:bg-[#f9f9f9]"
                    }
                            cursor-pointer`}
                >
                  <img
                    src={api.cdn.url({
                      collection: "users",
                      id: result.id,
                      file: result.avatar,
                    })}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{result.username}</p>
                    <p className="text-sm">{result.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </dialog>
    </Page>
  );
}
