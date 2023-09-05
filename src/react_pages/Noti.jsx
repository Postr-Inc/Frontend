import Bottomnav from "../components/Bottomnav"

 
export default function Noti() {
    return(
        <div className="p-2 w-screen">
            <h1 className="text-xl font-bold">Activity</h1>
            <div className="flex flex-row gap-4 mt-5">
                <button className="btn btn-ghost border border-slate-200 btn-sm w-5/6">All</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm  w-5/6">Likes</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm  w-5/6">Comments</button>
                <button className="btn btn-ghost border border-slate-200 btn-sm  w-5/6">Mentions</button>
            </div>
            <div className="mt-8">
                <Bottomnav />
            </div>
        </div>
    )
}