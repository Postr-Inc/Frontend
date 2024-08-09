import { createSignal, createContext, useContext, Show , onMount} from 'solid-js';
import { render } from 'solid-js/web';

// Create a context for the carousel
const CarouselContext = createContext({}) as any;

function CarouselProvider(props: any) {
  const [items, setItems] = createSignal([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const registerItem = (id: any) => {
    setItems((prevItems) => [...prevItems, id] as any);
  };

  const removeItem = (id: any) => {
    setItems((prevItems) => prevItems.filter((item: any) => item !== id));
  }

  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items().length);
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items().length) % items().length);
  };

  return (
    <CarouselContext.Provider  value={{ items, currentIndex, registerItem, nextItem, prevItem , removeItem, setItems, setCurrentIndex }} >
      {props.children}
    </CarouselContext.Provider>
  );
}

function Carousel(props:any) {
  return (
    <CarouselProvider>
      <div class="carousel focus:outline-none h-full rounded-box w-full">{props.children}</div>
    </CarouselProvider>
  );
}

export function CarouselItem(props: any) {
  let { items, currentIndex, registerItem , removeItem, prevItem, nextItem } = useContext(CarouselContext) as {items: any, currentIndex: any, registerItem: any, removeItem: any, setItems: any, setCurrentIndex: any, nextItem: any, prevItem: any};
  let id = Math.random().toString(36).substring(7);
 

  onMount(() => {
    //@ts-ignore;
     

    registerItem(id);
  });

  function handleDelete() { 
    removeItem(id);
    props.onDeleted && props.onDeleted(); 
    if(currentIndex() === items().length - 1 && items().length > 1){
      prevItem();
    }else if(currentIndex() === 0){
      nextItem();
    }
  }
  

  return (
    <div
      id={id}
      class="carousel-item w-full" 
      style={{ transform: `translateX(-${currentIndex() * 100}%)` , transition: "transform 0.5s" }}
    >
      <Show when={props.showDelete}>
        <span class='absolute top-2 left-2'  onClick={handleDelete}>
          <button class="btn btn-circle btn-ghost" >X</button>  
        </span>
      </Show>
      {props.children}
     { items().length > 1 &&   <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
        <Show when={currentIndex() !== 0}>
        <button onClick={useContext(CarouselContext).prevItem} class="btn opacity-50 hover:opacity-100 bg-base-200 btn-circle">❮</button>
        </Show>
        <button></button>
        <Show when={currentIndex() !== items().length - 1}>
          
        <button onClick={useContext(CarouselContext).nextItem} class="btn  opacity-50 bg-base-200 btn-circle">❯</button>
        </Show>
      </div>
      }
    </div>
  );
}

Carousel.Item = CarouselItem;

export default Carousel;