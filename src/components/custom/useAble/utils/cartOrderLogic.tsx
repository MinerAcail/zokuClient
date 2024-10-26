import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import AddToCategories from "../../pages/cart/toast/addToCategories";
import { CartToast } from "../../pages/cart/toast/Toast";
import { Product } from "../../fileInput/gql/query";
import { toast } from "sonner";

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
// Define the mutation for adding an item to the cart
export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($productId: String!, $quantity: Int!) {
    addItemToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
      __typename
      cartId
      createdAt
      updatedAt
      product {
        id
        name
        imageUrls
        price
        brand
        title
        createdAt
        updatedAt
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
      createdAt
      updatedAt
      
      items {
        id
        cartId
        quantity
        createdAt
        updatedAt
        __typename
        product {
          id
          name
          imageUrls
          price
          brand
          title
          createdAt
          updatedAt
          __typename
        }
      }
    }
  }
`;

export const GET_ALL_GROUP_LABEL = gql`
  query getAllgroupLabel {
    getAllgroupLabel {
      id
      groupLabel
      createdAt
      updatedAt
      __typename
      items {
        id
        quantityGroup
        createdAt
        updatedAt
        __typename
        cartItem {
          __typename
          id
          createdAt
          updatedAt
          __typename
          product {
            
            id
            name
            imageUrls
            price
            brand
            title
            createdAt
            updatedAt
            __typename
          }
        }
      }
    }
  }
`;
export const ADD_ITEM_TO_GROUP = gql`
  mutation AddItemToCartGroupLabel($cartItemId: String!) {
    addItemToCartGroupLabel(cartItemId: $cartItemId) {
      id
      quantity
      __typename
      cartId
      createdAt
      updatedAt
    }
  }
`;
// Function to handle adding an item to the cart
const handleAddToCartClick = async (
  addItemToCart: (variables: {
    variables: { productId: string; quantity: number };
  }) => void,
  productId: string,
  quantity: number,
  setSelected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await addItemToCart({
      variables: { productId, quantity },
    });
    setSelected(true); // Set the selected state to true after successful mutation

    return response;
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

function CartOrderLogic({
  productId,
  quantityGroup,
}: {
  productId: string;
  quantityGroup: number;
}) {
  const { data, refetch } = useQuery(GET_ALL_CART, {
    fetchPolicy: "cache-and-network",
  });

  // console.log(quantityGroup);

  const [selected, setSelected] = useState(false);
  const [cartitemid, setCartitemid] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [checkState, setCheckState] = useState(false); // State for dialog

  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
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
  const [addItemToCartGroupLabel] = useMutation(ADD_ITEM_TO_GROUP);

  useEffect(() => {
    if (data && data.getUserCart) {
      const itemInCart = data.getUserCart.items.find(
        (item) => item.product.id === productId
      );
      refetch();
      if (itemInCart && itemInCart.quantity >= 1) {
        setSelected(true);
        setQuantity(itemInCart.quantity); // Set the quantity if the item is already in the cart
      }
    }
  }, [data, productId, refetch]);
  let IDcartitemid: string;

  const handleClick = async () => {
    const newQuantity = 1; // Increment quantity by 1 on click

    // Call the addItemToCart function and get the cart item ID
    const response = await handleAddToCartClick(
      addItemToCart,
      productId,
      newQuantity,
      setSelected
    );

    if (response?.data?.addItemToCart?.id) {
      const cartitemid = response.data.addItemToCart.id;
      IDcartitemid = cartitemid; // i did this because the state doesn't work but let  IDcartitemid :string; work

      // Call handleAddToCategories immediately after adding the item
      setCartitemid(cartitemid);
      handleAddToCategories();
      // Update the quantity locally
      setQuantity(newQuantity + quantity);
    }
  };

  const SendFunc = async () => {
    try {
      await addItemToCartGroupLabel({
        variables: { cartItemId: IDcartitemid },
      });
    } catch (error) {
      toast.error("Failed to add item to group label");
    }
  };
  const handleAddToCategories = () => {
    let timer :NodeJS.Timeout | string | number | undefined; // To hold the setTimeout reference

    const checkState = () => {
      // Call SendFunc if neither button is clicked after 3 seconds
      timer = setTimeout(() => {
        toast.loading("Saving as UnGroup");
        toast.dismiss()
        SendFunc(); // Call your SendFunc here
      }, 4000);
    };

    CartToast({
      message: "Item added to categories",
      description:
        "Do you want to add this item to your selected categories? if no, just ignore it",

      onYes: () => {
        clearTimeout(timer); // Cancel the timer if "Yes" is clicked
        // Logic for adding to categories
      setCheckState(true)

        setIsDialogOpen(true); // Open the dialog when "Yes" is clicked
      },

      onNo: () => {
        clearTimeout(timer); // Cancel the timer if "No" is clicked
        toast.loading("Saving as UnGroup");
        SendFunc(); // Call SendFunc if "No" is clicked
      },
    });

    checkState(); // Start the 3-second timer
  };

  return (
    <div>
      <div
        className={`m-1 flex justify-center items-center rounded-xl w-12 h-12 cursor-pointer ${
          selected ? "bg-white" : "bg-transparent"
        }`}
        onClick={handleClick} //when i click the cart icon, show the toast
      >
        <p
          className={`text-black font-semibold ${selected ? "mr-2" : "hidden"}`}
        >
          {quantityGroup}
        </p>
        <ShoppingCart
          className={`size-[18px] transition-transform duration-300 ${
            selected ? "transform rotate-[360deg] text-black" : "text-white"
          }`}
        />
      </div>
      {/* Dialog Component */}
      <AddToCategories
        cartitemid={cartitemid}
        isDialogOpen={isDialogOpen}
        onClose={()=>setIsDialogOpen(false)}
        checkState={checkState}
        setCheckState={setCheckState}
       
      />
    </div>
  );
}

export default CartOrderLogic;
