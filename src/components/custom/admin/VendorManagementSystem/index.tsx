import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import VendorCard from "./VendorCard";
import VendorDetails from "./VendorDetails";
import { Vendor, Order, transformData } from "./helper";
import { gql, useQuery } from "@apollo/client";

const ALL_CART_QUERY = gql`
  query AllCart {
    allCart {
      id
      userName
      userId
      items {
        id
        quantity
        product {
          id
          name
          price
          Vendor {
            id
            name
            number
            product {
              id
              name
              price
            }
          }
        }
      }
    }
  }
`;

export default function EnhancedVendorManagement() {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const { data, loading, error } = useQuery(ALL_CART_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // Log fetched data
  useEffect(() => {
    if (data) {
      const transform = transformData(data);
      console.log("Transformed data:", transform);
      setVendors(transform || []);
    }
  }, [data]);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const toggleVendorExpansion = (vendorId: string) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const filterOrders = (orders: Order[]) => {
    // Implement your filtering logic here
    return orders; // Update with actual filtering logic if needed
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-4 h-4" />
        <Input type="text" placeholder="Search vendors..." className="w-full" />
      </div>

      {vendors?.map((vendor) => (
        <div key={vendor.id}>
          <VendorCard
            vendor={vendor}
            expandedVendor={expandedVendor}
            toggleVendorExpansion={toggleVendorExpansion}
          />
          {expandedVendor === vendor?.id && (
            <VendorDetails
              vendor={vendor}
              filterOrders={filterOrders}
              expandedVendor={expandedVendor}
            />
          )}
        </div>
      ))}
    </div>
  );
}