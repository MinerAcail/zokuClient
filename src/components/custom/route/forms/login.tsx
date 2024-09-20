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
import { LOGIN } from "./gql/mutation";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useAuth } from "@/middleware/context/authContext";

// Schema for form validation
const accountFormSchema = z.object({
  number: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Default values for the form fields
const defaultValues: Partial<AccountFormValues> = {
  number: "",
  password: "",
};

export function LoginForm() {
  const { login:Auth } = useAuth();
  const [login, { loading, error }] = useMutation(LOGIN);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(data: AccountFormValues) {
    try {
      const { data: result } = await login({
        variables: {
          input: {
            number: data.number,
            pin: data.password, // Assuming `pin` corresponds to the password field
          },
        },
      });

      console.log("Mutation result:", result); // Debug log for result

      if (result?.login) {
        console.log("Auth :",result);

        Auth(result?.login)
        setSuccessMessage(`${result.login.name} has signIn`);
      }
    } catch (err) {
      console.error("Error creating vendor:", err);
      setSuccessMessage(null); // Clear success message on error
    }
  }

  return (
    <div className="flex justify-center items-center pt-[5%]">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 text-left bg-[#2D2C30] px-6 py-5 rounded-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 "
          >
            <FormField
              control={form.control}
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
              control={form.control}
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


