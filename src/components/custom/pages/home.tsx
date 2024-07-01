import BoxLayout from "../useAble/boxLayout";
import { ItemLayout } from "../useAble/ItemLayout";
import srcimage from "../../../assets/images/b1.jpg";
import { SwatchBook } from "lucide-react";
import Comments from "../useAble/comments/comments";
import AppTemplate from "./template";

function Home() {
  const imagePaths = Array.from(
    { length: 23 },
    (_, index) => `../../../../src/assets/images/${index + 1}.jpg`
  );
  // sticky top-0 backdrop-blur-md
  return (
    <>
      {/* <div className="w-full flex items-center justify-center bg-slate-400 h-[130px] relative group">
        <img src={srcimage} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white p-4">
            <p>Vendor Name: XYZ</p>
            <p>Vendor Details: Lorem ipsum dolor sit amet.</p>
          </div>
          <div className="text-white p-4">
            <SwatchBook className="mr-2  size-10" />
          </div>
        </div>
      </div> */}

      <div
  //       className="m-5 bg-red-400  grid gap-2 
  // grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  className=""
      >
        <AppTemplate/>
        {/* <Comments/> */}
        {/* <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/>
        <BoxLayout/> */}
        {/* {imagePaths.map((imageSrc, index) => (
          <ItemLayout key={index}>
            <img
              src={imageSrc}
              alt={`Image ${index + 1}`}
              className="rounded-xl object-cover"
            />
          </ItemLayout>
        ))} */}
      </div>
    </>
  );
}

export default Home;
