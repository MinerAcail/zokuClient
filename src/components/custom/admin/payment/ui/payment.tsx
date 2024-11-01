import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { toast } from "sonner";

// Define the CreateOrder mutation
const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customerName
      status
      paymentStatus
      shippingMethod
      trackingNumber
      estimatedDeliveryDate
      momoNumber
      orderItems {
        id
      }
    }
  }
`;

export default function PaymentDialog({
  children,
  itemsIds,
  selectionlocation,
}: {
  selectionlocation: string;
  children: React.ReactNode;
  itemsIds: string[];
}) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [setProvider] = useState<string>("mtn"); // Restrict providers to MTN and Vodafone
  const navigate = useNavigate();

  // Use mutation hook
  const [createOrder, { data, loading, error }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      onCompleted: () => {
        // Redirect to final cart page or success page
        toast.success("Redirect to your ordered items");

        navigate("/userfinalcart");
      },
    }
  );
  console.log("data", data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrder({
        variables: {
          input: {
            deliveryAddress: selectionlocation,
            momoNumber: phoneNumber,
            cartItemId: itemsIds,
          },
        },
      });
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Error creating order:");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="mtn"
          onValueChange={(value: string) => setProvider(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mtn">MTN</TabsTrigger>
            <TabsTrigger value="vodafone">Vodafone</TabsTrigger>
          </TabsList>
          <TabsContent value="mtn">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="phone-mtn">Phone Number</Label>
                <Input
                  id="phone-mtn"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="0XX XXX XXXX"
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Processing..." : "Pay with MTN"}
              </Button>
              {error && (
                <p className="text-red-500">Error processing payment.</p>
              )}
            </form>
          </TabsContent>
          <TabsContent value="vodafone">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="phone-vodafone">Phone Number</Label>
                <Input
                  id="phone-vodafone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="0XX XXX XXXX"
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Processing..." : "Pay with Vodafone"}
              </Button>
              {error && (
                <p className="text-red-500">Error processing payment.</p>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
