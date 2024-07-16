//@ts-nocheck
"use client";
import { Props } from "../../src/@types/types";
import { useEffect, useState } from "react";
import Page from "../../src/components/shared/Page";
export default function PostEngagements(
    props: Props
){
    if(typeof window === "undefined") return null;
    let [record, setRecord] = useState<any>(null);

    return(
        <Page {...props}>
<div className=" xl:w-[35vw]
         md:w-[50vw]  xl:p-0 p-2  mt-5  mx-auto flex flex-col gap-5">
            <h1>
                Post Engagements
            </h1>
         </div>
        </Page>
    )
}