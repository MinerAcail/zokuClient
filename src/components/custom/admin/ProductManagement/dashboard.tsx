import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Package, BarChart, AlertTriangle } from "lucide-react";
import { useState } from "react";

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

function PMDashboard({tabValue} :{tabValue:string}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(initialOrders);

  const getTotalRevenue = () => {
    return products
      .reduce((sum, product) => sum + product.price * product.salesLastMonth, 0)
      .toFixed(2);
  };

  const getTotalProfit = () => {
    return products
      .reduce(
        (sum, product) =>
          sum + (product.price - product.cost) * product.salesLastMonth,
        0
      )
      .toFixed(2);
  };
  const getTopSellingProducts = () => {
    return [...products]
      .sort((a, b) => b.salesLastMonth - a.salesLastMonth)
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return products.filter((product) => product.stock <= product.reorderPoint);
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
                  <div className="text-2xl font-bold">{products.length}</div>
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
                  <div className="text-2xl font-bold">${getTotalRevenue()}</div>
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
                  <div className="text-2xl font-bold">${getTotalProfit()}</div>
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
                    {getLowStockProducts().length}
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
                    23
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
                    10
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
                    123
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
