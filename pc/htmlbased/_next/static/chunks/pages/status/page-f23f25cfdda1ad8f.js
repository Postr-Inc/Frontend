(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[113],{5604:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/status/page",function(){return s(8767)}])},8767:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return m}});var a=s(5893),n=s(2545),l=s(230),c=s(5415),o=s(2506),r=s(7294),d=s(3054),i=s(8565);function m(e){let[t,s]=(0,r.useState)(null);return(0,r.useEffect)(()=>{e.params.hasOwnProperty("post")?s(e.params.post):n.h.read({collection:e.type||e.params.type,id:e.id||e.params.id,cacheKey:"".concat(e.type||e.params.type,"-").concat(e.id||e.params.id,"-status"),expand:["author","comments","comments.user","likes","followers","following","repost.author","views"]}).then(e=>{s(e)})},[]),(0,r.useEffect)(()=>{if(t){window.engamentReferer=t.id;let a=t.views;a.includes(n.h.authStore.model().id)||(a.push(n.h.authStore.model().id),n.h.update({collection:"posts",id:e.id||e.params.id,cacheKey:"".concat(e.type||e.params.type,"-").concat(e.id||e.params.id,"-status"),invalidateCache:["user-home-feed-".concat(n.h.authStore.model().id),"user-feed-posts-1-".concat(t.author)],record:{views:a}}).then(e=>{s({...t,views:a})})),document.title="".concat(t.expand.author.username.charAt(0).toUpperCase()+t.expand.author.username.slice(1),' on Postr "').concat(t.content.slice(0,20),'..." - Postr')}},[t]),console.log(t),(0,a.jsxs)("div",{className:" relative xl:flex  2xl:w-[80vw]  lg:flex w-full  justify-center xl:mx-auto",children:[(0,a.jsx)(l.k,{...e}),(0,a.jsxs)("div",{className:"  xl:w-[35vw]\n         md:w-[50vw]  xl:mx-24 \n         ".concat("dark"==theme?"\n            ".concat(t&&t.comments.length>0&&"border-[#121212] border-2","\n            "):t&&t.comments.length>0&&"border-[#f8f7f7] border-2","\n         "),children:[(0,a.jsxs)("div",{className:"flex hero gap-5  p-2 xl:mx-5 lg:mx-5 md:mx-5 \n        ".concat("dark"==theme?"bg-black text-white":"bg-white text-black","    \n        w-full"),children:[(0,a.jsx)("div",{className:"\n        ".concat("dark"==theme?"bg-black text-white fill-white hover:border-slate-200":"hover:border-slate-200 hover:bg-white","\n        btn-ghost btn btn-circle btn-sm    "),children:(0,a.jsx)("span",{"data-tip":"Go back",className:"tooltip tooltip-bottom",children:(0,a.jsx)("svg",{onClick:()=>{let t=e.lastPage;e.swapPage(t)},viewBox:"0 0 24 24","aria-hidden":"true",className:"w-6 h-6 cursor-pointer  xl:w-6 xl:h-6 ",children:(0,a.jsx)("g",{children:(0,a.jsx)("path",{d:"M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"})})})})}),(0,a.jsx)("h1",{children:e.type.charAt(0).toUpperCase()+e.type.slice(1)})]}),(0,a.jsxs)("div",{className:" mt-5",children:[t?(0,a.jsx)(o.Z,{...t,showFullDate:!0,showFullContent:!0,actions:{clicks_user_profile:()=>{window.referedFrom="status_"+t.id}},cacheKey:"".concat(e.type||e.params.type,"-").concat(e.id||e.params.id,"-status"),...e}):(0,a.jsx)("div",{children:(0,a.jsx)("div",{className:"flex flex-col gap-5 w-full",children:(0,a.jsx)(c.g,{})})}),t?(0,a.jsx)("div",{children:(0,a.jsx)("div",{className:"flex flex-col  w-full",children:t.expand.comments&&t.expand.comments.length>0?t.expand.comments.map(s=>(console.log(s),(0,a.jsx)("div",{style:{borderTop:"dark"==theme?"1px solid #121212":"1px solid #f8f7f7"},className:"\n                                         \n                                        ",children:(0,a.jsx)(d.Z,{...s,currentPage:e.currentPage,post:t,user:s.expand.user,statusPage:!0})},s.id))):(0,a.jsxs)("div",{className:"mx-auto justify-center w-full flex mt-2 hero flex-col",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold text-center",children:"No Comments \uD83D\uDE22"}),(0,a.jsx)("p",{className:"text-gray-500 text-sm  text-center prose w-[300px] break-normal mt-6 ",children:"Be the first to comment on this post."})]})})}):""]})]}),(0,a.jsx)(l.h,{...e}),(0,a.jsx)("div",{className:"xl:hidden lg:hidden",children:(0,a.jsx)(i.L,{...e})})]})}},5415:function(e,t,s){"use strict";s.d(t,{g:function(){return l}});var a=s(5893),n=s(7294);let l=(0,n.memo)(function(e){return(0,a.jsxs)("div",{className:"flex  flex-col gap-4 w-full \n     \n    xl:p-2  lg:p-2 md:p-2\n    ".concat(e.media?"rounded h-44 p-0":"mb-16"),children:[e.media?(0,a.jsx)("div",{className:"skeleton \n      ".concat(e.className?e.className:"h-42","\n      ").concat(e.media?"rounded":"rounded-none","\n      w-full")}):null,e.hiderows?null:(0,a.jsx)(a.Fragment,{children:(0,a.jsxs)("div",{className:"flex gap-4 items-center",children:[(0,a.jsx)("div",{className:"skeleton\n    ".concat(e.page&&"home"==e.page?"w-16 h-16":" w-12 h-12","\n    rounded  shrink-0")}),(0,a.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,a.jsx)("div",{className:"skeleton h-4 w-32 "}),(0,a.jsx)("div",{className:"skeleton h-4 w-32"})]})]})})]})})}},function(e){e.O(0,[774,545,355,888,179],function(){return e(e.s=5604)}),_N_E=e.O()}]);