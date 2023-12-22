"use server";
import { api } from "@/src/api/api";

export default async function fetchPosts(page:number, limit: Number, expand: string[], sort: string, collection: string, filter?: string,) {
     
     let res = await api.list({collection: collection, page:page, limit:limit, expand:expand, sort:sort, filter:filter})
     console.log(res)
}