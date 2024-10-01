import { useQuery } from "@apollo/client";
import {
  GET_USER_FAVORITE_PRODUCTS,
  GetUserFavoriteProductsResponse,
} from "../../useAble/favoriteLogic";
import { ItemLayout } from "../../useAble/ItemLayout";
import Description from "../../useAble/description";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import Empty, {
  LoadingSpinner,
  ErrorMessage,
} from "../../useAble/LoadAndErrorStatus";


function AddedFavourite() {
  const { data, loading, error } =
    useQuery<GetUserFavoriteProductsResponse>(GET_USER_FAVORITE_PRODUCTS,{
    fetchPolicy: 'cache-and-network',
      
    });
  const { sideSwapperProductIds } = useSideSwapperProductIds();


  // Consolidated loading and error checks
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  // Check if there are no favorite products
  if (
    !data ||
    !data.getUserFavoriteProducts ||
    data.getUserFavoriteProducts.length === 0
  ) {
    return <Empty message="No favorite products found." />;
  }

  return (
    <div>
      <Description text={"All Your Added Shop Items Here"} />

      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.getUserFavoriteProducts.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;
          // const imageSrc = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;
          const added = sideSwapperProductIds.has(id); // Check if the product is already added as a side swapper product

          return (
            <ItemLayout
              added={added}
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
