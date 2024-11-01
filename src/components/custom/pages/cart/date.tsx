import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LocationSelector from "../../admin/payment/ui/map";
import PaystackPayment from "../../admin/payment/ui/payment";
import { toast } from "sonner";
import { useState } from "react";

export function DateSelector({
  labelData,
  key,
  itemsIds,
}: {
  labelData: string;
  key: string;
  itemsIds: string[];
}) {
  const [selectionlocation, setSelectionLocation] = useState<string>("");

  const handleLocationSelector = (selection: string) => {
    if (selection) {
      toast.success(selection);
      setSelectionLocation(selection);
    }
  };
  return (
    <Card
      key={key}
      className="w-full max-w-md mx-auto bg-slate-500 rounded-[10px]"
    >
      <CardContent className="p-6 flex flex-row gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-blue-500 w-fit   border border-blue-500 rounded-lg shadow-md p-2  transition-all duration-300 hover:bg-blue-500 hover:text-white"
            >
              Proceed to Checkout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-6 m-4">
            <DialogTitle>Select Location</DialogTitle>

            <LocationSelector
              onLocationSelector={handleLocationSelector}
              itemsIds={itemsIds}
            />
            <PaystackPayment
              selectionlocation={selectionlocation}
              itemsIds={itemsIds}
            >
              <Button
                disabled={!selectionlocation}
                variant="outline"
                className="bg-blue-500 text-white rounded-lg py-2 px-4 mt-4 w-full shadow-lg transition-all duration-300 hover:bg-blue-600"
              >
                Make a Payment
              </Button>
            </PaystackPayment>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" className="p-2 w-fit">
          Track Shipment
        </Button>
        <div className="flex items-center m-auto justify-between text-white text-sm ">
          <div className="text-center font-semibold">{labelData}</div>
        </div>
      </CardContent>
    </Card>
  );
}
