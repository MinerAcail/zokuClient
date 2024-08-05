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
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";  
    const accountFormSchema = z.object({
      name: z.string().optional(),
      price: z.string().optional(),
      state: z.string().optional(),
      brand: z.string().optional(),
      description: z
        .string().optional()
        // .min(6, { message: "Description or Title must be at least 6 characters." }),
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
    interface FormInputProps {

      onSubmit: (data: VendorFormValues) => void;

    }

    export function FormInput({ onSubmit }: FormInputProps) {
      const form = useForm<VendorFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
      });

      

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex ">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>Name of the Product.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex ">Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Price" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex ">State</FormLabel>
                  <FormControl>
                    <Input placeholder="Product State" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex ">Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Brand" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      // type="Description"
                      placeholder="Your Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         
            
          </form>
        </Form>
      );
    }
