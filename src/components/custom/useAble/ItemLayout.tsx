import "./index.scss";
import { MessageCircleDashed, ShoppingCart, SwatchBook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DrawSheet } from "./drawer";

export const ItemLayout = ({ children,name }) => {
  return (
    <div className="  rounded-xl bg-[#E1E1E1] w-[288px] h-[260px]">
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
      <div
        style={{
          height: "27%",
        }}
        className="flex p-2 rounded-b-xl w-full justify-between items-center bg-[#74727c]"
      >
        <div className=" text-white font-normal text-lg  ">{name}</div>
        <Separator
          orientation="vertical"
          className="border-l border-gray-300 h-[34px]"
        />
        <Icons />
      </div>
    </div>
  );
};

export function Icons() {
  return (
    <div className="flex w-fit h-fit  text-[#ffdaf9]  ">
      <SwatchBook className="mr-2  size-6 cursor-pointer" />

      <ShoppingCart className="mx-2 size-6 cursor-pointer" />
      <DrawSheet
        children={
          <MessageCircleDashed className="ml-2 size-6 cursor-pointer" />
        }
      />
    </div>
  );
}
