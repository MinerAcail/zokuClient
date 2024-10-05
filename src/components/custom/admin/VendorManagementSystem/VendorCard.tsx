import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import {  Phone, ChevronDown, ChevronUp } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Vendor } from "./helper";
  
  type VendorCardProps = {
    vendor: Vendor;
    expandedVendor: string | null;
    toggleVendorExpansion: (vendorId: string) => void;
  };
  
  export default function VendorCard({
    vendor,
    expandedVendor,
    toggleVendorExpansion,
  }: VendorCardProps) {
    return (
      <Card key={vendor.id} className="mb-4 bg-[#fff3ff]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">{vendor.name}</CardTitle>
            <Badge
              variant={
                vendor.status === "active"
                  ? "default"
                  : vendor.status === "inactive"
                  ? "secondary"
                  : "outline"
              }
            >
              {vendor.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div>
              
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> {vendor.phone}
              </p>
            </div>
            <div>
              <p>Last Order: {vendor.lastOrderDate}</p>
              <p>Total Orders: {vendor.totalOrders}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => toggleVendorExpansion(vendor.id)}
            className="w-full justify-between"
          >
            {expandedVendor === vendor.id ? "Hide Details" : "Show Details"}
            {expandedVendor === vendor.id ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
  