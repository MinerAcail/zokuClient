import "./index.scss";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
 
} from "@/components/ui/carousel";
import { FavoriteLogicIcons } from "./favoriteLogic";


export const ItemLayout = ({ children, name, price, brand, description,productId }) => {
  return (
    <div className="rounded-xl bg-[#E1E1E1] m-auto sm:w-[288px] w-[288px] h-[260px] flex flex-col">
      <div
        style={{
          height: "75%",
          overflow: "hidden",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>

      <Carousel className="relative w-full h-[25%] bg-[#74727c] m-auto mt-[2px] rounded-b-xl">
        <CarouselContent className="flex  h-full">
          <CarouselItem className="flex  justify-around p-2 ">
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2, // Number of lines to show
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: "3rem", // Adjust based on font size and line height
                width: "8rem", // Adjust based on font size and line height
                lineHeight: "1.5rem", // Adjust as needed
              }}
              className="text-white p-1 font-normal text-[16px] "
            >
              {name}
            </div>
            <div className="flex  -red-800">
              <div className="flex items-center mb-2">
                <Separator
                  orientation="vertical"
                  className="border-l border-gray-300 h-[34px]"
                />
                <FavoriteLogicIcons productId={productId} />
              </div>
              <div className="text-white font-normal text-[16px]">
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1, // Number of lines to show
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "90px",
                  }}
                  className=""
                >
                  {brand}
                </div>
                <div className="">{price}</div>
              </div>
            </div>
          </CarouselItem>

          <CarouselItem className="flex justify-center items-center ">
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3, // Number of lines to show
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%", // Adjust as needed
              }}
              className="text-white   font-normal text-[14px]"
            >
              {description}
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

