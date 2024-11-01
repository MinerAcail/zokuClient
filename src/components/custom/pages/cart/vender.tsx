import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Truck,
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PMOrder from "../../admin/ProductManagement/order";
import { ghSim } from "../../admin/VendorManagementSystem/helper";
import PMOverview from "../../admin/ProductManagement/overview";

// Sample data for charts
const deliveryData = [
  { name: "Mon", onTime: 120, delayed: 20 },
  { name: "Tue", onTime: 132, delayed: 18 },
  { name: "Wed", onTime: 101, delayed: 25 },
  { name: "Thu", onTime: 134, delayed: 16 },
  { name: "Fri", onTime: 90, delayed: 30 },
  { name: "Sat", onTime: 70, delayed: 10 },
  { name: "Sun", onTime: 50, delayed: 5 },
];

export default function VenderFinalCheckout() {
  const [inventoryLevel, setInventoryLevel] = useState(72);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Company Delivery Dashboard</CardTitle>
          <CardDescription>
            Monitor and manage delivery operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <PMOrder tabValue="orders" />
            <PMOverview tabValue="overview" />

              {/* <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Orders
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">
                        +15% from last month
                      </p>
                    </CardContent>
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
              </TabsContent> */}
            <TabsContent value="inventory">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          Stock Level:
                        </span>
                        <span className="ml-2 text-2xl font-bold">
                          {inventoryLevel}%
                        </span>
                      </div>
                      <Progress value={inventoryLevel} className="w-full" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Low Stock</span>
                        <span>Optimal</span>
                        <span>Overstocked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Low Stock Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Widget X</span>
                          <Badge variant="destructive">Critical</Badge>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Gadget Y</span>
                          <Badge variant="warning">Low</Badge>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Restock Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Widget X</span>
                          <span>Order 500 units</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Gadget Y</span>
                          <span>Order 200 units</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="logistics">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Deliveries Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Interactive Map View
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Fleet Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Total Vehicles</span>
                          <span>50</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Active</span>
                          <span>35</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>In Maintenance</span>
                          <span>5</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Available</span>
                          <span>10</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Route Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Current Efficiency Score
                        </p>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">87%</span>
                          <Badge className="ml-2" variant="secondary">
                            +5%
                          </Badge>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          Optimize Routes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      onTime: {
                        label: "On Time",
                        color: "hsl(var(--chart-1))",
                      },
                      delayed: {
                        label: "Delayed",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deliveryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="onTime"
                          stackId="a"
                          fill="var(--color-onTime)"
                        />
                        <Bar
                          dataKey="delayed"
                          stackId="a"
                          fill="var(--color-delayed)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Performance Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span>On-Time Delivery Rate</span>
                        <span className="font-bold">95%</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Average Delivery Time</span>
                        <span className="font-bold">2.3 hours</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Customer Satisfaction Score</span>
                        <span className="font-bold">4.8/5</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Issues and Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center text-yellow-500">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>3 deliveries running late</span>
                      </li>
                      <li className="flex items-center text-red-500">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>1 vehicle reported maintenance issue</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
