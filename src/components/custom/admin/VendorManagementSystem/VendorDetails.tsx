import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import { Vendor, Order } from "./helper";
  import OrdersTab from "./OrdersTab";
  import ShopItemsTab from "./ShopItemsTab";
  
  type VendorDetailsProps = {
    vendor: Vendor;
    expandedVendor: string | null;
    filterOrders: (orders: Order[]) => Order[];
  };
  
  export default function VendorDetails({
    vendor,
    expandedVendor,
    filterOrders,
  }: VendorDetailsProps) {
    if (expandedVendor !== vendor?.id) return null;
   // console.log("1orders",vendor.orders);
  
    return (
      <div className="mt-4 bg-[#ecd0c2] p-4 m-3 tex rounded-[10px]">
        <Tabs defaultValue="orders" className="w-full ">
          <TabsList className="grid w-full grid-cols-2 rounded-[7px]">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="shop">Shop Items</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <OrdersTab vendor={vendor} filterOrders={filterOrders} />
          </TabsContent>
          <TabsContent value="shop">
           { 
            <ShopItemsTab vendor={vendor} />
            }
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  