import BoxLayout from "../useAble/boxLayout";
import { ItemLayout } from "../useAble/ItemLayout";
import { SwatchBook } from "lucide-react";
import Comments from "../useAble/comments/comments";
// import AppTemplate from "./template";
import D3Component from "./try";
import OverlayVideo from "./geneVideos";
// import VideoConverter from "../useAble/template/videoConverter";
import AppTemplate from "./template";
import ImageToVideoConverter from "./image";
import VideoOverLayConverter from "./video";
import VideoConverterForOverlay from "../useAble/template/videoConverter";
import { gql, useQuery } from "@apollo/client";
import UploadFile from "./upload";
import UploadFiles from "./uploads";
import ImageGallery from "./gala";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const GET_ALL_VENDORS = gql`
  query GetAllVendor {
    getAllVendor {
      id
      name
      product {
        id
      }
      profileUrl
      backgroundUrl
    }
  }
`;
function Home() {
  const { loading, error, data } = useQuery(GET_ALL_VENDORS);
  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.getAllVendor.map((vendor) => {
        // console.log(vendor?.product?.length);
        const count = vendor?.product?.length;

        return (
          <BoxLayout
            key={vendor.id}
            vendorId={vendor.id}
            bgimage={vendor?.profileUrl}
            vendor={vendor}
            count={count}
            srcimage={vendor?.profileUrl}
            name={vendor?.name}
            description={"Descriptions will be here"}
          />
        );
      })}
    </div>
  );
}

export default Home;

{
  /* <UploadFile/>            */
}
{
  /* <AppTemplate/> */
}
