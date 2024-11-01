import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Edit, ShoppingCart, Truck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { gql, useQuery } from "@apollo/client";
import { ghSim } from "../VendorManagementSystem/helper";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Empty, {
  ErrorMessage,
  LoadingSpinner,
} from "../../useAble/LoadAndErrorStatus";

const ORDER_GROWTH = gql`
  query GetCalculateOrderGrowthData {
    getCalculateOrderGrowthData {
      totalOrders
      orders
      percentage
    }
  }
`;

interface CartUser {
  totalOrders: string;
  orders: string;
  percentage: string;
}

function PMOverview({ tabValue }: { tabValue: string }) {
  const { data, loading, error } = useQuery(ORDER_GROWTH);
  const [orderData, setOrderData] = useState<CartUser>();

  useEffect(() => {
    if (data) {
      setOrderData(data.getCalculateOrderGrowthData);
    }
  }, [data]);

  return (
    <div>
      <TabsContent value={tabValue}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-lg rounded-lg p-4">

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error.message} />
            ) : (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent className="mt-2">
                  <div className=" w-3/4 m-auto flex justify-between">
                    <h4 className="text-base font-bold text-gray-900"> Total:</h4>
                    <span className="text-2xl font-bold text-gray-900">
                      {orderData?.totalOrders}
                    </span>
                  </div>
                  <div className=" w-3/4 m-auto flex justify-between">
                    <h4 className="text-base font-bold text-gray-900"> This Week's </h4>
                    <span className="text-2xl font-bold text-gray-900">
                      {orderData?.orders}
                    </span>
                  </div>
                  <div className=" w-3/4 m-auto flex justify-between">
                    <p className="text-sm text-green-600 mt-1">
                      {orderData?.percentage}
                    </p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Deliveries
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" /> 
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                23 scheduled for today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delivery Revenue
              </CardTitle>

              <div className="h-4 w-4 text-muted-foreground">
                {ghSim.slice(2, 3)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ghSim} 23,456</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Customer Satisfaction
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}

export default PMOverview;
