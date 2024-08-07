import { useQuery } from "@apollo/client";
// import { GET_USER_FAVORITE_VENDORS, GetUserFavoriteVendorsResponse } from "../../useAble/favoriteLogic";
import BoxLayout from "../../useAble/boxLayout";
import Description from "../../useAble/description";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL
import { useEffect } from "react";
import { GET_USER_FAVORITE_VENDORS, GetUserFavoriteVendorsResponse } from "../../useAble/vendorFavoriteLogic";

function AllAddedShop() {
  const { data, loading, error, refetch } = useQuery<GetUserFavoriteVendorsResponse>(GET_USER_FAVORITE_VENDORS);

  // Optional: Call refetch to ensure the data is up-to-date
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading favorite vendors.</p>;

  if (!data || !data.getUserFavoriteVendors) return <p>No favorite vendors found.</p>;

  return (
    <div>
      <Description text={"All Your Added Vendor's Shop Here"} />

      <div
        className="m-5 grid gap-4 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {data.getUserFavoriteVendors.map((vendor) => {
          const { id, name, profileUrl, product } = vendor;

          // Use profileUrl as the image source or fallbackImage if profileUrl is not available
          const imageSrc = profileUrl || fallbackImage;

          return (
            <BoxLayout
              key={id}
              vendorId={id}
              bgimage={profileUrl} // Background image (if needed)
              vendor={vendor}
              count={product} // Count of products
              srcimage={imageSrc} // Main image
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
