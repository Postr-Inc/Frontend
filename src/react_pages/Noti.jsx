import Bottomnav from "../components/Bottomnav"
import { useState } from "react"
import { api } from "."
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
 
export default function Noti() {
    let [page, setPage] = useState(1);
    let [hasMore, setHasMore] = useState(true);
    let [posts, setPosts] = useState([]);
    return(
        <div className="p-2 w-screen">
            <h1 className="text-xl font-bold">Activity</h1>
            <div className="flex flex-row gap-4 mt-5  ">
                <button className="btn btn-ghost border border-slate-200 btn-sm w-[20vw]   ">All</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm   w-[20vw]">Likes</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm  w-[20vw] ">Comments</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm  w-[20vw] ">Mentions</button>
            </div>

            <div className="mt-5">
            </div>

            <div className="mt-8">
                <Bottomnav />
            </div>
        </div>
    )
}