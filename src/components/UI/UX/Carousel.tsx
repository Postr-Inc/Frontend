export default function Carousel({ children }: { children: any }) {
  return <div class="carousel rounded-box w-full">{children}</div>;
}

function CarouselItem({ children }: { children: any }) {
  return <div class="carousel-item w-full">{children}</div>;
}
Carousel.Item = CarouselItem;

export { Carousel, CarouselItem };