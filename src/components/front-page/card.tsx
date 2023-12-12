"use client";
export default function Card(props){
    return(
        <div className="flex p-5 gap-5 mx-auto justify-center flex-wrap">
        <div className="card w-96 bg-base-200  ">
           
          <div className="card-body ">
            <span className="mx-auto flex justify-center bg-base-300  p-6 rounded-2xl text-4xl"
            ref={(e) => {
                if(e && props.icon){
                    e.innerHTML = props.icon
                }
              
            }}
            >
              
            </span>
            <h2 className="font-bold text-2xl text-center">
                {props.title}
            </h2>
            <p className="text-center">
                {props.description}
            </p>
             
          </div>
        </div>
        
      </div>
    )
}