import { useState } from "react";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CreditCard,
  Search,
  ChevronDown,
  ChevronUp,
  Truck,
  ShoppingBag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { gql } from "@apollo/client";
import  {
  ErrorMessage,
  LoadingSpinner,
} from "../../useAble/LoadAndErrorStatus";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
}

interface CartItem {
  product: Product;
}

interface OrderItem {
  id: string;
  quantityGroup: number;
  cartItem: CartItem;
}

interface Order {
  id: string;
  createdAt: string;
  trackingNumber?: string;
  momoNumber?: string;
  status: "Delivered" | "Shipped" | "Processing";
  orderItems: OrderItem[];
}

const GET_ORDER_HISTORY = gql`
  query orderHistory {
    orderHistory {
      id
      createdAt
      trackingNumber
      momoNumber
      status
      orderItems {
        id
        quantityGroup
        cartItem {
          product {
            id
            name
            price
            imageUrls
          }
        }
      }
    }
  }
`;

const statusColors = {
  Delivered: "bg-green-500",
  Shipped: "bg-blue-500",
  Processing: "bg-yellow-500",
};

export default function CartHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  // Fetch order history data
  const { loading, error, data } = useQuery<{ orderHistory: Order[] }>(
    GET_ORDER_HISTORY
  );
  const orderHistory = data?.orderHistory || [];

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredHistory = orderHistory.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems.some((item) =>
        item.cartItem.product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );

  // const calculateTotalSum = () => {
  //   return filteredHistory.reduce((orderSum, order) => {
  //     const orderTotal = order.orderItems.reduce((itemSum, item) => {
  //       return itemSum + item.cartItem.product.price * item.quantityGroup;
  //     }, 0);
  //     return orderSum + orderTotal;
  //   }, 0);
  // };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-3xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-8 w-8" /> Your Order History
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-64 bg-white/20 border-white/30 text-white placeholder-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-fit">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message="Error loading order history." />
          ) : (
            filteredHistory.map((order) => (
              <div
                key={order.id}
                className="p-6 border-b border-gray-200 last:border-b-0 transition-all duration-300 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xl font-semibold text-gray-800 mb-2">
                      Order {order.id.substring(0, 5)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="mr-1 h-4 w-4" />
                      {moment(order.createdAt).format("MMMM D, YYYY")}
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Truck className="mr-1 h-4 w-4" />
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      className={`${
                        statusColors[order.status]
                      } text-white mb-2 px-3 py-1 rounded-full`}
                    >
                      {order.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                    >
                      {expandedOrders.includes(order.id) ? (
                        <>
                          Hide Details <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show Details <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {expandedOrders.includes(order.id) && (
                  <div className="mt-4 space-y-4 animate-fadeIn">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.cartItem.product.imageUrls[0]}
                            alt={item.cartItem.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.cartItem.product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantityGroup}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">
                          $
                          {(
                            item.cartItem.product.price * item.quantityGroup
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="mr-1 h-4 w-4" />
                        {order.momoNumber}
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        Total: ${/* {calculateTotalSum()} */}
                        {order.orderItems
                          .reduce(
                            (sum, item) =>
                              sum +
                              item.cartItem.product.price * item.quantityGroup,
                            0
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                          >
                            View Invoice
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Invoice for Order {order.id}
                            </DialogTitle>
                            <DialogDescription>
                              Here's a detailed breakdown of your order.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="secondary"
                        className="bg-indigo-600 text-white"
                      >
                        Track Shipment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
