import { useQuery } from "@apollo/client";
import { GET_USER_FAVORITE_PRODUCTS, GetUserFavoriteProductsResponse } from "../../useAble/favoriteLogic";
import { ItemLayout } from "../../useAble/ItemLayout";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL
import { useEffect } from "react";
import Description from "../../useAble/description";

function AddedFavourite() {
  const { data, loading, error, refetch } = useQuery<GetUserFavoriteProductsResponse>(GET_USER_FAVORITE_PRODUCTS);
  // Optional: Call refetch to ensure the data is up-to-date
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading favorite products.</p>;

  if (!data || !data.getUserFavoriteProducts) return <p>No favorite products found.</p>;


  return (
    <div>
      <Description text={"All Your Added Shop Items Here"} />

      <div
        className="m-5 grid gap-4 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {data?.getUserFavoriteProducts.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;
          // const imageSrc = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;

          return (
            <ItemLayout
              productId={id}
              description={title}
              brand={brand}
              price={price}
              name={name}
              key={id}
              imageUrls={imageUrls}

           />
              
            
          );
        })}
      </div>
    </div>
  );
}

export default AddedFavourite;
