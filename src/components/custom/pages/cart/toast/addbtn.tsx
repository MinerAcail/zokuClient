import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddToCategories from "./addToCategories"; // Ensure the path is correct

export const AddToCategoriesButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(""); // State for the item name

  const handleOpenDialog = () => {
    setCurrentItem("Item Name"); // Set the current item here
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>Add to Categories</Button>
      <AddToCategories
        isDialogOpen={isDialogOpen}
        onClose={handleCloseDialog}
        currentItem={currentItem} // Pass the current item to the dialog
        setCurrentItem={setCurrentItem} // Pass the setter to the dialog
      />
    </>
  );
};
