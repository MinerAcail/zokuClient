import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Package, BarChart, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart as BarChartComponent,
} from "recharts";
import { initialOrders, initialProducts, Order, Product } from ".";
import { gql, useQuery } from '@apollo/client';
import { ghSim } from "../VendorManagementSystem/helper";

const GET_PRODUCT_FOR_VPM = gql`
  query GET_PRODUCT_FOR_VPM {
    getProductforVPM {
      totalProducts
      totalRevenue
      totalProfit
      
      sideSwappers
      personalDeliveryItems
      zukoDeliveryItems
    }
  }
`;  

interface GetProductForVPMData {
  totalProducts: string;
  totalRevenue: string;
  totalProfit: string;
  lowStock: string;
  sideSwappers: string;
  personalDeliveryItems: string;
  zukoDeliveryItems: string;
}
function PMDashboard({tabValue} :{tabValue:string}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productsVpm, setProductsVpm] = useState<GetProductForVPMData>();
  const [orders] = useState<Order[]>(initialOrders);
  const { data, loading, error } = useQuery(GET_PRODUCT_FOR_VPM);
  console.log("data",data);
  useEffect(() => {
    if (data) {
      setProductsVpm(data.getProductforVPM);
    }
  }, [data]);


  const getTopSellingProducts = () => {
    return [...products]
      .sort((a, b) => b.salesLastMonth - a.salesLastMonth)
      .slice(0, 5);
  };


  const getOrderStatusCounts = () => {
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      statusCounts[order.status]++;
    });
    return statusCounts;
  };

  return (
    <div >
      <TabsContent value={tabValue}>
        <Card className="mb-4 bg-[#fff3ff]">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productsVpm?.totalProducts || 0}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue (Last Month)
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ghSim} {productsVpm?.totalRevenue || 0}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Profit (Last Month)
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ghSim} {productsVpm?.totalProfit || 0}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm" >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Alerts
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {productsVpm?.lowStock || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm" >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Side  Swapper
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {productsVpm?.sideSwappers || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm" >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Personal Delivery
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {productsVpm?.personalDeliveryItems || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm" >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Zuko Delivery
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {productsVpm?.zukoDeliveryItems || 0} 
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChartComponent data={getTopSellingProducts()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="salesLastMonth"
                        fill="#8884d8"
                        name="Sales Last Month"
                      />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChartComponent
                      data={Object.entries(getOrderStatusCounts()).map(
                        ([status, count]) => ({ status, count })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#82ca9d"
                        name="Number of Orders"
                      />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}

export default PMDashboard;
