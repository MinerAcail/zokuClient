
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function AvatarDemo() {
  return (
    <div className="bg-[#e9b6acdc] rounded-xl text-start p-4">
    <div className="flex justify-end items-center space-x-4">
      <div className="text-white text-2xl font-bold">Side Swapper</div>
      <Avatar className="">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback className="bg-[#FEDFF3]">CN</AvatarFallback>
    </Avatar>
    </div>
    <div className="text-[#212022] w-[30%] mt-6 font-bold  ml-auto bg-[#FEDFF3] rounded-xl text-start p-4">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
      ipsam. Explicabo, reiciendis at odit illo unde laborum perferendis
      eius nesciunt?
    </div>
  </div>
   
  );
}