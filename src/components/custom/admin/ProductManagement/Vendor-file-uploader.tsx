import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

// Adjusted GraphQL mutation to update product
const UPDATE_PRODUCT = gql`
  mutation UpdateProductById($productId: String!, $input: ProductUpdateInput!) {
    updateProductById(productId: $productId, input: $input) {
      id
      price
      name
      state
      title
      updatedAt
      createdAt
    }
  }
`;

// Define the form schema
const accountFormSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  state: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
});

export type VendorFormValues = z.infer<typeof accountFormSchema>;

// Default values for the form fields
const defaultValues: Partial<VendorFormValues> = {
  name: "",
  brand: "",
  price: "",
  state: "",
  description: "",
};

export function VendorFileUploaderEdit() {
  const { productId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();

  const [vendorUpload] = useMutation(UPDATE_PRODUCT);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{
    title: string;
    description: string;
    action?: () => void;
  } | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const { handleSubmit, control } = form;

  const handleUpload = async () => {
    try {
      const { data } = await vendorUpload({
        variables: {
          productId,
          input: {
            name: form.getValues("name") || undefined, // Include only if not empty
            title: form.getValues("description") || undefined,
            state: form.getValues("state") || undefined,
            brand: form.getValues("brand") || undefined,
            price: form.getValues("price") || undefined,
          },
        },
      });

      if (data) {
        setDialogContent({
          title: "Update Successful",
          description: `Product updated successfully`,
          action: () => setDialogOpen(false),
        });
        setDialogOpen(true);
        form.reset(); // Reset form fields after successful upload
      }
    } catch (error) {
      setDialogContent({
        title: "Update Failed",
        description: `Failed to update product`,
        action: () => setDialogOpen(false),
      });
      setDialogOpen(true);
    }
  };

  const onSubmit = async () => {
    await handleUpload();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="w-full sm:w-1/2 m-auto flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">State</FormLabel>
                  <FormControl>
                    <Input placeholder="Product State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      {dialogOpen && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogContent?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogContent?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={dialogContent?.action}>
                Close
              </AlertDialogCancel>
              {dialogContent?.action && (
                <AlertDialogAction
                  onClick={() => {
                    dialogContent.action;
                    navigate("/pms");
                  }}
                >
                  Confirm
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
