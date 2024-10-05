import { Order, Vendor } from "./helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getStatusBadge, getPaymentStatusBadge } from "./helper";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table"; // Assuming Table components are available
import { Download } from "lucide-react";

type OrdersTabProps = {
  vendor: Vendor;
  filterOrders: (orders: Order[]) => Order[];
};

//todo add the filterOrders func
export default function OrdersTab({ vendor, filterOrders }: OrdersTabProps) {

  return (
    <>
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          {/* Add the Select for filtering, Calendar, and Search input */}
          <Select>
            <SelectTrigger className="w-[180px] rounded-[8px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild className="rounded-[8px] ">
              <Button variant="outline">Select Date Range</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            placeholder="Search orders..."
            className="w-[200px] rounded-[8px]"
          />
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {vendor.orders.map((order) => (
          <AccordionItem value={order.id} key={order.id}>
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full">
                <span>Order ID: {order.id}</span>
                {getStatusBadge(order.status)}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Customer and order info */}
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>Customer:</strong> {order.customerName} (ID:{" "}
                      {order.customerId})
                    </p>
                    <p>
                      <strong>Date:</strong> {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    {getPaymentStatusBadge(order.paymentStatus)}
                    <p>
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Delivery and shipping details */}
                <div>
                  <p>
                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                  </p>
                  <p>
                    <strong>Shipping Method:</strong> {order.shippingMethod}
                  </p>
                  <p>
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong>{" "}
                    {order.estimatedDeliveryDate}
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="bg-muted p-2 rounded-md">
                  <h4 className="font-semibold mb-2">Order Status Timeline</h4>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        order.status === "processing" ? "default" : "outline"
                      }
                    >
                      Processing
                    </Badge>
                    <ChevronRight className="w-4 h-4" />
                    <Badge
                      variant={
                        order.status === "shipped" ? "default" : "outline"
                      }
                    >
                      Shipped
                    </Badge>
                    <ChevronRight className="w-4 h-4" />
                    <Badge
                      variant={
                        order.status === "delivered" ? "default" : "outline"
                      }
                    >
                      Delivered
                    </Badge>
                  </div>
                </div>

                {/* Table for Items */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>GH¢ {item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          GH¢ {(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Total price and Download Invoice */}
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">
                    Total: GH¢{" "}
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
