import { useState } from 'react';
import { PaystackConsumer } from 'react-paystack';  // Adjust import path as necessary
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaystackProps } from 'react-paystack/dist/types';
import { Link } from 'react-router-dom';
//import { PaystackProps } from './types';  // Import your Paystack types

// Replace with your Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_2d6e36e8ec438d929401f1c4f2f097eeb268fcd1';

export default function PaystackPayment({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState<string>('');  // Use string to handle input values
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [provider, setProvider] = useState<'mtn' | 'vodafone'>('mtn');  // Restrict providers to MTN and Vodafone

  const config: PaystackProps = {
    reference: (new Date()).getTime().toString(),
    email: `${phoneNumber}@mobilemoney.com`, 
    amount: parseFloat(amount) * 100, // Paystack expects amount in the smallest currency unit (e.g., kobo or cents)
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      phone: phoneNumber,
      provider: provider,
      custom_fields: [] // Add this line to support custom metadata fields
    },
   

    
    // Add other Paystack configuration options as needed
  };

  // Types for the response object returned by Paystack
  interface PaystackSuccessResponse {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    message: string;
  }

  const handleSuccess = (reference: PaystackSuccessResponse) => {
    console.log("Payment successful", reference);
    // Call backend API to verify transaction and update the database
  };

  const handleClose = () => {
    console.log("Payment closed");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="mtn" onValueChange={(value: 'mtn' | 'vodafone') => setProvider(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mtn">MTN</TabsTrigger>
            <TabsTrigger value="vodafone">Vodafone</TabsTrigger>
          </TabsList>
          <TabsContent value="mtn">
            <form className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="amount-mtn">Amount (GHS)</Label>
                <Input
                  id="amount-mtn"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
              <Link to={"/userfinalcart"}> 
              
              <Button className="w-full" >
                    Pay with MTN
                  </Button>
              </Link>
              {/*<PaystackConsumer {...config} onSuccess={()=>handleSuccess} onClose={handleClose}>
                {({ initializePayment }) => (
                  <Button className="w-full" onClick={() => initializePayment(handleSuccess, handleClose)}>
                    Pay with MTN
                  </Button>
                )}
              </PaystackConsumer>*/}
            </form>
          </TabsContent>
          <TabsContent value="vodafone">
            <form className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="amount-vodafone">Amount (GHS)</Label>
                <Input
                  id="amount-vodafone"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
              <PaystackConsumer {...config} onSuccess={()=>handleSuccess} onClose={handleClose}>
                {({ initializePayment }) => (
                  <Button className="w-full" onClick={() => initializePayment(handleSuccess, handleClose)}>
                    Pay with Vodafone
                  </Button>
                )}
              </PaystackConsumer>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
