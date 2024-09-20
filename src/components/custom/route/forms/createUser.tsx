import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";

// GraphQL mutation
const CREATE_USER = gql`
  mutation CreateUser($input: NewUser!) {
    createUser(input: $input) {
      id
      name
      number
      pin
      createdAt
    }
  }
`;

// Schema for form validation
const accountFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(30, { message: "Name must not be longer than 30 characters." }),
    number: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirm: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters." }),
 
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Default values for the form fields 
const defaultValues: Partial<AccountFormValues> = {
  name: "",
  number: "",
  password: "",
  confirm: "",
};

export function UserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const { control, handleSubmit } = form;

  async function onSubmit(data: AccountFormValues) {
    try {
      console.log("variables", {
        input: {
          name: data.name,
          number: data.number,
          pin: data.password, // Assuming `pin` corresponds to the password field
        },
        
      });

      const { data: result } = await createUser({
        variables: {
          input: {
            name: data.name,
            number: data.number,
            pin: data.password, // Assuming `pin` corresponds to the password field
          },
          
        },
      });

      console.log("Mutation result:", result);

      if (result?.createUser) {
        setSuccessMessage(`User ${result.createUser.name} is created`);
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error creating User:", err);
      setSuccessMessage(null);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 text-left bg-[#2D2C30] px-6 py-5 rounded-xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>Please use your full name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please add your WhatsApp number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Update account"}
            </Button>

            {successMessage && (
              <div className="flex items-center justify-center mt-4 text-green-500">
                {successMessage}
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error.message}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
}
