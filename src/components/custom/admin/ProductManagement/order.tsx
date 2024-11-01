import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
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
import Empty, { ErrorMessage, LoadingSpinner } from "../../useAble/LoadAndErrorStatus";

const GET_CART_USERS_BY_VENDOR_ID = gql`
  query GetCartUsersByVendorID {
    getCartUsersByVendorId {
      id
      customerId
      customerName
      momoNumber
      createdAt
      updatedAt
      status
      orderItems {
        id
        vendorId
        quantityGroup
        cartItem {
          id
          product {
            id
            name
            vendorId
            price
          }
        }
      }
    }
  }
`;

interface Product {
  id: string;
  name: string;
  vendorId: string;
  price: string;
}

interface CartItem {
  id: string;
  product: Product;
}

interface OrderItem {
  id: string;
  vendorId: string;
  quantityGroup: number;
  cartItem: CartItem;
}

interface CartUser {
  id: string;
  customerId: string;
  customerName: string;
  momoNumber: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  orderItems: OrderItem[];
}

function PMOrder({ tabValue }: { tabValue: string }) {
  const { data, loading, error } = useQuery(GET_CART_USERS_BY_VENDOR_ID);
  const [orderData, setOrderData] = useState<CartUser[]>([]);

  useEffect(() => {
    if (data) {
      setOrderData(data.getCartUsersByVendorId);
    }
  }, [data]);

  


  // if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorMessage message={error.message} />;
  // if (orderData.length === 0) return <Empty message="No Order Found." />;
  


  return (
    <div>
    <TabsContent value={tabValue}>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : orderData.length === 0 ? (
        <Empty message="No Order Found." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>MoMo Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.momoNumber}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" size="sm">
                            {order.orderItems.length} Products
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                          <ScrollArea className="h-80">
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2">
                                Order Items
                              </h3>
                              {order.orderItems && order.orderItems.length > 0 ? (
                                <div className="space-y-3">
                                  {order.orderItems.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                      {index > 0 && (
                                        <Separator className="my-2" />
                                      )}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-gray-900">
                                            {item.cartItem.product.name}
                                          </span>
                                          <span className="text-gray-600 text-sm">
                                            {ghSim}{" "}
                                            {item.cartItem.product.price}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-500 text-sm">
                                            Quantity:
                                          </span>
                                          <span className="font-medium text-gray-800">
                                            {item.quantityGroup}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-500 text-sm">
                                            Total:
                                          </span>
                                          <span className="font-medium text-gray-800">
                                            {(item.quantityGroup *
                                              parseFloat(
                                                item.cartItem.product.price
                                              )).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">
                                  No items in this order.
                                </p>
                              )}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      {ghSim}{" "}
                      {order.orderItems
                        .reduce(
                          (total, item) =>
                            total +
                            parseFloat(item.cartItem.product.price) *
                              item.quantityGroup,
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
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
      )}
    </TabsContent>
  </div>
  
  );
}

export default PMOrder;
