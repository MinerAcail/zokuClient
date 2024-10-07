import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash,
  BarChart,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartComponent,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { initialOrders, initialProducts, initialQualityChecks, Order, Product, QualityCheck } from ".";

function PMDataControl({tabValue} :{tabValue:string}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(initialOrders);
  const [qualityChecks, ] =
  useState<QualityCheck[]>(initialQualityChecks);

  const getAverageQualityScore = () => {
    const totalScore = products.reduce(
      (sum, product) => sum + product.qualityScore,
      0
    );
    return (totalScore / products.length).toFixed(2);
  };

  const getAverageDefectRate = () => {
    const totalDefectRate = products.reduce(
      (sum, product) => sum + product.defectRate,
      0
    );
    return ((totalDefectRate / products.length) * 100).toFixed(2);
  };

  return (
    <div>
      <TabsContent value={tabValue}>
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Quality Score
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getAverageQualityScore()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Defect Rate
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getAverageDefectRate()}%
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Passed Inspection</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>{check.date}</TableCell>
                      <TableCell>
                        {products.find((p) => p.id === check.productId)?.name}
                      </TableCell>
                      <TableCell>
                        {check.passedInspection ? (
                          <Badge variant="default">Passed</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell>{check.notes}</TableCell>
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

export default PMDataControl;
