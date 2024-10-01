import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { GetAllCartResponse } from "../../pages/cart";

// Define the mutation for adding an item to the cart
export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($productId: String!, $quantity: Int!) {
    addItemToCart(productId: $productId, quantity: $quantity) {
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

export const GET_ALL_CART = gql`
  query GetUserCart {
    getUserCart {
      id
      userType
      __typename
      items {
        id
        cartId
        quantity
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
  }
`;

// Function to handle adding an item to the cart
const handleAddToCartClick = async (
  addItemToCart: (variables: { variables: { productId: string; quantity: number } }) => void,
  productId: string,
  quantity: number,
  setSelected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    await addItemToCart({ variables: { productId, quantity } });
    setSelected(true); // Set the selected state to true after successful mutation
  } catch (error) {
    if (error instanceof ApolloError) {
      console.error(
        "Failed to add item to cart:",
        error.message,
        error.graphQLErrors,
        error.networkError
      );
    } else {
      console.error("Failed to add item to cart:", error);
    }
  }
};

function CartLogic({ productId }: { productId: string }) {
  const { data,refetch } = useQuery(GET_ALL_CART,
    {
      fetchPolicy:"cache-and-network"
    }
  );
  const [selected, setSelected] = useState(false);
  const [quantity, setQuantity] = useState(0);


  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
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
            updatedItems = [...existingCart.getUserCart.items, newItem];
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
  });

  useEffect(() => {
    if (data && data.getUserCart) {
      const itemInCart = data.getUserCart.items.find(
        (item) => item.product.id === productId
      );
      refetch()
      if (itemInCart && itemInCart.quantity >= 1) {
        setSelected(true);
        setQuantity(itemInCart.quantity); // Set the quantity if the item is already in the cart
      }
    }
  }, [data, productId,refetch]);

  const handleClick = () => {
    const newQuantity = 1; // Increment quantity by 1 on click
    handleAddToCartClick(addItemToCart, productId, newQuantity, setSelected);
    setQuantity(newQuantity + quantity);
  };

  return (
    <div>
      <div
        className={`m-1 flex justify-center items-center rounded-xl w-12 h-12 cursor-pointer ${
          selected ? "bg-white" : "bg-transparent"
        }`}
        onClick={handleClick}
      >
        <p className={`text-black font-semibold  ${selected ? "mr-2" : "hidden"}`}>
          {quantity}
        </p>
        <ShoppingCart
          className={`size-[18px] transition-transform duration-300 ${
            selected ? "transform rotate-[360deg] text-black" : "text-white"
          }`}
        />
      </div>
    </div>
  );
}

export default CartLogic;
