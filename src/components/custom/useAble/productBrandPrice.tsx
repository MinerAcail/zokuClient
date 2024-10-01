import { gql, useMutation } from "@apollo/client";
import { GetAllCartResponse } from "../pages/cart";
import { ADD_ITEM_TO_CART, GET_ALL_CART } from "./utils/cartLogic";



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
  cartView = false, // Default to false if not provided
}: {
  cartView?: boolean;
  brand: string;
  price: number;
  productId?: string;
}) => {
  // Use the mutation hooks
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART,
    
    {
     
      update(cache, { data: mutationData }) {
      if (mutationData) {
        // Read the existing cart data from the cache
        const existingCart = cache.readQuery<GetAllCartResponse>({ query: GET_ALL_CART });
        
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
              quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
            };
          } else {
            // If the item is new, add it to the cart
            //updatedItems = [...existingCart.getUserCart.items, newItem];
            updatedItems = [...existingCart.getUserCart.items, {
              ...newItem,
              __typename: "CartItem"
            }];
            
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
    },}
  );
  const [decrementItemToCart] = useMutation(DECREMENT_ITEM_TO_CART, {
    update(cache, { data: mutationData }) {
      if (mutationData) {
        const existingCart = cache.readQuery<GetAllCartResponse>({ query: GET_ALL_CART });
        
        if (existingCart) {
          const decrementedItem = mutationData.decrementItemToCart;
  
          const updatedItems = existingCart.getUserCart.items.map(item =>
            item.product.id === decrementedItem.product.id
              ? { ...item, quantity: decrementedItem.quantity }
              : item
          ).filter(item => item.quantity > 0); // Remove items with 0 quantity
          
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
    }
  });
  

  // Increment product quantity in cart
  const handleIncrement = async () => {
    try {
      await addItemToCart({
        variables: {
          productId,
          quantity: 1, // Add 1 item to the cart
        },
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  // Decrement product quantity in cart
  const handleDecrement = async () => {
    try {
      await decrementItemToCart({
        variables: {
          productId,
        },
      });
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
