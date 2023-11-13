"use client";
import Image from 'next/image'
import Pocketbase from 'pocketbase'

export const api = new Pocketbase('https://bird-meet-rationally.ngrok-free.app')

export default function Home() {
  if (!api.authStore.isValid) window.location.href = "/login";
  return (
    <main className=" relative    p-5  w-screen  justify-center flex flex-col gap-8 mx-auto
    xl:w-[30vw] lg:w-[50vw]">
       


    </main>
  )
}
