(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[773],{374:function(e,l,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/user/user",function(){return t(967)}])},967:function(e,l,t){"use strict";t.r(l),t.d(l,{default:function(){return m}});var a=t(5893),s=t(7294),o=t(3257),r=t(738);function n(){return(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:[(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"}),(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"})]})}var i=t(2506),c=t(5415);let d=(0,s.memo)(function(e){let[l,t]=(0,s.useState)(!1),o=(0,s.useRef)(!1),r=(0,s.useCallback)(()=>{t(!0)},[]);return(0,s.useEffect)(()=>{if(o.current=!0,o.current){let l=new Image;l.src=e.src,l.onload=r}return()=>{o.current=!1}},[]),(0,a.jsxs)(a.Fragment,{children:[l?(0,a.jsx)("img",{onClick:()=>e.onClick?e.onClick():null,src:e.src,fetchPriority:"high",alt:e.alt,width:e.width,height:e.height,className:e.className}):(0,a.jsx)(c.g,{media:!0,hiderows:!0,className:e.className}),e.children?e.children:null]})});var h=t(2545),u=t(9866);function m(e){var l,t,c;let[m,x]=(0,s.useState)([]),[p,g]=(0,s.useState)(null),[f,w]=(0,s.useState)(null===(l=e.params.user)||void 0===l?void 0:l.banner),[v,b]=(0,s.useState)(1),[j,N]=(0,s.useState)([]),[k,y]=(0,s.useState)([]),[S,C]=(0,s.useState)(1),[L,M]=(0,s.useState)(0),[z,B]=(0,s.useState)(!0),[A,P]=(0,s.useState)("posts"),[V,F]=(0,s.useState)(null),[E,I]=(0,s.useState)(null),[_,R]=(0,s.useState)(null),[U,T]=(0,s.useState)(0),[W,Z]=(0,s.useState)(!1),[D,H]=(0,s.useState)(!1),[K,O]=(0,s.useState)(!1),Y=(0,s.useRef)(!1);(0,s.useLayoutEffect)(()=>{if(!Y.current){if(h.h.cacheStore.get("user-profile-".concat(e.params.user))){let l=JSON.parse(h.h.cacheStore.get("user-profile-".concat(e.params.user))).value;g(l),x(l.followers),w(l.banner),l.followers.map(e=>{h.h.authStore.model().following.includes(e.id)&&O(!0)});return}h.h.read({id:e.params.user,collection:"users",cacheKey:"user-profile-".concat(e.params.user),expand:["followers","following","following.followers"]}).then(l=>{h.h.cacheStore.set("user-profile-".concat(e.params.user),l,12e4),g(l),console.log(l.followers),x(l.followers),Z(!1),w(l.banner),l.followers.map(e=>{h.h.authStore.model().following.includes(e.id)&&O(!0)}),document.title="".concat(l.username," (@").concat(l.username,") | Postr")})}},[e.params.user]);let[J,X]=(0,s.useState)(!0),$=(0,s.useRef)(null),q=(0,s.useRef)(null),G=(0,s.useRef)(!1);function Q(e){P(e),"collections"!==e&&(b(1),function(e){let l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;X(!0);let t="posts"===e?'author.id ="'.concat(p.id,'"'):"likes"===e?'likes~"'.concat(p.id,'" && author.id != "').concat(p.id,'"'):"media"===e?'author.id ="'.concat(p.id,'" && file:length > 0  '):"";b(1),N([]),X(!0),h.h.list({collection:"posts"===e||"likes"===e?"posts":"media"===e?"posts":"",limit:10,filter:t,cacheKey:"user-feed-".concat(e,"-").concat(l,"-").concat(p.id),expand:["author","comments.user","user","post","post.author","author.followers","author.following","author.following.followers","author.following.following","repost","repost.author","likes"],page:1,sort:"posts"!==e?"-created":"-pinned, -created"}).then(l=>{"media"===e&&(l.items=l.items.filter(e=>e.file.length>0)),N(l.items),C(l.totalPages),M(l.totalItems),B(!0),setTimeout(()=>{X(!1)},"media"===A?1200:500)})}(e))}async function ee(){let l={};switch(!0){case p.username!==h.h.authStore.model().username&&p.username.length<3:case p.username!==h.h.authStore.model().username&&null==p.username.match(/^[a-zA-Z0-9_]*$/):try{if(await h.h.checkName(p.username)){alert("Username already exists.");return}}catch(e){console.log(e)}break;case 0!=p.bio.length&&p.bio.length<5:alert("Bio must be at least 10 characters");break;case 0!=p.social.length&&p.social.length<10:alert("Social links must be at least 10 characters")}p.username!==e.params.user.username&&(l.username=p.username),p.bio!==e.params.user.bio&&(l.bio=p.bio),p.location!==e.params.user.location&&(l.location=p.location),p.social!==e.params.user.social&&(l.social=p.social),null!==E&&(l.banner={isFile:!0,update:!0,file:{data:await h.h.getAsByteArray(E),size:_.size,name:_.name,type:_.type}}),null!==V&&(l.avatar={isFile:!0,update:!0,file:{data:await h.h.getAsByteArray(V),size:V.size,name:V.name,type:V.type},name:V.name,type:V.type});try{var t;if(Object.keys(l).length>0){H(!0);let e=await h.h.update({collection:"users",id:p.id,immediatelyUpdate:!0,invalidateCache:["user-profile-".concat(p.id)],record:l,cacheKey:"user-profile-".concat(h.h.authStore.model().id),expand:["followers","following","following.followers","following.following"]});h.h.cacheStore.delete("user-profile-".concat(h.h.authStore.model().id)),h.h.authStore.update(),g(e),w(e.banner),H(!1)}null===(t=document.getElementById("edit-modal"))||void 0===t||t.close()}catch(e){console.log(e)}}return window.onscroll=()=>{T(window.scrollY)},(0,s.useEffect)(()=>{if(G.current&&J){G.current=!0;return}if(e.params.scrollTo){let l=setInterval(()=>{let t=document.getElementById(e.params.scrollTo);t&&(t.scrollIntoView({behavior:"smooth",block:"center"}),t.className="xl:mt-0 w-full    xl:p-3  xl:mb-0 mb-6   ".concat("user"!==e.page&&"bookmarks"!==e.page&&"home"!==e.page?"xl:p-5 sm:p-2":"home"==e.page?"xl:p-5  ":"","\n          animate-pulse\n          "),setTimeout(()=>{t.className="xl:mt-0 w-full    xl:p-3  xl:mb-0 mb-6   ".concat("user"!==e.page&&"bookmarks"!==e.page&&"home"!==e.page?"xl:p-5 sm:p-2":"home"==e.page?"xl:p-5  ":"")},4e3),clearInterval(l))},1e3)}return window.scrollTo({top:0,behavior:"smooth"}),h.h.list({collection:"posts",limit:10,filter:'author.id ="'.concat(e.params.user,'"'),cacheKey:"user-feed-".concat(A,"-").concat(v,"-").concat(e.params.user),expand:["author","comments.user","user","post","post.author","author.followers","author.following","author.following.followers","author.following.following","repost","repost.author","likes"],page:1,sort:"-pinned, -created"}).then(e=>{"posts"===A&&(e.items=e.items.sort((e,l)=>l.pinned-e.pinned)),N(e.items),C(e.totalPages),M(e.totalItems),B(!0),X(!1)}),()=>{G.current=!1}},[e.params.user]),(0,a.jsx)(u.Z,{...e,children:(0,a.jsxs)("div",{children:[U>1050&&j.length>0?(0,a.jsxs)("div",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),className:"fixed z-[999] cursor-pointer top-24 p-3 w-fit h-10  xl:top-24 border border-slate-200 shadow hover:font-bold  translate-x-0 inset-x-0  mx-auto flex hero gap-2 text-white    rounded-full bg-[#43b1f1]\n          ",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",className:"w-5 h-5",children:(0,a.jsx)("path",{fillRule:"evenodd",d:"M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z",clipRule:"evenodd"})}),"Scroll to top"]}):null,(0,a.jsxs)("div",{className:"flex   xl:mx-24     text-md   \n       relative \n       xl:w-[35vw]\n       md:w-[80vw] flex-col ".concat("dark"==theme?"xl:border xl:border-[#121212]":"xl:border xl:border-[#f9f9f9] ","  lg:w-[50vw]  "),children:[(0,a.jsxs)("div",{className:"flex p-3 hero sticky top-0 z-[9999] ".concat("dark"===theme?"bg-black":"bg-white"," justify-between"),children:[(0,a.jsx)("div",{className:"hover:border-slate-200   btn-ghost btn btn-circle btn-sm \n        ".concat("dark"===theme?"bg-black hover:bg-black":"bg-white hover:bg-white","  \n        "),children:(0,a.jsx)("svg",{onClick:()=>{let l=e.lastPage;e.swapPage(l)},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"xl:w-6 xl:h-6 w-5 h-5 cursor-pointer   ",children:(0,a.jsx)("path",{"fill-rule":"evenodd",d:"M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z","clip-rule":"evenodd"})})}),(0,a.jsx)("div",{className:"flex flex-col gap-2",children:(0,a.jsxs)("p",{className:"text-1xl ",children:["@",p&&(null==p?void 0:p.username)||"loading"]})}),(0,a.jsxs)("div",{className:"dropdown dropdown-end",children:[(0,a.jsx)("div",{tabIndex:0,role:"button",className:"m-1",children:(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",className:"w-5 h-5",children:(0,a.jsx)("path",{d:"M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"})})}),(0,a.jsx)("ul",{tabIndex:0,className:"dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl ".concat("dark"==theme?"border border-[#121212]":"border border-slate-200"),children:p&&p.id!==h.h.authStore.model().id?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("li",{children:(0,a.jsxs)("a",{className:"flex hero gap-2 font-bold",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"})}),"Mute ",p?p.username:""]})}),(0,a.jsx)("li",{children:(0,a.jsxs)("a",{className:"flex hero gap-2 font-bold",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"})}),"Report ",p?p.username:""]})})]}):(0,a.jsx)(a.Fragment,{})})]})]}),(0,a.jsxs)("div",{className:"relative h-44 flex  mt-2 flex-col gap-4",children:[""!==f&&p?(0,a.jsx)("img",{src:h.h.cdn.url({id:p.id,file:f,collection:"users"}),alt:"",className:"w-full h-full sm:h-32 object-cover"}):(0,a.jsx)("div",{className:"w-full h-full bg-gray-300"}),(0,a.jsxs)("div",{className:"flex justify-between sm:mb-6 xsm:mb-6 relative w-full",children:[(0,a.jsx)("div",{className:"indicator w-24  ",children:p&&p.avatar?(0,a.jsx)("img",{src:h.h.cdn.url({id:p.id,file:p.avatar,collection:"users"}),alt:p.username,className:" w-24  h-24     rounded object-cover avatar  absolute bottom-[-3vh] left-2   border-2 border-double shadow   border-white"}):(0,a.jsx)("div",{className:"avatar placeholder   absolute bottom-[-3vh] left-2",children:(0,a.jsx)("div",{className:"bg-base-200 text-black rounded w-24  h-24   avatar    border-2   shadow   border-white",children:(0,a.jsx)("span",{className:"text-2xl",children:p&&p.username.charAt(0).toUpperCase()||"U"})})})}),(0,a.jsxs)("div",{className:"absolute right-2 flex gap-5 ",children:[p&&p.id!==h.h.authStore.model().id?(0,a.jsx)(a.Fragment,{children:(0,a.jsx)("button",{className:"btn border-none text-white hover:bg-black  btn-sm rounded-full bg-black",children:"Message"})}):"",(0,a.jsx)("button",{onClick:()=>{var e,l;p.id===h.h.authStore.model().id?null===(l=document)||void 0===l||null===(e=l.getElementById("edit-modal"))||void 0===e||e.showModal():!0===m.includes(h.h.authStore.model().id)?(x(m.filter(e=>e!=h.h.authStore.model().id)),h.h.update({collection:"users",id:p.id,cacheKey:"user-".concat(p.id),invalidateCache:["user-profile-".concat(p.id)],immediatelyUpdate:!0,expand:["followers","following","following.followers","following.following"],record:{followers:m.filter(e=>e!=h.h.authStore.model().id)}}).then(e=>{console.log(e),h.h.update({collection:"users",id:h.h.authStore.model().id,invalidateCache:["user-home-".concat(h.h.authStore.model().id)],immediatelyUpdate:!0,cacheKey:"user-".concat(h.h.authStore.model().id),expand:["followers","following","following.followers","following.following"],record:{following:h.h.authStore.model().following.filter(e=>e!=p.id)}}).then(e=>{h.h.authStore.update()})})):(x([...m,h.h.authStore.model().id]),h.h.update({collection:"users",id:p.id,cacheKey:"user-".concat(p.id),invalidateCache:["user-profile-".concat(p.id)],immediatelyUpdate:!0,expand:["followers","following","following.followers","following.following"],record:{followers:[...p.followers,h.h.authStore.model().id]}}).then(e=>{h.h.notify.send({title:"New Follower",body:"".concat(h.h.authStore.model().username," followed you."),recipient:p.id,icon:h.h.cdn.url({id:h.h.authStore.model().id,file:h.h.authStore.model().avatar,collection:"users"})}),h.h.update({collection:"users",cacheKey:"user-".concat(h.h.authStore.model().id),id:h.h.authStore.model().id,invalidateCache:["user-home-".concat(h.h.authStore.model().id)],immediatelyUpdate:!0,expand:["followers","following","following.followers","following.following"],record:{following:[...h.h.authStore.model().following,p.id]}}).then(e=>{h.h.authStore.update()})}))},className:"btn border-none  \n                ".concat("dark"===theme?"hover:bg-white bg-white text-black":"hover:bg-black bg-black text-white","\n                btn-sm rounded-full  "),children:p&&p.id===h.h.authStore.model().id?"Edit Profile":m.includes(h.h.authStore.model().id)?"Unfollow":"Follow"})]})]})]}),(0,a.jsxs)("div",{className:"justify-between relative text-sm mt-[8vh] sm:mt-2 mx-4",children:[(0,a.jsxs)("div",{className:"flex w-full  hero gap-3",children:[(0,a.jsx)("p",{className:"text-2xl font-bold",children:p&&p.username||"loading"}),p&&p.isVerified?(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-8 fill-blue-500 text-white h-8",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"})}):"",p&&p.isDeveloper?(0,a.jsx)("div",{className:"tooltip    rounded tooltip-left","data-tip":"Postr Developer",children:(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-5   h-5",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"})})}):"",p&&p.plus_subscriber?(0,a.jsx)("div",{className:"tooltip z[-1]","data-tip":"Subscriber since ".concat(new Date(p.plus_subscriber_since).toLocaleDateString()),children:(0,a.jsx)("span",{className:"badge badge-outline badge-md text-sm border-blue-500 z-[-1] text-sky-500",children:"Postr+ Subscriber"})}):""]}),(0,a.jsxs)("p",{className:"opacity-45",children:["@",p&&p.username||"loading"]}),(0,a.jsx)("p",{className:"mt-3 tet-md w-full  ",children:p&&""!==p.bio?p.bio:"This user has not set a bio."}),(0,a.jsxs)("div",{className:"flex flex-wrap  gap-2",children:[(0,a.jsxs)("p",{className:"hero flex mt-4 gap-2 w-full",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"})}),"Joined"," ",p&&new Date(p.created).toLocaleDateString()||"loading"]}),(0,a.jsx)("div",{children:p&&""!==p.location?(0,a.jsxs)("p",{className:"mt-4 hero flex gap-2 w-full",children:[(0,a.jsx)(n,{})," ",(0,a.jsx)("span",{className:"text-md cursor-pointer font-medium",children:p.location})]}):""}),(0,a.jsx)("p",{children:p&&""!==p.social?(0,a.jsxs)("p",{className:"mt-4 hero flex gap-2 w-full",children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-5 h-5",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"})}),(0,a.jsx)("span",{className:"text-md cursor-pointer font-medium",children:(0,a.jsx)("span",{onClick:()=>{window.open(p.social)},className:"text-blue-500 text-md w-5/6  hover:underline",children:p.social.replace(/(^\w+:|^)\/\//,"")})})]}):""})]}),(0,a.jsxs)("div",{className:"flex gap-2 mt-2 mx-1",children:[(0,a.jsxs)("p",{className:" mt-2 text-md",children:[(0,a.jsxs)("span",{className:"font-bold",children:[" ",p&&p.following?p.following.length:0," "]}),"Following"]}),(0,a.jsxs)("p",{className:" mt-2 text-md",children:[(0,a.jsxs)("span",{className:"font-bold",children:[" ",void 0!==m?m.length:0," "]}),void 0!==m&&1===m.length?"Follower":"Followers"]})]})]}),(0,a.jsx)("div",{className:"hero w-fit flex",children:p&&(null===(t=p.expand)||void 0===t?void 0:t.followers)&&p.id!==h.h.authStore.model().id&&(null===(c=p.expand)||void 0===c?void 0:c.followers.length)>0?(0,a.jsxs)("div",{className:"avatar-group mx-3 -space-x-6 flex gap-8 text-sm   rtl:space-x-reverse",children:[p.expand.followers.map(e=>{if(h.h.authStore.model().following.includes(e.id))return(0,a.jsx)(a.Fragment,{children:e.avatar?(0,a.jsx)("div",{className:"avatar  rounded-full  ",children:(0,a.jsx)("div",{className:"w-4",children:(0,a.jsx)("img",{src:h.h.cdn.url({id:e.id,collection:"users",file:e.avatar}),alt:"",className:" object-cover"})})}):(0,a.jsx)("div",{className:"  placeholder avatar  rounded-full ",children:(0,a.jsx)("div",{className:"   ",children:(0,a.jsx)("span",{className:"text-2xl",children:e.username.charAt(0).toUpperCase()})})})})}),(0,a.jsx)("p",{className:" mt-1 opacity-70 hover:underline cursor-pointer",children:p&&p.expand.followers.length>1&&K?(0,a.jsxs)(a.Fragment,{children:["Followed by"," ",p.followers.map(l=>{if(h.h.authStore.model().following.includes(l.id))return(0,a.jsx)("a",{onClick:()=>{e.setParams({user:l.id}),e.swapPage("user")},className:"hover:underline cursor-pointer",children:l.username})})]}):""})]}):""}),(0,a.jsxs)("div",{className:"flex flex-row p-2 gap-2 justify-between    xl:border-[#f9f9f9] ",children:[(0,a.jsxs)("a",{role:"tab",onClick:()=>{"posts"!==A&&Q("posts")},className:"\n         p-2  cursor-pointer  ".concat("posts"===A?"active font-bold   ":"","\n      "),children:["Posts","posts"===A?(0,a.jsx)("div",{className:" rounded-md h-1 bg-blue-500"}):""]}),(0,a.jsxs)("a",{onClick:()=>{"replies"!==A&&Q("collections")},role:"tab",className:"  cursor-pointer  p-2  ".concat("replies"===A?"active  ":""),children:["Collections","collections"===A?(0,a.jsx)("div",{className:" rounded-md h-1 bg-blue-500"}):""]}),(0,a.jsxs)("a",{onClick:()=>{"media"!==A&&Q("media")},role:"tab",className:"\n         p-2  cursor-pointer ".concat("media"===A?"active font-bold  ":"","\n      "),children:["Media","media"===A?(0,a.jsx)("div",{className:" rounded-md h-1 bg-blue-500"}):""]}),(0,a.jsxs)("a",{onClick:()=>{"likes"!==A&&Q("likes")},role:"tab",className:"\n       p-2  cursor-pointer ".concat("likes"===A?"active font-bold":"","\n      "),children:["Likes","likes"===A?(0,a.jsx)("div",{className:" rounded-md h-2 bg-blue-500"}):""]})]}),(0,a.jsx)(r.Z,{hasMore:z,dataLength:j.length,next:function(){if(console.clear(),!0==v>=S){console.log("no more"),B(!1);return}"collections"!==A&&h.h.list({cacheKey:"user-feed-".concat(A,"-").concat(v+1,"-").concat(p.id),collection:"posts"===A?"posts":"likes"===A?"posts":"replies"===A?"comments":"media"===A?"posts":"",limit:10,filter:"posts"===A?'author.id ="'.concat(p.id,'" && pinned=false'):"likes"===A?'likes?~"'.concat(p.id,'" && author.id != "').concat(p.id,'"'):"replies"===A?'user.id="'.concat(p.id,'" &&post.author.id!="').concat(p.id,'"'):"media"===A?'file:length > 0  && author.id ="'.concat(p.id,'"'):"",expand:["author","comments.user","user","post","post.author","author.followers","author.following","author.following.followers","author.following.following","repost","repost.author","likes"],sort:"-created",page:v+1}).then(e=>{"media"===A&&(e.items=e.items.filter(e=>e.file.length>0)),N([...j,...e.items]),B(!0),b(v+1)})},loader:"",children:(0,a.jsx)("div",{className:"media"!==A||J?"flex flex-col  xl:p-0 lg:p-0 md:p-0  mb-24 ":"grid grid-cols-3 gap-3   mb-24 xl:p-3 lg:p-3 md:p-3  sm:p-3 p-2",children:J?(0,a.jsx)("div",{className:"mx-auto W-full flex justify-center",children:(0,a.jsx)("span",{className:"loading loading-spinner-large loading-spinner mt-2 text-blue-600"})}):"posts"===A||"likes"===A?j.length>0?j.map((l,t)=>(0,a.jsx)("div",{style:{border:"dark"===theme?"1px solid #121212":"1px solid #f9f9f9"},className:t===j.length-1?"sm:mt-3":"",children:(0,s.createElement)(i.Z,{...l,user:p,page:e.page,params:e.params,swapPage:e.swapPage,setParams:e.setParams,cacheKey:p&&"user-feed-posts-".concat(v,"-").concat(p.id),key:l.id,setArray:N,array:j,pin:e=>{let a=j.find(l=>l.id===e);if(a.pinned){a.pinned=!1;let e=[...j];for(var s in e[t]=a,e=e.sort((e,l)=>new Date(l.created).getTime()-new Date(e.created).getTime()))e[s].pinned&&(e.unshift(e.splice(s,1)[0]),e=e.sort((e,l)=>{if(e.pinned&&l.pinned)return new Date(l.created).getTime()-new Date(e.created).getTime()}));h.h.update({collection:"posts",id:l.id,record:{pinned:!1},cacheKey:"user-feed-posts-".concat(v,"-").concat(p.id)}),N(e);return}a.pinned=!0;let o=[...j];o[t]=a,o.unshift(o.splice(t,1)[0]),h.h.update({collection:"posts",id:e,record:{pinned:!0},cacheKey:"user-feed-posts-".concat(v,"-").concat(p.id)}),N(o)},currentPage:v})})):(0,a.jsx)("div",{children:(0,a.jsxs)("p",{className:"text-center text-xl font-bold mt-10",children:[p&&p.id===h.h.authStore.model().id?"You":p&&p.username,"posts"===A?" haven't posted anything yet.":"likes"===A?" hasn't liked anything yet.":""]})}):"collections"===A?j.length>0?(0,a.jsx)("div",{className:"mt-5",children:"Coming Soon"}):0===j.length?(0,a.jsx)("div",{className:"text-center text-lg mt-10",children:(0,a.jsx)("p",{className:"font-extrabold ",children:h.h.authStore.model().id===p.id?"You haven't replied to anything yet.":"@".concat(p.username," hasn't replied to anyone yet")})}):"":"media"===A?j.length>0?j.map(e=>(0,a.jsx)(a.Fragment,{children:e.file.map(l=>{let t=l.replace(/\./g,"");return(0,a.jsxs)(a.Fragment,{children:[" ",(0,a.jsx)(d,{onClick:()=>{var e;null===(e=document.getElementById(t))||void 0===e||e.showModal()},src:h.h.cdn.url({id:e.id,collection:"posts",file:l}),height:"100%",width:"100%",alt:"",className:"w-full cursor-pointer   rounded-md h-44 object-cover"}),(0,a.jsx)(o.Z,{id:t,height:"h-[100vh]",children:(0,a.jsxs)("div",{className:"flex flex-col justify-center items-center h-full bg-[#121212]  relative",children:[(0,a.jsx)("svg",{onClick:()=>{var e;null===(e=document.getElementById(t))||void 0===e||e.close()},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",className:"w-6 h-6 cursor-pointer text-white absolute left-2 top-2",children:(0,a.jsx)("path",{d:"M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"})}),(0,a.jsx)("img",{src:h.h.cdn.url({id:e.id,collection:"posts",file:l}),alt:l,className:" w-full   object-contain mt-2 cursor-pointer"})]})})]})})})):Array.from(Array(10).keys()).map(e=>(0,a.jsx)(d,{src:"",height:"100%",width:"100%",alt:"",className:"w-full   rounded-md h-44 object-cover"})):""})}),(0,a.jsxs)(o.Z,{style:{borderRadius:"1rem"},id:"edit-modal",className:"".concat("dark"===theme?"bg-black":"bg-white","  p-0  rounded-lg  xl:rounded-box xl:max-w-[75vw] xl:h-[75vh] h-screen"),height:"xl:h-[75vh] xl:rounded-box xl:max-w-[75vw] h-screen",children:[(0,a.jsx)("div",{className:"mx-2 mt-3    p-0",children:(0,a.jsxs)("div",{className:"flex hero justify-between",children:[(0,a.jsx)("svg",{onClick:()=>{var e;null===(e=document)||void 0===e||e.getElementById("edit-modal").close()},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-5 h-5 cursor-pointer   ",children:(0,a.jsx)("path",{"fill-rule":"evenodd",d:"M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z","clip-rule":"evenodd"})}),(0,a.jsx)("p",{className:"text-1xl mx-8 mr-0",children:"Edit Profile"}),D?(0,a.jsx)("span",{className:"loading  loading-sm loading-spinner  text-blue-600"}):(0,a.jsx)("button",{className:"btn btn-sm rounded-full bg-black text-white ",onClick:()=>{console.log("saving"),ee()},children:"Save"})]})}),(0,a.jsx)("input",{type:"file",className:"hidden",id:"change-avatar",name:"change-avatar",accept:"image/*",onChange:e=>{if(console.log(e.target.files),e.target.files){let l=e.target.files[0];if(F(l),l){let e=new FileReader;e.onload=e=>{var l;q.current.src=null===(l=e.target)||void 0===l?void 0:l.result},e.readAsDataURL(l)}}}}),(0,a.jsx)("input",{type:"file",className:"hidden",id:"change-banner",name:"change-banner",accept:"image/*",onChange:e=>{if(e.target.files){let l=e.target.files[0];I(new Blob([l],{type:l.type})),R(l);let t=new FileReader;t.onload=e=>{var l;$.current.src=null===(l=e.target)||void 0===l?void 0:l.result},t.readAsDataURL(l)}}}),(0,a.jsxs)("div",{className:"flex flex-col croll   relative mt-4",children:[(0,a.jsxs)("div",{className:"relative h-24 mb-6   flex flex-col w-full gap-2",children:[p&&""!==p.banner||p&&null!==E?(0,a.jsxs)("div",{className:"relative h-[9rem]",children:[(0,a.jsx)("img",{src:null!==E?URL.createObjectURL(E):h.h.cdn.url({id:p.id,file:p.banner,collection:"users"}),ref:$,alt:"",className:"w-full h-full object-cover"}),(0,a.jsx)("div",{className:"absolute btn btn-circle bg-[#030303] bg-opacity-25  inset-x-0 mx-auto translate-x-0   left-[-2vw] text-white top-[30%]",children:(0,a.jsx)("label",{htmlFor:"change-banner",onClick:()=>{document.getElementById("change-banner").click()},children:(0,a.jsx)("button",{children:(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6  ",children:[(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"}),(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"})]})})})})]}):(0,a.jsxs)("div",{className:"relative h-32",children:[(0,a.jsx)("div",{className:"w-full h-36 object-cover bg-gray-300 "}),(0,a.jsx)("div",{className:"absolute btn btn-circle bg-[#030303] bg-opacity-25  inset-x-0 mx-auto translate-x-0   left-[-2vw] text-white top-[30%]",children:(0,a.jsx)("label",{htmlFor:"change-banner",onClick:()=>{document.getElementById("change-banner").click()},children:(0,a.jsx)("button",{children:(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6  ",children:[(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"}),(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"})]})})})})]}),p&&""!==e.params.user.avatar||p&&null!==V?(0,a.jsx)("div",{className:"absolute top-[80px] left-2",children:(0,a.jsxs)("div",{className:"relative w-32  ",children:[(0,a.jsx)("img",{src:V||h.h.cdn.url({id:p.id,collection:"users",file:p.avatar}),ref:q,alt:"",className:"w-20 h-20 object-cover avatar rounded  border-slate-200 border-2"}),(0,a.jsx)("label",{htmlFor:"change-avatar",onClick:()=>{document.getElementById("change-avatar").click()},children:(0,a.jsx)("div",{className:"text-white absolute btn btn-circle btn-sm bg-[#030303] bg-opacity-25 left-[25px] top-[26px] inset-x-0   translate-x-0",children:(0,a.jsx)("button",{children:(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6  ",children:[(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"}),(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"})]})})})})]})}):(0,a.jsx)("div",{className:"absolute top-[80px] left-5",children:(0,a.jsxs)("div",{className:"relative w-32  ",children:[(0,a.jsx)("div",{className:"w-20 h-20 object-cover bg-gray-300 avatar rounded border-slate-200 border-2"}),(0,a.jsx)("label",{htmlFor:"change-avatar",onClick:()=>{document.getElementById("change-avatar").click()},children:(0,a.jsx)("div",{className:"text-white absolute btn btn-circle btn-sm bg-[#030303] bg-opacity-50 left-[25px] top-[26px] inset-x-0   translate-x-0",children:(0,a.jsx)("button",{children:(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6  ",children:[(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"}),(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"})]})})})})]})})]}),(0,a.jsx)("div",{className:"mt-12  p-3 sm:scroll ",children:(0,a.jsxs)("div",{className:"relativ  flex flex-col gap-3  ",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{children:"Username"}),(0,a.jsx)("textarea",{className:"w-full h-12 p-2  mt-2 resize-none outline-none bg-transparent textarea   border-slate-200",placeholder:"Bio",...p?{value:p.username}:{},defaultValue:e.params.user.username,onChange:e=>{if(e.target.value.length>=15){g({...p,username:e.target.value.slice(0,15)});return}g({...p,username:e.target.value})}})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("label",{children:"Bio"}),(0,a.jsx)("textarea",{className:"w-full h-20 p-2 mt-2 resize-none outline-none bg-transparent textarea   border-slate-200",placeholder:"Bio",value:p&&p.bio,onChange:e=>{if(e.target.value.length>=160){g({...p,bio:e.target.value.slice(0,160)});return}g({...p,bio:e.target.value})},defaultValue:e.params.user.bio}),(0,a.jsxs)("p",{className:"absolute bottom-4 right-4 text-xs opacity-50",children:[p&&p.bio.length,"/",160]})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("label",{children:"Location"}),(0,a.jsx)("textarea",{className:"w-full h-12 p-2 mt-2 resize-none outline-none bg-transparent textarea   border-slate-200",placeholder:"Location",value:p&&p.location,onChange:e=>{if(e.target.value.length>=30){g({...p,location:e.target.value.slice(0,30)});return}g({...p,location:e.target.value})},defaultValue:e.params.user.location}),(0,a.jsxs)("p",{className:"absolute bottom-4 right-4 text-xs opacity-50",children:[p&&p.location.length,"/30"]})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsxs)("label",{children:["Social"," ",(0,a.jsx)("span",{className:"text-sm opacity-50",children:"(Strafe, Twitter, Instagram, Website.)"})]}),(0,a.jsx)("textarea",{className:"w-full h-12 p-2 mt-2 resize-none outline-none bg-transparent textarea   border-slate-200",placeholder:"Social",value:p&&p.social,onChange:e=>{if(e.target.value.length>=40){g({...p,social:e.target.value.slice(0,40)});return}g({...p,social:e.target.value})},defaultValue:e.params.user.social})]})]})})]})]})]})]})})}},5415:function(e,l,t){"use strict";t.d(l,{g:function(){return o}});var a=t(5893),s=t(7294);let o=(0,s.memo)(function(e){return(0,a.jsxs)("div",{className:"flex  flex-col gap-4 w-full \n     \n    xl:p-2  lg:p-2 md:p-2\n    ".concat(e.media?"rounded h-44 p-0":"mb-16"),children:[e.media?(0,a.jsx)("div",{className:"skeleton \n      ".concat(e.className?e.className:"h-42","\n      ").concat(e.media?"rounded":"rounded-none","\n      w-full")}):null,e.hiderows?null:(0,a.jsx)(a.Fragment,{children:(0,a.jsxs)("div",{className:"flex gap-4 items-center",children:[(0,a.jsx)("div",{className:"skeleton\n    ".concat(e.page&&"home"==e.page?"w-16 h-16":" w-12 h-12","\n    rounded  shrink-0")}),(0,a.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,a.jsx)("div",{className:"skeleton h-4 w-32 "}),(0,a.jsx)("div",{className:"skeleton h-4 w-32"})]})]})})]})})},9866:function(e,l,t){"use strict";t.d(l,{Z:function(){return i}});var a=t(5893),s=t(230),o=t(7294),r=t(3188),n=t(8565);function i(e){let[l,t]=(0,o.useState)(!1),[i,c]=(0,o.useState)(!1);return(0,a.jsxs)("div",{className:"relative xl:flex   lg:flex   2xl:w-[80vw]   justify-center xl:mx-auto    ",children:[(0,a.jsx)(s.k,{...e}),e.children,l&&!i?(0,a.jsx)("div",{onClick:()=>{c(!0)},className:"toast toast-end sm:toast-center  text-sm sm:hidden xsm:hidden  sm:top-0 ",children:(0,a.jsxs)("div",{className:"alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box",children:[(0,a.jsx)("span",{children:(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"})})}),(0,a.jsxs)("p",{children:["Poor connection detected.",(0,a.jsx)("p",{children:"Likely due to your internet connection."}),(0,a.jsx)("span",{className:"text-sm",children:" Click to Dismiss"})]})]})}):"",(0,a.jsx)(s.h,{params:e.params,setParams:e.setParams,currentPage:e.currentPage,swapPage:e.swapPage}),(0,a.jsx)(r.Z,{...e}),(0,a.jsx)("div",{className:"xl:hidden lg:hidden",children:(0,a.jsx)(n.L,{...e})})]},e.key)}}},function(e){e.O(0,[774,545,355,793,888,179],function(){return e(e.s=374)}),_N_E=e.O()}]);