import { gql, useQuery } from "@apollo/client";
import BoxLayout from "../../useAble/boxLayout";
import Description from "../../useAble/description";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL

import Empty, { LoadingSpinner, ErrorMessage } from "../../useAble/LoadAndErrorStatus";

const GET_USER_FAVORITE_VENDORS = gql`
  query GetUserFavoriteVendors {
    getUserFavoriteVendors {
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

export type FavoriteVendor = {
  id: string;
  name: string;
  product: { id: string } | null;
  profileUrl: string | null;
  backgroundUrl: string | null;
};

export type GetUserFavoriteVendorsResponse = {
  getUserFavoriteVendors: FavoriteVendor[];
};

function AllAddedShop() {
  const { data, loading, error } = useQuery<GetUserFavoriteVendorsResponse>(GET_USER_FAVORITE_VENDORS,{
    fetchPolicy: 'cache-and-network',
  });

 


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;


  if (data?.getUserFavoriteVendors.length === 0) return <Empty message="No Favorite Vendor found." />;

  return (
    <div>
      <Description text={"All Your Added Vendor's Shop Here"} />

      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.getUserFavoriteVendors.map((vendor) => {
          const { id, name, profileUrl, product } = vendor;
          const imageSrc = profileUrl || fallbackImage;

          return (
            <BoxLayout
              key={id}
              vendorId={id}
              bgimage={imageSrc || fallbackImage} // Background image (if needed)
              vendor={vendor}
              count={product ? product.id : '0'} // Display product count if available
              srcimage={imageSrc}
              name={name}
              description={"Descriptions will be here"} // Placeholder text
            />
          );
        })}
      </div>
    </div>
  );
}

export default AllAddedShop;
