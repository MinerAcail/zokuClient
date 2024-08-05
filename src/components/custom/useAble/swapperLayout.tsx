import "./index.scss";
import { MessageCircleDashed, ShoppingCart, SwatchBook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DrawSheet } from "./drawer";

export const SwapperLayout = ({ children }) => {
  return (
    <div
      style={{
        height: "27%",
      }}
      className="flex p-2 rounded-b-xl w-full justify-between items-center bg-[#74727c]"
    >

      <div
        style={{
          // height: "75%",
          // overflow: "hidden",
          // borderRadius: "6px",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        {children}
      </div>
      <div className=" text-white  ">Item name here</div>
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
