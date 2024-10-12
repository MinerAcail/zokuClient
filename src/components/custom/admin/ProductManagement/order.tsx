import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { initialOrders, Order } from ".";
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
import { gql, useQuery } from "@apollo/client";
import { ghSim } from "../VendorManagementSystem/helper";
const GET_CART_USERS_BY_VENDOR_ID = gql`
  query GetCartUsersByVendorID {
    getCartUsersByVendorId{
      orderId
      customer
      date
      status
      totalAmount
    }
  }
`;
interface CartUser {
  orderId: string;
  customer: string;
  date: string;
  status: string;
  totalAmount: string;
}
function PMOrder({ tabValue }: { tabValue: string }) {
  const [orders] = useState<Order[]>(initialOrders);
  const [orderData, setOrderData] = useState<CartUser[]>([]);
  const { data, loading, error } = useQuery(GET_CART_USERS_BY_VENDOR_ID);

  useEffect(() => {
    if (data) {
      setOrderData(data.getCartUsersByVendorId);
    }
  }, [data]);

  return (
    <div>
      <TabsContent value={tabValue}>
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId.slice(0, 6)}</TableCell> {/* 6 characters of orderId  example: 1234567890 to 123456 */}
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ghSim} {order.totalAmount}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}

export default PMOrder;
