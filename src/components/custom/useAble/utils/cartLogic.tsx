import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

// Define the mutation for adding an item to the cart
const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($productId: String!, $quantity: Int!) {
    addItemToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
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
        }
      }
    }
  }
`;

// Function to handle adding an item to the cart
export const handleAddToCartClick = async (
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

function CartLogic({ productId }) {
  const { data, loading, error } = useQuery(GET_ALL_CART);
  const [selected, setSelected] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);

  useEffect(() => {
    if (data && data.getUserCart) {
      const itemInCart = data.getUserCart.items.find(item => item.product.id === productId);
      if (itemInCart) {
        setSelected(true);
        setQuantity(itemInCart.quantity); // Set the quantity if the item is already in the cart
      }
    }
  }, [data, productId]);

  const handleClick = () => {
    const newQuantity = 1; // Increment quantity by 1 on click
    handleAddToCartClick(addItemToCart, productId, newQuantity, setSelected);
    setQuantity(newQuantity + quantity);
    console.log("newQuantity",newQuantity);
    console.log("quantity",quantity);
    
  };

  return (
    <div>
      <div
        className={`m-1 flex justify-center items-center rounded-xl w-12 h-12 cursor-pointer ${
          selected ? "bg-white" : "bg-transparent"
        }`}
        onClick={handleClick}
      >
        <p className={`text-black font-thin ${selected ? 'mr-2' : 'hidden'}`}>{quantity}</p>
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
