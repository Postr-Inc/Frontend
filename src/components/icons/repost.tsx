//@ts-nocheck
export default function Repost(props: {
  originalAuthor: string;
  originalPostID: string; 
  cacheKey: string;
  post: any;
}) { 
    return  <div className="    p-2 "
    
    onClick={() => { 
        window.setPostModalParams({...props, type: 'repost'})
    }}
    >

 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
     className="  
     hover:rounded-full hover:bg-green-400 hover:bg-opacity-20   hover:text-green-600 cursor-pointer p-1 w-8 h-8
     ">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
  </svg>
  </div>
  
}