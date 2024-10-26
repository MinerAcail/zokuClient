import { ApolloError,useMutation, useQuery } from "@apollo/client";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import AddToCategories from "../../pages/cart/toast/addToCategories";
import { toast } from "sonner";
import { CartToast } from "../../pages/cart/toast/Toast";
import { ADD_ITEM_TO_CART, ADD_ITEM_TO_GROUP, GET_ALL_CART, GetAllCartResponse } from "./cartOrderLogic";


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
      toast.error("Failed to add item to cart");
    }
  }
};

function CartLogic({ productId }: { productId: string }) {
  const { data, refetch } = useQuery(GET_ALL_CART, {
    fetchPolicy: "cache-and-network",
  });
  const [selected, setSelected] = useState(false);
  const [cartitemid, setCartitemid] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [checkState, setCheckState] = useState(false); // State for dialog
// let  : boolean
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
  }, [data, productId,refetch]);
  let  IDcartitemid :string;
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
      IDcartitemid = cartitemid // i did this because the state doesn't work but let  IDcartitemid :string; work
      // setCheckState(true)
      // Call handleAddToCategories immediately after adding the item
      setCartitemid(cartitemid);
      // Update the quantity locally
      setQuantity(newQuantity + quantity);
      handleAddToCategories();
    }
  };

  const SendFunc = async () => {
    try {
      
      await addItemToCartGroupLabel({
        variables: { cartItemId: IDcartitemid },
      });

    } catch (error) {
      toast.error("Failed to add item to group label");
      console.error(error);
    }
  };
  const handleAddToCategories = () => {
    // let timer;
  
  
    const  timer = setTimeout(() => {
        toast.success("Saving as UnGroup");
        toast.dismiss()

        SendFunc();
      }, 4000);
    
      // Check if user clicks yes or no
      CartToast({
        message: "Item added to categories",
        description:
          "Do you want to add this item to your selected categories? if no, just ignore it",
        onYes: () => {
          clearTimeout(timer); // Clear the timer if "Yes" is clicked
          console.log("Yes clicked, timer cleared"); // Ensure this is logged
          setIsDialogOpen(true);
      setCheckState(true)
          
        },
        onNo: () => {
          clearTimeout(timer);
          console.log("No clicked, timer cleared"); // Ensure this is logged
          toast.success("Saving as UnGroup");
          SendFunc();
        },
      });
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
          {quantity}
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

export default CartLogic;
