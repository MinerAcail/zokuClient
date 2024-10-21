import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { gql, useMutation, useQuery } from "@apollo/client";

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

const ADD_GROUP_LABEL = gql`
  mutation AddGroupLabel($input: groupInput!) {
    addGroupLabel(input: $input) {
      id
      groupLabel
      items {
        id
        cartItemId
        cartItemGroupID
        quantityGroup
        createdAt
        updatedAt
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
}

export default function AddToCategories({
  isDialogOpen,
  onClose,
  cartitemid,
}: AddToCategoriesProps) {
  const { data, loading, error } = useQuery(GET_ALL_GROUP_LABELS);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const addCategory = () => {
    // Determine which category to add
    const categoryToAdd = selectedCategory || newCategory.trim();

    if (categoryToAdd !== "" ) {
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
    } else {
      toast.error("Category already exists or is invalid");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#f7f8fd] rounded-[20px]">
        <Card className="w-full max-w-md bg-[#f7f8fd] mx-auto">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Select Category:</h4>
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
      </DialogContent>
    </Dialog>
  );
}
