import { Link } from "react-router-dom";
import "./index.scss";
import { VendorFavoriteLogicIcons } from "./vendorFavoriteLogic";

interface BoxLayoutProps {
  name: string;
  description: string;
  srcimage: string;
  bgimage: string;
  vendorId: string;
  count: string;
  vendor: {
    id: string;
  };
}

const BoxLayout: React.FC<BoxLayoutProps> = ({
  name,
  description,
  srcimage,
  bgimage,
  count,
  vendor,
  vendorId,
}) => {
  return (
    <Link
      to={`/vendor/${vendor.id}`}
      className="box-layout flex border rounded-xl m-2 bg-[#E1E1E1] w-72 h-72"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="box-content flex border rounded-xl w-full h-full relative">
        <div className="box1 flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold">{name}</h2>
            <p>{description}</p>
            <p>Products: {count}</p>
          </div>
        </div>
        <div className="box2 flex items-center justify-center">
          <img
            src={srcimage}
            alt={`Image of ${name}`}
            className="rounded-xl object-cover w-full h-full"
          />
          <VendorFavoriteLogicIcons vendorId={vendorId} />
        </div>
      </div>
    </Link>
  );
};

export default BoxLayout;
