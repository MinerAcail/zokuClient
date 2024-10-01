import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Product } from "../../fileInput/gql/query";
import Description from "../../useAble/description";
import { ItemLayout } from "../../useAble/ItemLayout";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import Empty, { LoadingSpinner, ErrorMessage } from "../../useAble/LoadAndErrorStatus";
import { GET_ALL_CART } from "../../useAble/utils/cartLogic";

interface CartItem {
  id: string;
  cartId: string;
  quantity: number;
  product: Product; // Cart items contain product details
}

interface UserCart {
  id: string;
  userType: string;
  items: CartItem[]; // UserCart contains an array of CartItem
}

// Response structure for GET_ALL_CART query
export interface GetAllCartResponse {
  getUserCart: UserCart; // Ensure this reflects the structure returned from the GraphQL query
}


function CartProduct() {
  const {
    data,
    loading: cartLoading,
    error: cartError,
    refetch
  } = useQuery<GetAllCartResponse>(GET_ALL_CART,{
    fetchPolicy:"cache-and-network"
  }); // Use the correct query with the appropriate type

  const {
    sideSwapperProductIds,
    loading: sideSwapperLoading,
    error: sideSwapperError,
  } = useSideSwapperProductIds();

  const [products, setProducts] = useState<CartItem[]>([]); // Update type to CartItem

  useEffect(() => {
  
    if (data && data.getUserCart) {
      const filteredProducts = data.getUserCart.items.filter(item => item.quantity >= 1);
      setProducts(filteredProducts);
    }

  }, [data]);

  // Show a loading spinner while data is loading
  if (cartLoading || sideSwapperLoading) return <LoadingSpinner />;
console.log("products",products);

  // Handle errors
   if (cartError || sideSwapperError) { return <ErrorMessage message={cartError?.message || sideSwapperError?.message} />;}

  // If there are no products, display an empty message
  if (products.length === 0) {
    return <Empty message="No products found in your cart." />;
  }

  return (
    <div>
      <Description text={"Find All Items On Zuko Here"} />

      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => {
          const { id, quantity, product } = item;
          const {
            id: productId,
            name,
            imageUrls,
            price,
            brand,
            title,
          } = product;

          const added = sideSwapperProductIds.has(productId); // Check if the product is already added
          const total = parseFloat((price * quantity).toFixed(2)); // Compute total price

          return (
            <ItemLayout
              added={added}
              productId={productId}
              cartView={true}
              description={title}
              brand={brand}
              price={total}
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
