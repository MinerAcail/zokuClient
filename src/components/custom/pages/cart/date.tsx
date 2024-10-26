import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LocationSelector from "../../admin/payment/ui/map";
import PaystackPayment from "../../admin/payment/ui/payment";

export function DateSelector({ labelData,key }: { labelData: string ,key:string}) {
 
  return (
    <Card key={key} className="w-full max-w-md mx-auto bg-slate-500 rounded-[10px]">
      <CardContent className="p-6 flex flex-row gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-blue-500 w-fit  m-auto border border-blue-500 rounded-lg shadow-md py-2 px-4 transition-all duration-300 hover:bg-blue-500 hover:text-white"
            >
              Proceed to Checkout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6 m-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Location
            </h2>
            <LocationSelector />
            <PaystackPayment>
              <Button
                variant="outline"
                className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-4 w-full shadow-lg transition-all duration-300 hover:bg-blue-600"
              >
                Make a Payment
              </Button>
            </PaystackPayment>
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between">
          <div className="text-center font-semibold">
            {labelData}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
