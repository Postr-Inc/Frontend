"use client";
import { useRef, useCallback, useState, useEffect , memo} from "react";
import { Loading } from "./icons/loading";

 
export const LazyImage = memo(function LazyImage(props: {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    className: string;
    onClick?: Function;
    children?: any;
}){

    const [loaded, setLoaded] = useState(false);
    let initialized = useRef(false);

    const handleImageLoaded = useCallback(() => {
        setLoaded(true);
    }, []);

    

    useEffect(() => { 
        if (typeof window !== "undefined") {
            initialized.current = true;
        }

        if (initialized.current) {
            let img = new Image();
            img.src = props.src;
            img.onload = handleImageLoaded;
        }

        return () => {
            initialized.current = false;
        };
        
    }, []);

    return (
        <> 
        {
            !loaded ? <Loading media={true} hiderows={true}
           className={props.className}
            ></Loading> :      <img
         
            onClick={() => (props.onClick ? props.onClick() : null)}
            src={props.src}
          fetchPriority="high"
            alt={props.alt}
            width={props.width}
            height={props.height}
            className={ props.className}
            />
        }
            
       
            {props.children ? props.children : null}
        </>
    );
     
})
 
 