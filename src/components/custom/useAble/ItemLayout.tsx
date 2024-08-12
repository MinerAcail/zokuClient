import "./index.scss";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FavoriteLogicIcons } from "./favoriteLogic";
import fallbackImage from "../../../assets/images/1.jpg"; // Fallback image URL
import { ShoppingBasket } from "lucide-react";
import SwappersDescription from "./swapper/SliderForSwapper";

interface ItemLayoutProps {
  added:boolean;
  name: string;
  price: number;
  brand: string;
  description: string;
  productId: string;
  imageUrls: string[]; // Add imageUrls prop
}

export const ItemLayout = ({
  name,
  price,
  brand,
  description,
  productId,
  imageUrls,
  added
}: ItemLayoutProps) => {
  return (
    <div className="rounded-xl bg-[#E1E1E1] m-auto sm:w-[288px] w-[288px] h-[260px] flex flex-col">
      <div className="h-3/4 overflow-hidden rounded-t-xl flex justify-center items-center">
        <Carousel className="w-full h-full">
          <CarouselContent className="flex h-full">
            {imageUrls.length > 0 ? (
              imageUrls.map((imageUrl, index) => (
                <CarouselItem key={index} className="flex ">
                  <img
                    src={imageUrl || fallbackImage} // Use fallbackImage if imageUrl is not available
                    alt={name}
                    className="rounded-xl object-cover "
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="flex justify-center items-center">
                <img
                  src={fallbackImage}
                  alt={name}
                  className="rounded-xl object-cover w-full h-full"
                />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
      <Carousel className="relative w-full h-1/4 bg-[#74727c] m-auto mt-0.5 rounded-b-xl">
        <CarouselContent className="flex h-full">
          <CarouselItem className="flex justify-around p-2">
            <ProductDetails name={name} />
            <FavoriteLogic productId={productId} />
            <ProductBrandPrice brand={brand} price={price} />
          </CarouselItem>
          <CarouselItem className="flex justify-center items-center">
            <ProductDescription description={description} />
          </CarouselItem>
          <CarouselItem className="flex justify-around items-center">
            <SwappersDescription added={added} price={price} productId={productId} />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const ProductDetails = ({ name }: { name: string }) => (
  <div
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      height: "3rem",
      width: "8rem",
      lineHeight: "1.5rem",
    }}
    className="text-white p-1 font-normal text-[16px]"
  >
    {name}
  </div>
);

const FavoriteLogic = ({ productId }: { productId: string }) => (
  <div className="flex items-center mb-2">
    <Separator
      orientation="vertical"
      className="border-l border-gray-300 h-[34px]"
    />
    <FavoriteLogicIcons productId={productId} />
  </div>
);

const ProductBrandPrice = ({
  brand,
  price,
}: {
  brand: string;
  price: number;
}) => (
  <div className="text-white font-normal text-[16px]">
    <div
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "90px",
      }}
    >
      {brand}
    </div>
    <div>{price}</div>
  </div>
);

const ProductDescription = ({ description }: { description: string }) => (
  <div
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
    }}
    className="text-white font-normal text-[14px]"
  >
    {description}
  </div>
);
