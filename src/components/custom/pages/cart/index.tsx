import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../../fileInput/gql/query";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL
import Description from "../../useAble/description";
import { ItemLayout } from "../../useAble/ItemLayout";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";

function CartProduct() {
  const { data: Data, loading: vendorLoading, error: vendorError } = useQuery(GET_ALL_PRODUCTS);
  const { sideSwapperProductIds, loading: sideSwapperLoading, error: sideSwapperError } = useSideSwapperProductIds();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (Data && Data.getAllProduct) {
      setProducts(Data.getAllProduct);
    }
  }, [Data]);



  if (vendorLoading ) return <p>Loading products...</p>;
  if (vendorError) return <p>Error loading products: {vendorError.message}</p>;

  return (
    <div>
      <Description text={"Find All Items On Zuko Here"} />

      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;

          const added = sideSwapperProductIds.has(id); // Check if the product is already added

          return (
            <ItemLayout
              added={added}
              productId={id}
            cartView={true}
        
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

export default CartProduct;
