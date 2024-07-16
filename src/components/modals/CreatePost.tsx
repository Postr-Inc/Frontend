//@ts-nocheck
import { useEffect, useState } from "react";
import { api } from "@/src/api/api";
import Post from "../post";
export default function CreatePostModal(
    props: { setParams: any; swapPage: any } | any
) {
  const [text, setText] = useState("");
  let [postimgs, setPostimgs] = useState<{ name: any; type: any; size: any; data: Uint8Array; }[]>([]);
  const [posting, setPosting] = useState(false); 
  const params = window.postModalParemeters
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState({});
  let [isUploading, setIsUploading] = useState(false);
  let [isPoll, setIsPoll] = useState(false);
  let [pollOptions, setPollOptions] = useState([] as any);
  let [pollEnds, setPollEnds] = useState(new Date().getTime() + 1000 * 60 * 60 * 24);
  const maxlength = 280;
  const [postModalParams, setPostModalParams] = useState({} as any);
  window.setPostModalParams = (params: any) => {
    setPostModalParams(params);
  } 
  async function createPost() {
    let hasErrored = {
      message: "",
      id: "",
    };

    if (postimgs.length > 0) {
      postimgs = await Promise.all(postimgs.map(async (img: any) => {
        if (img.size > 1800000) {
          hasErrored.message = `One or more of your images are too large`;
          hasErrored.id = img.name;
          setErrors((errors: any) => [...errors, hasErrored]);
          return null;
        }
        let res = {
           name: img.name,
           type: img.type,
           size: img.size,
           data: await api.getAsByteArray(
            new Blob([img], { type: img.type }) as File
          )
        }
        return res;
      }));
      postimgs = postimgs.filter(img => img !== null);
    }

    switch (true) {
      case text.length < 1:
        setError({ message: "You must enter some text" });
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      case postimgs.length > 4:
        alert("You can only upload 4 images");
        return;
      case isUploading:
        return;
      default:
        try {
          setIsUploading(true);
          setPosting(true);
          let post = await api.create({
            collection: "posts",
            expand: ["repost", "author"], 
            record: {
              author: api.authStore.model().id,
              content: text, 
              ...(isPoll && {
                hasPoll: true,
                pollOptions,
                pollEnds,
                pollVotes: [],
               }),
              ...(postModalParams.type == "repost" ? { repost: postModalParams.post.id , isRepost: true } : {}),
              file: {
                isFile: true,
                file: await Promise.all(postimgs)
              },
              comments: [],
              likes: [],
            },
          }); 
          setPostimgs([]);
          setIsUploading(false);
          setText("");
          props.setParams({ id: post.id, type: "posts" });
          props.swapPage("view");
          //@ts-ignore
          typeof window != "undefined" &&
          //@ts-ignore
            document.getElementById("createPost")?.close();
          setPosting(false);
        } catch (error) {
          setIsUploading(false);
          setPosting(false);
          console.error(error);
        }
        break;
    }
  }
  useEffect(() => {
    if (Object.keys(postModalParams).length > 0) {
      //@ts-ignore
      document.getElementById("createPost")?.showModal();
    }
  }, [postModalParams]);
  return (
    <dialog
     
    style={{borderRadius: '10px', }}
    id="createPost"
    className={`sm:modal  sm:modal-middle    rounded-box
    
    `} 
  >
    <div  
    style={{borderRadius: '10px',  
      border: theme == 'dark' ? '1px solid #2d2d2d' : '1px solid #f9f9f9',
      }}
    className="sm:modal-box p-5 xl:w-[25vw]">
      <div className="flex hero justify-between">
        <p
          className="cursor-pointer hover:text-red-500"
          onClick={() => {
            //@ts-ignore
            document.getElementById("createPost")?.close();
            setPostModalParams({});
            setIsUploading(false);
            setPosting(false);
            setPostimgs([]);
          }}
        >
          Cancel
        </p>
        <button className="text-blue-500 text-md focus:outline-none">
          Drafts
        </button>
      </div>
      <div
        className={` py-4 flex flex-col 
      ${
        postimgs.length > 0
          ? text.length / maxlength > 1
            ? "h-96"
            : "h-100"
          : "h-32"
      }
      ;




      `}
        style={{ height: text.length  > 0 || postModalParams.type === "repost" ? "auto" : " " }}
      >
        <div className="flex flex-row      ">
          {api.authStore.model().avatar ? (
            <img
              src={api.authStore.img()}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="avatar placeholder">
              <div className="bg-base-300 text-black   avatar  w-10 h-10  border cursor-pointer rounded   border-white">
                <span className="text-2xl">
                  {api.authStore.model().username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="flex  flex-col mx-2 w-full mb-12">
          <textarea
            className="w-full h-full bg-transparent focus:outline-none resize-none"
            placeholder={postModalParams.type == "repost" ? `Add a comment` : "What's happening?" }
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></textarea>
            
             
          </div>
        </div>
        {
             postModalParams.type == "repost" ? (
               <div className={
                theme == 'dark' ? ' rounded-box border-[#121212] border ' : 'rounded-box border-[#d8d8d8]  border'
               } 
               >
                <Post 
               isCreating={true}
               notInteractable={true}
               {...postModalParams.post}
               expand={postModalParams.post.expand}
               {...props} 
                />
                </div>
             ) : ""
          }

        <div className="scroll overflow-y-hidden">
          {postimgs.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(postimgs).map((key: any) => {
                let hasErrored = false;
                console.log(errors);
                errors.find((err: any) => err.id == postimgs[key].name)
                  ? (hasErrored = true)
                  : (hasErrored = false);
                return (
                  <div className="relative  w-full" key={key}>
                    <img
                      src={URL.createObjectURL(postimgs[key])}
                      className={` object-cover w-32 h-32 rounded-md
                        xl:col-span-2 sm:col-span-1
                        ${
                          errors.find(
                            (err: any) => err.id == postimgs[key].name
                          )
                            ? "border-2 border-red-500 opacity-20"
                            : ""
                        }
                        `}
                    />

                    <div
                      onClick={() => {
                        setPostimgs(
                          postimgs.filter(
                            (img: any) => img.name !== postimgs[key].name
                          )
                        );
                      }}
                      className="absolute btn btn-circle btn-sm top-1 right-1"
                    >
                      X
                    </div>

                    {errors.find((err: any) => err.id == postimgs[key].name) ? (
                      <p
                        ref={(el: any) => {
                          if (el) {
                            el.innerHTML = errors.find(
                              (err: any) => err.id == postimgs[key].name
                            ).message;
                            setTimeout(() => {
                                setErrors(
                                    errors.filter(
                                    (err: any) => err.id !== postimgs[key].name
                                    )
                                );
                            }, 3000); 
                          }
                        }}
                        className="text-red-500  absolute top-9 left-2 text-sm"
                      ></p>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="divider mt-0 mb-2 before:bg-[#f6f4f4] after:bg-[#fdf9f9]  after:text-slate-200"></div>

      <div className="flex  h-full justify-between">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          multiple
          max={4}
          onChange={(e) => {
            //@ts-ignore
            Array.from(e.target.files).map((img) => {
              if (img.size > 2000000) {
                console.log("Too large", img.name);
                setErrors((errors: any) => {
                  return [
                    ...errors,
                    {
                      message: `
                 Quota exceeded
                 <br>
                 <br>
                This image will not be uploaded
                `,
                      id: img.name,
                    },
                  ];
                });
                return;
              }
            });
            //@ts-ignore
            if (e.target.files.length > 4) {
              setError({ message: `You can only upload 4 images` });
              return;
            }
            setPostimgs(Array.from(e.target.files as any));
            e.target.value = "";
          }}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-row gap-2"
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
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </label>
        <p className="  ">
          {text.length}/{maxlength}
        </p>
        {posting ? (
          <div className="loading loading-spinner text-blue-500"></div>
        ) : (
          <button
            onClick={() => {
              createPost();
            }}
            className="btn  btn-sm rounded-full "
          >
            Post
          </button>
        )}
      </div>
    </div>
  </dialog>
  )
}
