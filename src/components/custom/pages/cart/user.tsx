import { useState } from "react";
import { Bell, Calendar, Clock, MapPin, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import LocationSelector from "../../admin/payment/ui/map";

export default function UserFinalCart() {
  const [progress, setProgress] = useState(66);

  return (
    <div className="mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl"> Track Delivery</CardTitle>
          <CardDescription>
            Track your package and manage delivery options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid  w-full grid-cols-3">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>
            <TabsContent value="status">
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order #12345</span>
                  <span className="text-sm text-muted-foreground">
                    Estimated delivery: June 15, 2023
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">
                      Your package is out for delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last location: Distribution Center, Springfield
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      John Doe
                      <br />
                      123 Main St
                      <br />
                      Anytown, ST 12345
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Order Details</h3>
                    <p className="text-sm text-muted-foreground">
                      1x Widget Pro
                      <br />
                      2x Gadget Mini
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="options">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="delivery-option"
                    className="text-sm font-medium"
                  >
                    Delivery Preference
                  </label>
                  <Select>
                    <SelectTrigger id="delivery-option">
                      <SelectValue placeholder="Select delivery option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Delivery (by Zuko)
                      </SelectItem>
                      <SelectItem value="express">
                        Vender Delivery (at your own risk)
                      </SelectItem>
                      <SelectItem value="pickup">
                        Local Pickup (at your own risk)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                  <LocationSelector Select="Change Location" />

                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/cart">
            <Button variant="outline" size="sm">
              <Package className="mr-2 h-4 w-4" />
              View Order Details
            </Button>
          </Link>
         
        </CardFooter>
      </Card>
    </div>
  );
}
