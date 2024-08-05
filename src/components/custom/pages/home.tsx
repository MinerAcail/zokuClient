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
const GET_ALL_USERS = gql`
  query {
    getAllUser {
      name
    }
  }
`;
function Home() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);

  // sticky top-0 backdrop-blur-md
  return (
    <>
      <div
        className="m-5  grid gap-4 
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <ImageGallery />
      </div>
    </>
  );
}

export default Home;

{
  /* <UploadFile/>            */
}
{
  /* <AppTemplate/> */
}
