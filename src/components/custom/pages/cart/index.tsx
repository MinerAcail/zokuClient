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

import { DateSelector } from "./date";

interface CartItem {
  id: string;
  cartId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

interface UserCart {
  id: string;
  userType: string;
  items: CartItem[];
}

export interface GetAllCartResponse {
  getUserCart: UserCart;
}

function CartProduct() {
  const {
    data,
    loading: cartLoading,
    error: cartError,
  } = useQuery<GetAllCartResponse>(GET_ALL_CART);
  const {
    sideSwapperProductIds,
    loading: sideSwapperLoading,
    error: sideSwapperError,
  } = useSideSwapperProductIds();
  const [products, setProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    if (data?.getUserCart) {
      const filteredProducts = data.getUserCart.items.filter(
        (item) => item.quantity > 0
      );
      setProducts(filteredProducts);
    }
  }, [data]);

  const groupByDate = (items: CartItem[]) => {
    return items.reduce((group, item) => {
      const date = item.updatedAt.split("T")[0]; // Group by the updatedAt date (YYYY-MM-DD)
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(item);
      return group;
    }, {} as Record<string, CartItem[]>);
  };

  const groupedProducts = groupByDate(products);

  if (cartLoading || sideSwapperLoading) return <LoadingSpinner />;
  if (cartError || sideSwapperError)
    return (
      <ErrorMessage message={cartError?.message || sideSwapperError?.message} />
    );
  if (products.length === 0)
    return <Empty message="No products found in your cart." />;

  return (
    <div>
      {Object.keys(groupedProducts).map((date) => (
        <div key={date} className="my-3  flex flex-col gap-4">
          <DateSelector dataDate={new Date(date)} />{" "}
          {/* Display the grouped date */}
          <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {groupedProducts[date].map((item) => {
              const { id, quantity, product } = item;
              const {
                id: productId,
                name,
                imageUrls,
                price,
                brand,
                title,
              } = product;
              const added = sideSwapperProductIds.has(productId);
              const total = parseFloat((price * quantity).toFixed(2));

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
      ))}
    </div>
  );
}

export default CartProduct;
