import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { gql, useMutation, useQuery } from "@apollo/client";
const CLEAN_UP_ADD_ITEM_TO_CART = gql`
  mutation CleanUpAddItemToCart($cartItemId: String!) {
    CleanUpAddItemToCart(cartItemId: $cartItemId)
  }
`;
// Define your GraphQL queries and mutations
const GET_ALL_GROUP_LABELS = gql`
  query GetAllGroupLabel {
    getAllgroupLabel {
      id
      groupLabel
      items {
        id
      }
    }
  }
`;

export const ADD_GROUP_LABEL = gql`
  mutation AddGroupLabel($input: groupInput!) {
    addGroupLabel(input: $input) {
      id
      groupLabel
      __typename
      items {
        id
        cartItemId
        cartItemGroupID
        quantityGroup
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
    }
  }
`;

interface AddToCategoriesProps {
  isDialogOpen: boolean;
  onClose: () => void;
  cartitemid: string;
  checkState?: boolean;
  setCheckState:(state: boolean)=>void;
}

export default function AddToCategories({
  isDialogOpen,
  onClose,
  cartitemid,
  checkState,
  setCheckState
}: AddToCategoriesProps) {
  const { data, loading, error } = useQuery(GET_ALL_GROUP_LABELS);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  // Using the useMutation hook to get the mutate function
  const [CleanUpAddItemToCart] = useMutation(CLEAN_UP_ADD_ITEM_TO_CART);

  // Mutation for adding a new category
  const [addGroupLabel] = useMutation(ADD_GROUP_LABEL, {
    onCompleted: () => {
      toast.success(`${selectedCategory || newCategory} added to categories`);
      setNewCategory(""); // Clear the input after successful addition
      setSelectedCategory(""); // Clear the selected category after successful addition
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to add category");
    },
  });

  // Load categories when data is fetched
  useEffect(() => {
    if (data && data.getAllgroupLabel) {
      const loadedCategories = data.getAllgroupLabel.map(
        (group: { groupLabel: string }) => group.groupLabel
      );
      setCategories(loadedCategories);
    }
  }, [data]);

  // Handle toast notifications for loading and errors
  useEffect(() => {
    if(isDialogOpen){
      toast.dismiss()
    }
    let toastId: string | number | null = null; // Accept both string and number

    if (isDialogOpen && loading) {
      toastId = toast.loading("Loading categories...");
    }

    if (isDialogOpen && error) {
      toast.error(`Error loading categories: ${error.message}`);
    }

    if (!loading && toastId) {
      toast.dismiss(toastId); // This works for both string and number
    }

    return () => {
      // Cleanup toast if the component unmounts or loading finishes
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [loading, error, isDialogOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogContentRef.current &&
        !dialogContentRef.current.contains(event.target as Node)
      ) {
        console.log("Dialog closed by clicking outside");
        toast.error("Dialog closed by clicking outside");
      }
    };

    if (isDialogOpen) {
      // Add click event listener when the dialog is open
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Clean up event listener when the dialog closes
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  const addCategory = () => {
    // Determine which category to add
    const categoryToAdd = selectedCategory || newCategory.trim();

    if (categoryToAdd !== "") {
      // Call the mutation to add the new category
      addGroupLabel({
        variables: {
          input: {
            groupLabel: categoryToAdd,
            cartItemId: cartitemid,
            quantityGroup: 1,
          },
        },
      });
      setCategories((prev) => [...prev, categoryToAdd]); // Update the categories state
      setNewCategory(""); // Clear input after adding
      setSelectedCategory(""); // Clear selected category after adding
      onClose();
    } else {
      toast.error("Category already exists or is invalid");
    }
  };
 



   // Define the handleAddGroupLabel function
   const handleAddGroupLabel = useCallback(async () => {
    try {
      await CleanUpAddItemToCart({
        variables: {
          cartItemId: cartitemid,
        },
      });
      toast.success("Successfully cleaned up item from cart!");
    } catch (error) {
      console.error("Error cleaning up item:", error);
      toast.error("Failed to clean up item.");
    }
  },[cartitemid,CleanUpAddItemToCart]);

  useEffect(() => {

  
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (checkState) {
        // Handle adding the group label
        handleAddGroupLabel();
  
        // Prevent the default behavior and show a confirmation dialog
        event.preventDefault();
        event.returnValue = ''; // Chrome requires returnValue to show a confirmation dialog
      }
    };
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && checkState) {
        handleAddGroupLabel();
        setCheckState(false); // Reset checkState
      }
    };
  
    const handlePopState = () => {
      toast.error('Back button or browser navigation detected.');
      console.log('Back button or browser navigation detected.');
    };
  
    // Attach the event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener("keydown", handleKeyDown);
  
    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [checkState, setCheckState, cartitemid,handleAddGroupLabel]); // Added cartitemid to dependencies
  
  const onOverlay = () => {
    toast.error("You Just closed Your Dialog");
    handleAddGroupLabel();
    setCheckState(false);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#f7f8fd] rounded-[20px]"
        onOverlay={onOverlay}
        onOverlayX={onOverlay}
      >
        {/* <DialogOverlay className="bg-[blue]"> */}

        <DialogTitle>Select Category</DialogTitle>
        <Card className="w-full max-w-md bg-[#f7f8fd] mx-auto">
          <div className="space-y-4">
            <div>
              <RadioGroup
                className="grid grid-cols-2"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Add New Category:</h4>
              <div className="flex items-center space-x-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                />
                <Button onClick={addCategory}>Add</Button>
              </div>
            </div>
          </div>
        </Card>
        <DialogFooter className="sm:justify-start">
          <DialogClose onClick={onOverlay} asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
