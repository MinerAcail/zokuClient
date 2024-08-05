import { Skeleton } from "@/components/ui/skeleton";
import "./index.scss";
import srcimage from "../../../assets/images/12.jpg";
import { Link } from "react-router-dom";

const BoxLayout = () => {
  return (
    <Link
      to={"/shop"}
      className="flex border rounded-xl m-2 bg-[#E1E1E1] w-72 h-72"
    >
      <div className="box1 ">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold">MAKER'S STORE</h2>
            <p>Description goes here...</p>
            <Skeleton className="h-6  w-11/12 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="box2 flex items-center justify-center">
        <img
          src={srcimage}
          alt={`Image`}
          className="rounded-xl object-cover egg-shape"
        />
      </div>
    </Link>
  );
};

export default BoxLayout;
