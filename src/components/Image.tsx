import { useRef, useCallback, useState, useEffect , memo} from "react";
import { Loading } from "./icons/loading";
import { api } from "@/app/app/page";
 
export const LazyImage = memo(function LazyImage(props: {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    className: string;
    onClick?: Function;
    children?: any;
}){

 
    

    const imageRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    const handleImageLoaded = useCallback(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        // Create a new Image instance
        const loader = new Image();
        //@ts-ignore
        loader.src = props.src 

        // Set the onload callback
        loader.onload = () => {
            setTimeout(() => {
                handleImageLoaded();
            }, 1000);
        };

        // Clean up to prevent memory leaks
        return () => {
            loader.onload = null;
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
 
 