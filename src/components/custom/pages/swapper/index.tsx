import { SwatchBook } from "lucide-react";
import srcimage from "../../../../assets/images/b1.jpg";
import { ItemLayout } from "../../useAble/ItemLayout";

function SwapperShop() {
  const initialShowAllState = Array(6).fill(false); // Initialize state for 6 ScrollAreas
  const [showAll, setShowAll] = useState(initialShowAllState);
  const imagePaths = Array.from(
    { length: 14 },
    (_, index) => `../../../../src/assets/images/${index + 1}.jpg`
  );
  const displayedImages = imagePaths.slice(0, showAll ? imagePaths.length : 4);
 const AS =Array.from({length:5})
 const handleShowAll = (index) => {
  const newShowAll = [...showAll];
  newShowAll[index] = true;
  setShowAll(newShowAll);
};
  return (
    <div>
      {/* <div className="bg-[#e9b6acdc] rounded-xl text-start p-4">
          <div className="flex justify-end items-center space-x-4">
            <div className="text-white text-2xl font-bold">Side Swapper</div>
            <AvatarDemo />
          </div>
          <div className="text-[#212022] w-[30%] mt-6 font-bold  ml-auto bg-[#FEDFF3] rounded-xl text-start p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
            ipsam. Explicabo, reiciendis at odit illo unde laborum perferendis
            eius nesciunt?
          </div>
        </div> */}

<div>
      <div
        className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {AS.map((_, idx) => (
          <div key={idx}>
             <div
                className=" w-23 h-6 bg-[#74727ca4]"
            
              >
                Vendor's Name
              </div>
            <ScrollArea className={`h-[390px] w-fit`}>
              {imagePaths.slice(0, showAll[idx] ? imagePaths.length : 4).map((imageSrc, index) => (
                <div key={index} className="p-3 my-2 rounded-xl flex justify-between items-center w-full bg-[#74727c]">
                  <img
                    src={imageSrc}
                    alt={`Image ${index + 1}`}
                    className="rounded-xl mr-5 w-16 h-16"
                  />
                  <h2 className="text-left text-[13px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nisi mo{" "}
                  </h2>
                </div>
              ))}
            </ScrollArea>
            
              <Button
                className="rounded-xl w-23 h-6"
                onClick={() => handleShowAll(idx)}
              >
                More
              </Button>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default SwapperShop;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SwapperLayout } from "../../useAble/swapperLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function AvatarDemo() {
  return (
    <Avatar className="">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback className="bg-[#FEDFF3]">CN</AvatarFallback>
    </Avatar>
  );
}
