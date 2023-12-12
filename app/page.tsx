"use client";
import Link from "next/link";
import Image from "next/image";
import Card from "@/src/components/front-page/card";
import Nav from '@/src/components/nav'
 

const Home  =  () =>{
  return(
<div>
<div className="w-full">
      <section className="flex flex-col min-h-[100vh]  ">
        <Nav/>
        <main className="flex flex-col mx-auto justify-center hero w-full">
          <section className="w-full py-6 mt-24 hero">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Open Source is simply{" "}
                  <span className="font-bold text-blue-600 underline-offset-4 underline"
                  ref={(e) => {
                    let words = ["better.", "safer.", " secure."];
                    if (e) {
                      e.innerHTML = words[Math.floor(Math.random() * words.length)];
                    }

                  }}
                  >
                    better.
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] opacity-50   md:text-xl dark:text-gray-400">
                  Join the community building a better social network.
                </p>
                <div className="flex gap-5">
                  <button
                    className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow opacity-90"
                    disabled={true}
                  >
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
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Coming Soon
                  </button>
                  <button className="btn bg-[#121212] hover:bg-[#1d1d1d] text-white rounded-lg shadow">
                    🛠️ Developer's
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-6 mt-24">
            <div className="container px-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"></h1>
            </div>
          </section>
        </main>
         
        <div className="flex flex-wrap flex-row flex-shrink-2 gap-5 xl:p-16  lg:p-16  ">
        <Card icon={"🔒"} title="Security" description="With manageable restrictions, you can control who can see your content and personal shared information."/>
        <Card icon={` 📦`} title="Open Source" description="Postr is open source, meaning you can contribute to the project and make it better for everyone."/>
     
        <Card icon={"👀"} title="Privacy First" description="Postr is built with privacy in mind. We want to make sure your data is safe and secure."/>
        </div>
      </section>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © Postr-inc all rights reserved
        </p>
        <nav className="mx-auto  flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy.pdf"  target="blank">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
        <div className="flex gap-5">
          <IconFacebook />
          <IconTwitter />
          <IconInstagram />
        </div>
      </footer>
    </div>
</div>
  )
}
export default function() {
  let isDesktop = !('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  && !window.matchMedia("(display-mode: standalone)").matches

 
  if(!isDesktop) return <Home/>;
  else{
    window.location.href = "/app"
  }
}

function IconFacebook(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

 

function IconInstagram(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconTwitter(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
