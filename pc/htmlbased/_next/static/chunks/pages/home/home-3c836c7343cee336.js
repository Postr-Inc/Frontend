(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[53],{5669:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/home/home",function(){return o(3994)}])},3994:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return u}});var s=o(5893),l=o(7494);function n(e){return(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:e.fill||"none",viewBox:"0 0 24 24",strokeWidth:e.width||1.5,stroke:e.stroke||"currentColor",className:e.className,onClick:e.onClick,children:[(0,s.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"}),(0,s.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]})}var r=o(7294),a=o(738),i=o(708),c=o(8703),d=o(3446),h=o(8565);function u(e){var t;let[o,u]=(0,r.useState)(!1);(0,r.useEffect)(()=>{u(!0)},[]);let m=(0,r.useRef)(!1),[f,x]=(0,r.useState)([]),[g,w]=(0,r.useState)(0),[v,j]=(0,r.useState)(1),[b,S]=(0,r.useState)(!1),[N,y]=(0,r.useState)("following"),[T,E]=(0,r.useState)(!0),[L,k]=(0,r.useState)(window.scrollY),[P,_]=(0,r.useState)(!1),[C,D]=(0,r.useState)(!1);window.addEventListener("online",e=>{e.detail.online.get("latency")>2e3?_(!0):_(!1)});let[Y,M]=(0,r.useState)(!0);function R(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1],y(e),S(!0);let t="following"===e?'author.followers ?~"'.concat(c.h.authStore.model().id,'"'):"recommended"===e?' author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~ "').concat(c.h.authStore.model().id,'"'):"trending"===e?'likes:length > 5 && author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~"').concat(c.h.authStore.model().id,'"'):"";x([]),console.log(!0),c.h.list({collection:"posts",limit:10,filter:t,refresh:!0,refreshEvery:1200,cacheKey:"user-home-".concat(e,"-posts-1-").concat(c.h.authStore.model().id),expand:["author","comments.user","user","post","post.author","author.followers","author.following","author.following.followers","author.following.following"],page:0,sort:"-created"}).then(e=>{console.log(e),x(e.items),w(e.totalPages),M(!0),S(!1)})}async function F(){let{ratelimited:e,limit:t,duration:o,used:s}=await c.h.authStore.isRatelimited("list");switch(console.log(e,t,o,s),!0){case e:break;case v>=g:M(!1);break;default:let l="following"===N?'author.followers ?~"'.concat(c.h.authStore.model().id,'"'):"recommended"===N?' && author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~"').concat(c.h.authStore.model().id,'"'):"trending"===N?'likes:length > 5 && author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~"').concat(c.h.authStore.model().id,'"'):"";await c.h.list({collection:"posts",limit:10,page:v+1,cacheKey:"user-home-".concat(N,"-posts-").concat(v+1,"-").concat(c.h.authStore.model().id),filter:l,cacheTime:1200,expand:["author"],sort:"created"}).then(e=>{x([...f,...e.items]),w(e.totalPages),j(e=>e+1)}).catch(e=>{console.log(e)})}}return(0,r.useEffect)(()=>{if(S(!0),!m.current){var e,t;window.onscroll=()=>{k(window.scrollY)},j(1);let o="following"===N?' author.followers ~"'.concat(null===(e=c.h.authStore.model())||void 0===e?void 0:e.id,'"'):"recommended"===N?'likes:length > 1 && author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~"').concat(c.h.authStore.model().id,'"'):"trending"===N?'likes:length > 5 && author.id !="'.concat(c.h.authStore.model().id,'" && author.followers !~"').concat(c.h.authStore.model().id,'"'):"";c.h.list({collection:"posts",limit:10,page:1,cacheKey:"user-home-".concat(N,"-posts-1-").concat(null===(t=c.h.authStore.model())||void 0===t?void 0:t.id),cacheTime:1200,filter:o,expand:["author","comments.user","author.followers","author.following","author.following.followers","author.following.following","likes"],sort:"-created"}).then(e=>{w(e.totalPages),x(e.items),S(!1)})}return document.title="Postr - ".concat(N),()=>{m.current=!0}},[]),(0,r.useEffect)(()=>{document.title="Postr - ".concat(N.charAt(0).toUpperCase()+N.slice(1))},[N]),(0,s.jsx)(s.Fragment,{children:o?(0,s.jsxs)("div",{className:"relative xl:flex   lg:flex   xl:w-[80vw]   justify-center xl:mx-auto    ",children:[(0,s.jsx)(d.k,{...e}),(0,s.jsxs)("div",{className:" xl:mx-24     text-md    relative  xl:w-[35vw] md:w-[50vw]    xl:text-sm md:text-sm",children:[L>250&&f.length>10?(0,s.jsxs)("div",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),className:"fixed top-4 p-3 w-fit h-10 xl:top-[17rem]  z-[999] cursor-pointer  translate-x-0 inset-x-0  mx-auto flex hero gap-2 text-white    rounded-full bg-[#43b1f1]",children:[(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",className:"w-7 h-7",children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 11-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z",clipRule:"evenodd"})}),(0,s.jsx)("div",{className:"border-none    -space-x-2  flex",children:Array.from([,,,].keys()).map(e=>{let t=f[e];return(0,s.jsx)("div",{className:"flex hero gap-2",children:(0,s.jsx)("div",{className:"avatar border-none",children:(0,s.jsx)("div",{className:"w-8",children:(0,s.jsx)("img",{src:"\n                     ".concat(c.h.pbUrl,"/api/files/_pb_users_auth_/").concat(null==t?void 0:t.expand.author.id,"/").concat(null==t?void 0:t.expand.author.avatar,"\n                    "),alt:"avatar",className:"rounded-full object-contain w-full h-full"})})})})})})," ",(0,s.jsx)("p",{className:"text-sm",children:"posted"})]}):"",(0,s.jsxs)("div",{className:"  xl:sticky xl:top-0  border  border-[#f6f4f4]     w-[100%]  xl:z-[999] flex flex-col   bg-opacity-75 bg-white ",children:[(0,s.jsx)("div",{className:"flex xl:p-5 w-full sm:p-3  justify-between ",children:(0,s.jsx)("div",{className:"flex gap-2 hero",children:(0,s.jsx)("div",{className:"flex flex-col   w-full",children:(0,s.jsxs)("div",{className:"flex  justify-between gap-2 w-full",children:[(0,s.jsxs)("div",{className:"flex flex-row  gap-2  ",children:[(0,s.jsxs)("div",{className:"dropdown     ",children:[(0,s.jsx)("label",{tabIndex:0,children:(0,s.jsx)(s.Fragment,{children:(null===(t=c.h.authStore.model())||void 0===t?void 0:t.avatar)?(0,s.jsx)("img",{src:c.h.authStore.img(),alt:c.h.authStore.model().username,className:"rounded object-cover w-12 h-12 cursor-pointer"}):(0,s.jsx)("div",{className:"avatar placeholder",children:(0,s.jsx)("div",{className:"bg-base-300 text-black   avatar  w-16 h-16   border cursor-pointer rounded   border-white",children:(0,s.jsx)("span",{className:"text-2xl",children:c.h.authStore.model().username.charAt(0).toUpperCase()})})})})}),(0,s.jsxs)("ul",{tabIndex:0,className:"dropdown-content z-[1] menu   w-[16rem] shadow bg-base-100  rounded ",children:[(0,s.jsx)("li",{children:(0,s.jsx)("a",{onClick:()=>{e.setParams({user:c.h.authStore.model().id}),e.swapPage("user")},children:"View Profile"})}),c.h.authStore.model().postr_plus?(0,s.jsx)("li",{children:(0,s.jsxs)("a",{children:["Your benefits",(0,s.jsx)("span",{className:"badge badge-outline border-blue-500 text-blue-500",children:"++"})]})}):"",(0,s.jsx)("li",{children:(0,s.jsx)("a",{children:"Set Status"})}),(0,s.jsx)("li",{children:(0,s.jsxs)("a",{onClick:()=>{document.getElementById("logout-modal").showModal()},children:["Logout"," ",(0,s.jsxs)("span",{className:"font-bold",children:[" ","@",c.h.authStore.model().username]})]})})]})]}),(0,s.jsxs)("div",{className:"flex flex-col",children:[(0,s.jsx)("p",{className:"font-bold ",children:c.h.authStore.model().username}),(0,s.jsxs)("p",{className:"text-lg",children:["@",c.h.authStore.model().username+c.h.authStore.model().id.substring(0,4)]})]})]}),(0,s.jsxs)("div",{className:"flex gap-4",children:[(0,s.jsx)(l.Z,{className:"w-7 h-7 cursor-pointer",onClick:()=>{e.swapPage("bookmarks")}}),(0,s.jsx)(n,{onClick:()=>{e.swapPage("settings")},className:"w-7 h-7 cursor-pointer"})]})]})})})}),P&&!C?(0,s.jsx)("div",{className:"toast p-2  xl:hidden lg:hidden md:hidden toast-end relative sm:toast-center  text-sm ",onClick:()=>{D(!0)},children:(0,s.jsxs)("div",{className:"alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box",children:[(0,s.jsx)("span",{children:(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,s.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"})})}),(0,s.jsxs)("p",{children:["Poor connection detected.",(0,s.jsx)("p",{children:"Likely due to your internet connection."}),(0,s.jsx)("span",{className:"text-sm",children:" Click to Dismiss"})]})]})}):"",(0,s.jsxs)("div",{className:"flex hero sm:p-3 xl:p-5        justify-between xl:mt-0  ",children:[(0,s.jsxs)("div",{className:"flex flex-col text-sm",children:[(0,s.jsx)("p",{className:"cursor-pointer",onClick:()=>{R("following",0)},children:"Following"}),"following"===N?(0,s.jsx)("div",{className:" rounded-md   h-1 bg-blue-500"}):""]}),(0,s.jsxs)("div",{className:"flex flex-col",children:[(0,s.jsx)("p",{className:"cursor-pointer",onClick:()=>{R("recommended",0)},children:"Recommended"}),"recommended"===N?(0,s.jsx)("div",{className:" rounded-md   h-1 bg-blue-500"}):""]}),(0,s.jsxs)("div",{className:"flex flex-col",children:[(0,s.jsx)("p",{className:"cursor-pointer",onClick:()=>{R("trending",0)},children:"Trending"}),"trending"===N?(0,s.jsx)("div",{className:" rounded-md  h-1 bg-blue-500"}):""]})]})]}),(0,s.jsx)(a.Z,{className:"   xl:mt-0 z-[-1] mt-3   flex flex-col  w-full 0 xl:p-0     ",dataLength:f.length,hasMore:!0,next:F,loader:"",children:f.length>0?f.map(t=>(console.log(t),(0,s.jsx)("div",{className:"   xl:border   sm:p-3 border-[#f2f0f0]  ",id:t.id,children:(0,s.jsx)(i.Z,{cacheKey:"user-home-".concat(N,"-posts-").concat(v,"-").concat(c.h.authStore.model().id),...t,expand:t.expand,post:t,swapPage:e.swapPage,setParams:e.setParams,page:e.currentPage,currentPage:v})},t.id))):(0,s.jsx)(s.Fragment,{children:b?(0,s.jsx)("div",{className:"mx-auto flex justify-center",children:(0,s.jsx)("span",{className:"loading loading-spinner-large loading-spinner mt-5 text-blue-600"})}):b?"":(0,s.jsx)(s.Fragment,{children:"following"===N?(0,s.jsxs)("div",{className:"flex flex-col mt-6  justify-center",children:[(0,s.jsx)("p",{className:"text-center text-xl font-bold",children:"You're not following anyone."}),(0,s.jsx)("p",{className:"text-center text-sm",children:"Follow people to see their posts here."})]}):"recommended"===N?(0,s.jsx)("div",{className:"flex flex-col  justify-center",children:(0,s.jsxs)("p",{className:"text-center text-xl font-bold",children:["No recommended posts. :","("]})}):"trending"===N?(0,s.jsx)("div",{className:"flex flex-col  justify-center",children:(0,s.jsx)("p",{className:"text-center text-xl font-bold",children:"No trending posts."})}):(0,s.jsx)("div",{className:"flex flex-col  justify-center"})})})}),(0,s.jsx)("div",{className:"xl:hidden lg:hidden",children:(0,s.jsx)(h.L,{params:e.params,setParams:e.setParams,currentPage:e.currentPage,swapPage:e.swapPage})})]}),P&&!C?(0,s.jsx)("div",{onClick:()=>{D(!0)},className:"toast toast-end sm:toast-center  text-sm sm:hidden xsm:hidden  sm:top-0 ",children:(0,s.jsxs)("div",{className:"alert bg-[#f82d2df5] text-white  hero flex flex-row gap-2   font-bold shadow rounded-box",children:[(0,s.jsx)("span",{children:(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:(0,s.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"})})}),(0,s.jsxs)("p",{children:["Poor connection detected.",(0,s.jsx)("p",{children:"Likely due to your internet connection."}),(0,s.jsx)("span",{className:"text-sm",children:" Click to Dismiss"})]})]})}):"",(0,s.jsx)(d.h,{params:e.params,setParams:e.setParams,currentPage:e.currentPage,swapPage:e.swapPage}),(0,s.jsx)(p,{})]}):""})}function p(){return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)("dialog",{id:"logout-modal",className:" rounded-box   modal-middle bg-opacity-50   ",children:(0,s.jsxs)("div",{className:"flex p-5 xl:w-[15vw] h-[45vh] xl:h-[35vh] rounded-box items-center bg-white justify-center flex-col mx-auto",children:[(0,s.jsx)("img",{src:"/icons/icon-blue.jpg",className:"rounded",alt:"postr logo",width:40,height:40}),(0,s.jsx)("p",{className:"font-bold text-xl mt-2",children:"Loging out of Postr?"}),(0,s.jsx)("p",{className:"text-sm mt-2",children:"You can always log back in at any time."}),(0,s.jsx)("button",{className:"btn btn-ghost rounded-full w-full bg-black  text-white mt-5",onClick:()=>{c.h.authStore.clear()},children:"Logout"}),(0,s.jsx)("form",{method:"dialog",className:"w-full",children:(0,s.jsx)("button",{className:"btn btn-ghost mt-5 w-full rounded-full bg-base-200 ",children:"Cancel"})})]})})})}},738:function(e,t,o){"use strict";var s=o(7294),l=function(e,t){return(l=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])})(e,t)},n=function(){return(n=Object.assign||function(e){for(var t,o=1,s=arguments.length;o<s;o++)for(var l in t=arguments[o])Object.prototype.hasOwnProperty.call(t,l)&&(e[l]=t[l]);return e}).apply(this,arguments)},r={Pixel:"Pixel",Percent:"Percent"},a={unit:r.Percent,value:.8};function i(e){return"number"==typeof e?{unit:r.Percent,value:100*e}:"string"==typeof e?e.match(/^(\d*(\.\d+)?)px$/)?{unit:r.Pixel,value:parseFloat(e)}:e.match(/^(\d*(\.\d+)?)%$/)?{unit:r.Percent,value:parseFloat(e)}:(console.warn('scrollThreshold format is invalid. Valid formats: "120px", "50%"...'),a):(console.warn("scrollThreshold should be string or number"),a)}var c=function(e){function t(t){var o=e.call(this,t)||this;return o.lastScrollTop=0,o.actionTriggered=!1,o.startY=0,o.currentY=0,o.dragging=!1,o.maxPullDownDistance=0,o.getScrollableTarget=function(){return o.props.scrollableTarget instanceof HTMLElement?o.props.scrollableTarget:"string"==typeof o.props.scrollableTarget?document.getElementById(o.props.scrollableTarget):(null===o.props.scrollableTarget&&console.warn("You are trying to pass scrollableTarget but it is null. This might\n        happen because the element may not have been added to DOM yet.\n        See https://github.com/ankeetmaini/react-infinite-scroll-component/issues/59 for more info.\n      "),null)},o.onStart=function(e){!o.lastScrollTop&&(o.dragging=!0,e instanceof MouseEvent?o.startY=e.pageY:e instanceof TouchEvent&&(o.startY=e.touches[0].pageY),o.currentY=o.startY,o._infScroll&&(o._infScroll.style.willChange="transform",o._infScroll.style.transition="transform 0.2s cubic-bezier(0,0,0.31,1)"))},o.onMove=function(e){o.dragging&&(e instanceof MouseEvent?o.currentY=e.pageY:e instanceof TouchEvent&&(o.currentY=e.touches[0].pageY),o.currentY<o.startY||(o.currentY-o.startY>=Number(o.props.pullDownToRefreshThreshold)&&o.setState({pullToRefreshThresholdBreached:!0}),o.currentY-o.startY>1.5*o.maxPullDownDistance||!o._infScroll||(o._infScroll.style.overflow="visible",o._infScroll.style.transform="translate3d(0px, "+(o.currentY-o.startY)+"px, 0px)")))},o.onEnd=function(){o.startY=0,o.currentY=0,o.dragging=!1,o.state.pullToRefreshThresholdBreached&&(o.props.refreshFunction&&o.props.refreshFunction(),o.setState({pullToRefreshThresholdBreached:!1})),requestAnimationFrame(function(){o._infScroll&&(o._infScroll.style.overflow="auto",o._infScroll.style.transform="none",o._infScroll.style.willChange="unset")})},o.onScrollListener=function(e){"function"==typeof o.props.onScroll&&setTimeout(function(){return o.props.onScroll&&o.props.onScroll(e)},0);var t=o.props.height||o._scrollableNode?e.target:document.documentElement.scrollTop?document.documentElement:document.body;o.actionTriggered||((o.props.inverse?o.isElementAtTop(t,o.props.scrollThreshold):o.isElementAtBottom(t,o.props.scrollThreshold))&&o.props.hasMore&&(o.actionTriggered=!0,o.setState({showLoader:!0}),o.props.next&&o.props.next()),o.lastScrollTop=t.scrollTop)},o.state={showLoader:!1,pullToRefreshThresholdBreached:!1,prevDataLength:t.dataLength},o.throttledOnScrollListener=(function(e,t,o,s){var l,n=!1,r=0;function a(){l&&clearTimeout(l)}function i(){var i=this,c=Date.now()-r,d=arguments;function h(){r=Date.now(),o.apply(i,d)}n||(s&&!l&&h(),a(),void 0===s&&c>e?h():!0!==t&&(l=setTimeout(s?function(){l=void 0}:h,void 0===s?e-c:e)))}return"boolean"!=typeof t&&(s=o,o=t,t=void 0),i.cancel=function(){a(),n=!0},i})(150,o.onScrollListener).bind(o),o.onStart=o.onStart.bind(o),o.onMove=o.onMove.bind(o),o.onEnd=o.onEnd.bind(o),o}return!function(e,t){function o(){this.constructor=e}l(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}(t,e),t.prototype.componentDidMount=function(){if(void 0===this.props.dataLength)throw Error('mandatory prop "dataLength" is missing. The prop is needed when loading more content. Check README.md for usage');if(this._scrollableNode=this.getScrollableTarget(),this.el=this.props.height?this._infScroll:this._scrollableNode||window,this.el&&this.el.addEventListener("scroll",this.throttledOnScrollListener),"number"==typeof this.props.initialScrollY&&this.el&&this.el instanceof HTMLElement&&this.el.scrollHeight>this.props.initialScrollY&&this.el.scrollTo(0,this.props.initialScrollY),this.props.pullDownToRefresh&&this.el&&(this.el.addEventListener("touchstart",this.onStart),this.el.addEventListener("touchmove",this.onMove),this.el.addEventListener("touchend",this.onEnd),this.el.addEventListener("mousedown",this.onStart),this.el.addEventListener("mousemove",this.onMove),this.el.addEventListener("mouseup",this.onEnd),this.maxPullDownDistance=this._pullDown&&this._pullDown.firstChild&&this._pullDown.firstChild.getBoundingClientRect().height||0,this.forceUpdate(),"function"!=typeof this.props.refreshFunction))throw Error('Mandatory prop "refreshFunction" missing.\n          Pull Down To Refresh functionality will not work\n          as expected. Check README.md for usage\'')},t.prototype.componentWillUnmount=function(){this.el&&(this.el.removeEventListener("scroll",this.throttledOnScrollListener),this.props.pullDownToRefresh&&(this.el.removeEventListener("touchstart",this.onStart),this.el.removeEventListener("touchmove",this.onMove),this.el.removeEventListener("touchend",this.onEnd),this.el.removeEventListener("mousedown",this.onStart),this.el.removeEventListener("mousemove",this.onMove),this.el.removeEventListener("mouseup",this.onEnd)))},t.prototype.componentDidUpdate=function(e){this.props.dataLength!==e.dataLength&&(this.actionTriggered=!1,this.setState({showLoader:!1}))},t.getDerivedStateFromProps=function(e,t){return e.dataLength!==t.prevDataLength?n(n({},t),{prevDataLength:e.dataLength}):null},t.prototype.isElementAtTop=function(e,t){void 0===t&&(t=.8);var o=e===document.body||e===document.documentElement?window.screen.availHeight:e.clientHeight,s=i(t);return s.unit===r.Pixel?e.scrollTop<=s.value+o-e.scrollHeight+1:e.scrollTop<=s.value/100+o-e.scrollHeight+1},t.prototype.isElementAtBottom=function(e,t){void 0===t&&(t=.8);var o=e===document.body||e===document.documentElement?window.screen.availHeight:e.clientHeight,s=i(t);return s.unit===r.Pixel?e.scrollTop+o>=e.scrollHeight-s.value:e.scrollTop+o>=s.value/100*e.scrollHeight},t.prototype.render=function(){var e=this,t=n({height:this.props.height||"auto",overflow:"auto",WebkitOverflowScrolling:"touch"},this.props.style),o=this.props.hasChildren||!!(this.props.children&&this.props.children instanceof Array&&this.props.children.length),l=this.props.pullDownToRefresh&&this.props.height?{overflow:"auto"}:{};return s.createElement("div",{style:l,className:"infinite-scroll-component__outerdiv"},s.createElement("div",{className:"infinite-scroll-component "+(this.props.className||""),ref:function(t){return e._infScroll=t},style:t},this.props.pullDownToRefresh&&s.createElement("div",{style:{position:"relative"},ref:function(t){return e._pullDown=t}},s.createElement("div",{style:{position:"absolute",left:0,right:0,top:-1*this.maxPullDownDistance}},this.state.pullToRefreshThresholdBreached?this.props.releaseToRefreshContent:this.props.pullDownToRefreshContent)),this.props.children,!this.state.showLoader&&!o&&this.props.hasMore&&this.props.loader,this.state.showLoader&&this.props.hasMore&&this.props.loader,!this.props.hasMore&&this.props.endMessage))},t}(s.Component);t.Z=c}},function(e){e.O(0,[774,703,446,74,888,179],function(){return e(e.s=5669)}),_N_E=e.O()}]);