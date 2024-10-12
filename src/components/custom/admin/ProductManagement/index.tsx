import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PMDashboard from "./dashboard";
import PMProduct from "./product";
import PMOrder from "./order";
import PMDataControl from "./ dataControl";
import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  lastOrderDate: string;
  salesLastMonth: number;
  qualityScore: number;
  defectRate: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: { productId: string; quantity: number }[];
  totalAmount: number;
}

export interface QualityCheck {
  id: string;
  productId: string;
  date: string;
  passedInspection: boolean;
  notes: string;
}

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Premium Widget",
    sku: "WID-001",
    category: "Widgets",
    price: 29.99,
    cost: 15.0,
    stock: 150,
    reorderPoint: 50,
    supplier: "WidgetCo",
    lastOrderDate: "2023-09-15",
    salesLastMonth: 75,
    qualityScore: 4.5,
    defectRate: 0.02,
  },
  {
    id: "2",
    name: "Deluxe Gadget",
    sku: "GAD-002",
    category: "Gadgets",
    price: 49.99,
    cost: 25.0,
    stock: 100,
    reorderPoint: 30,
    supplier: "GadgetInc",
    lastOrderDate: "2023-09-20",
    salesLastMonth: 50,
    qualityScore: 4.2,
    defectRate: 0.03,
  },
  {
    id: "3",
    name: "Super Gizmo",
    sku: "GIZ-003",
    category: "Gizmos",
    price: 39.99,
    cost: 20.0,
    stock: 200,
    reorderPoint: 75,
    supplier: "GizmoTech",
    lastOrderDate: "2023-09-10",
    salesLastMonth: 100,
    qualityScore: 4.8,
    defectRate: 0.01,
  },
];

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "John Doe",
    orderDate: "2023-10-01",
    status: "shipped",
    items: [
      { productId: "1", quantity: 2 },
      { productId: "2", quantity: 1 },
    ],
    totalAmount: 109.97,
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    orderDate: "2023-10-02",
    status: "processing",
    items: [{ productId: "3", quantity: 3 }],
    totalAmount: 119.97,
  },
  {
    id: "ORD-003",
    customerId: "CUST-003",
    customerName: "Bob Johnson",
    orderDate: "2023-10-03",
    status: "pending",
    items: [
      { productId: "1", quantity: 1 },
      { productId: "3", quantity: 2 },
    ],
    totalAmount: 109.97,
  },
];

export const initialQualityChecks: QualityCheck[] = [
  {
    id: "QC-001",
    productId: "1",
    date: "2023-09-30",
    passedInspection: true,
    notes: "All units passed quality standards.",
  },
  {
    id: "QC-002",
    productId: "2",
    date: "2023-09-29",
    passedInspection: false,
    notes: "3 units failed due to faulty wiring. Batch held for rework.",
  },
  {
    id: "QC-003",
    productId: "3",
    date: "2023-09-28",
    passedInspection: true,
    notes: "Minor cosmetic issues in 2 units, but within acceptable range.",
  },
];

export default function ProductManagement() {
  const [selectedTab, setSelectedTab] = useState("products");

  return (
    <div className="container mx-auto  bg-[#fff3ff] rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4">
        Vendor Product Management (VPM)
      </h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="rounded-xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          
            <Link     
            className="inline-flex items-center rounded-xl justify-center whitespace-nowrap  px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50 "
             to={"/vendercheckout"}>Orders</Link>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <PMDashboard tabValue="dashboard" />

        <PMProduct tabValue="products" />

        <PMDataControl tabValue="quality" />
      </Tabs>
    </div>
  );
}
