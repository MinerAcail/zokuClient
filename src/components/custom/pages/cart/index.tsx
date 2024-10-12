import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Product } from "../../fileInput/gql/query";

import { ItemLayout } from "../../useAble/ItemLayout";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import Empty, {
  LoadingSpinner,
  ErrorMessage,
} from "../../useAble/LoadAndErrorStatus";
import { GET_ALL_CART } from "../../useAble/utils/cartLogic";
import { Button } from "@/components/ui/button";
import PaystackPayment from "../../admin/payment/ui/payment";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LocationSelector from "../../admin/payment/ui/map";

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
  } = useQuery<GetAllCartResponse>(GET_ALL_CART); // Use the correct query with the appropriate type

  const {
    sideSwapperProductIds,
    loading: sideSwapperLoading,
    error: sideSwapperError,
  } = useSideSwapperProductIds();

  const [products, setProducts] = useState<CartItem[]>([]); // Update type to CartItem

  useEffect(() => {
    if (data?.getUserCart) {
      const filteredProducts = data.getUserCart.items.filter(
        (item) => item.quantity > 0
      );
      setProducts(filteredProducts);
    }
  }, [data]);

  // Show a loading spinner while data is loading
  if (cartLoading || sideSwapperLoading) return <LoadingSpinner />;

  // Handle errors
  if (cartError || sideSwapperError) {
    return (
      <ErrorMessage message={cartError?.message || sideSwapperError?.message} />
    );
  }

  if (products.length === 0) {
    return <Empty message="No products found in your cart." />;
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-white text-blue-500 border border-blue-500 rounded-lg shadow-md py-2 px-4 transition-all duration-300 hover:bg-blue-500 hover:text-white"
          >
            Proceed to Checkout
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6 m-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Location
          </h2>
          <LocationSelector />
          <PaystackPayment>
            <Button
              variant="outline"
              className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-4 w-full shadow-lg transition-all duration-300 hover:bg-blue-600"
            >
              Make a Payment
            </Button>
          </PaystackPayment>
        </DialogContent>
      </Dialog>

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
