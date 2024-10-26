import { gql, useMutation } from "@apollo/client";
// import { GetAllCartResponse } from "../pages/cart";
import {
  ADD_ITEM_TO_CART,
  ADD_ITEM_TO_GROUP,
  GET_ALL_CART,
  GET_ALL_GROUP_LABEL,
  GetAllCartResponse,
} from "./utils/cartOrderLogic";
import { toast } from "sonner";
import { GetAllGroupLabelResponse } from "../pages/cart";
import { ADD_GROUP_LABEL } from "../pages/cart/toast/addToCategories";

// Define the mutation for decrementing an item in the cart
const DECREMENT_ITEM_TO_CART = gql`
  mutation DecrementItemToCart($productId: String!) {
    decrementItemToCart(productId: $productId) {
      id
      quantity
      __typename
      cartId
      product {
        id
        name
        imageUrls
        price
        brand
        title
      }
    }
  }
`;

const ProductBrandPrice = ({
  brand,
  price,
  productId,
  refetch,
  label,
  cartView = false, // Default to false if not provided
}: {
  cartView?: boolean;
  brand: string;
  label: string;
  price: number;
  productId?: string;
}) => {
  // Use the mutation hooks
  const [addItemToCart] = useMutation(
    ADD_ITEM_TO_CART,

    {
      update(cache, { data: mutationData }) {
        if (mutationData) {
          // Read the existing cart data from the cache
          const existingCart = cache.readQuery<GetAllCartResponse>({
            query: GET_ALL_CART,
          });

          // If the cart exists in the cache, update it
          if (existingCart) {
            const newItem = mutationData.addItemToCart;

            // Check if the item is already in the cart
            const existingItemIndex = existingCart.getUserCart.items.findIndex(
              (item) => item.product.id === newItem.product.id
            );

            let updatedItems;

            // If the item is already in the cart, update its quantity
            if (existingItemIndex > -1) {
              updatedItems = [...existingCart.getUserCart.items];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity:
                  updatedItems[existingItemIndex].quantity + newItem.quantity,
              };
            } else {
              // If the item is new, add it to the cart
              //updatedItems = [...existingCart.getUserCart.items, newItem];
              updatedItems = [
                ...existingCart.getUserCart.items,
                {
                  ...newItem,
                  __typename: "CartItem",
                },
              ];
            }

            // Write the updated cart data back to the cache
            cache.writeQuery({
              query: GET_ALL_CART,
              data: {
                getUserCart: {
                  ...existingCart.getUserCart,
                  items: updatedItems,
                },
              },
            });
          }
        }
      },
    }
  );
  const [decrementItemToCart] = useMutation(DECREMENT_ITEM_TO_CART, {
    update(cache, { data: mutationData }) {
      if (mutationData) {
        const existingCart = cache.readQuery<GetAllCartResponse>({
          query: GET_ALL_CART,
        });

        if (existingCart) {
          const decrementedItem = mutationData.decrementItemToCart;

          const updatedItems = existingCart.getUserCart.items
            .map((item) =>
              item.product.id === decrementedItem.product.id
                ? { ...item, quantity: decrementedItem.quantity }
                : item
            )
            .filter((item) => item.quantity > 0); // Remove items with 0 quantity

          cache.writeQuery({
            query: GET_ALL_CART,
            data: {
              getUserCart: {
                ...existingCart.getUserCart,
                items: updatedItems,
              },
            },
          });
        }
      }
    },
  });
  const [addItemToCartGroupLabel] = useMutation(ADD_ITEM_TO_GROUP, {
    update(cache, { data: { addItemToCartGroupLabel } }) {
      // Read the current group labels from the cache
      const existing = cache.readQuery<GetAllGroupLabelResponse>({
        query: GET_ALL_GROUP_LABEL,
      });
  
      if (existing) {
        // Find and update the group label that matches the added item's group
        const updatedGroupLabels = existing.getAllgroupLabel.map((group) =>
          group.id === addItemToCartGroupLabel.id
            ? {
                ...group,
                items: [...group.items, addItemToCartGroupLabel.item], // Add the new item to the group
              }
            : group
        );
  
        // Write the updated group labels back to the cache
        cache.writeQuery({
          query: GET_ALL_GROUP_LABEL,
          data: {
            getAllgroupLabel: updatedGroupLabels,
          },
        });
      }
    },
  });

   // Mutation for adding a new category
   const [addGroupLabel] = useMutation(ADD_GROUP_LABEL, {
    onCompleted: () => {
      toast.success(`${label} Action Successful 👻  `);
   
    },
    onError: (err) => {
      console.error(err);
      // toast.error(`${err}`);
    },
    update(cache, { data: { addGroupLabel } }) {
      // Read the current group labels from the cache
      const existing = cache.readQuery<GetAllGroupLabelResponse>({
        query: GET_ALL_GROUP_LABEL,
      });
  
      if (existing) {
        // Find and update the group label that matches the added item's group
        const updatedGroupLabels = existing.getAllgroupLabel.map((group) =>
          group.id === addGroupLabel.id
            ? {
                ...group,
                items: [...group.items, addGroupLabel.item], // Add the new item to the group
              }
            : group
        );
  
        // Write the updated group labels back to the cache
        cache.writeQuery({
          query: GET_ALL_GROUP_LABEL,
          data: {
            getAllgroupLabel: updatedGroupLabels,
          },
        });
      }
    },
  });
  
  // Increment product quantity in cart
  const handleIncrement = async () => {
    try {
      const response = await addItemToCart({
        variables: {
          productId,
          quantity: 1, // Add 1 item to the cart
        },
      });
      const cartitemid = response?.data?.addItemToCart?.id;

      try {
        toast.success(`Added to ${label} 👻`);
       
        addGroupLabel({
          variables: {
            input: {
              groupLabel: label,
              cartItemId: cartitemid,
              quantityGroup: 1,
            },
          },
        });
        // refetch()
      } catch (error) {
        toast.error("Failed to add item to group label");
      }
    } catch (error) {
      toast.error(`Failed to add item to cart :, ${error}`);
    }
  };

  // Decrement product quantity in cart
  const handleDecrement = async () => {
    try {
   const response=   await decrementItemToCart({
        variables: {
          productId,
        },
      });
      const cartitemid = response?.data?.decrementItemToCart?.id;

      try {
        toast.success(`remove from ${label}`);
       
        addGroupLabel({
          variables: {
            input: {
              groupLabel: label,
              cartItemId: cartitemid,
              quantityGroup: -1,
            },
          },
        });
        // refetch()
      } catch (error) {
        toast.error("Failed to add item to group label");
      }
    } catch (error) {
      console.error("Failed to decrement item in cart:", error);
    }
  };

  return (
    <div className="text-white font-normal text-[16px]">
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "80px",
        }}
      >
        {!cartView ? (
          brand
        ) : (
          <div className="flex items-center justify-center">
            <span
              className="p-2 mx-2 flex text-center justify-center items-center rounded-full w-5 h-5 cursor-pointer text-black bg-white"
              onClick={handleIncrement}
            >
              +
            </span>
            <span
              className="p-2 flex justify-center items-center rounded-xl w-5 h-5 cursor-pointer text-black bg-white"
              onClick={handleDecrement}
            >
              -
            </span>
          </div>
        )}
      </div>
      <div>{price}</div>
    </div>
  );
};

export default ProductBrandPrice;
