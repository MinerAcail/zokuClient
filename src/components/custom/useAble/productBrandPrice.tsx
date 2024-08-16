import { gql, useMutation } from "@apollo/client";

// Define the mutation for adding an item to the cart
const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($productId: String!, $quantity: Int!) {
    addItemToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

// Define the mutation for decrementing an item in the cart
const DECREMENT_ITEM_TO_CART = gql`
  mutation DecrementItemToCart($productId: String!) {
    decrementItemToCart(productId: $productId) {
      id
      quantity
      productId
      cartId
      product {
        id
        name
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
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);
  const [decrementItemToCart] = useMutation(DECREMENT_ITEM_TO_CART);

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
