import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Product } from "../../fileInput/gql/query";

import { ItemLayout } from "../../useAble/ItemLayout";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import Empty, {
  LoadingSpinner,
  ErrorMessage,
} from "../../useAble/LoadAndErrorStatus";
import { GET_ALL_GROUP_LABEL } from "../../useAble/utils/cartOrderLogic";
import { DateSelector } from "./date";

// Define interfaces for the new structure
interface CartProductItem {
  id: string;
  product: Product;
}

interface GroupedItem {
  id: string;
  quantityGroup: number;
  cartItem: CartProductItem;
}

interface GroupLabel {
  id: string;
  groupLabel: string;
  items: GroupedItem[];
}

export interface GetAllGroupLabelResponse {
  getAllgroupLabel: GroupLabel[];
}

function CartProduct() {
  // Use the new query
  const {
    data,
    loading: cartLoading,
    error: cartError,
    refetch
  } = useQuery<GetAllGroupLabelResponse>(GET_ALL_GROUP_LABEL);
  const {
    sideSwapperProductIds,
    loading: sideSwapperLoading,
    error: sideSwapperError,
  } = useSideSwapperProductIds();
  const [groupedItems, setGroupedItems] = useState<GroupLabel[]>([]);

  useEffect(() => {
    if (data?.getAllgroupLabel) {
      // Store the group-labeled cart items
      setGroupedItems(data.getAllgroupLabel);
    }
    refetch()
  }, [data,refetch]);

  if (cartLoading || sideSwapperLoading) return <LoadingSpinner />;
  if (groupedItems.length === 0)
    return <Empty message="No products found in your cart." />;
  if (cartError || sideSwapperError)
    return (
      <ErrorMessage message={cartError?.message || sideSwapperError?.message} />
    );

  return (
    <div>
      {groupedItems.map((group) => (
        <div key={group.id} className="my-3 flex flex-col gap-4">
          <DateSelector key={group.id} labelData={group.groupLabel} />{" "}
          {/* Display groupLabel instead of date */}
          <div
            key={group.id}
            className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {group.items.map(({ cartItem, quantityGroup }) => {
              const { id, product } = cartItem;
              const {
                id: productId,
                name,
                imageUrls,
                price,
                brand,
                title,
              } = product;
              const added = sideSwapperProductIds.has(productId);
              const total = parseFloat((price * quantityGroup).toFixed(2));
              const label = group.groupLabel;
              return (
                <ItemLayout
                  label={label}
                  added={added}
                  productId={productId}
                  cartView={true}
                  description={title}
                  brand={brand}
                  price={total}
                  name={name}
                  refetch={refetch}
                  key={id}
                  imageUrls={imageUrls}
                  quantityGroup={quantityGroup}
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
