import { useEffect, useState } from "react";
//import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import VendorCard from "./VendorCard";
import VendorDetails from "./VendorDetails";
import { Vendor, Order, transformData } from "./helper";
import { gql, useQuery } from "@apollo/client";
import { Search } from "../../NavBars/search";

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
          stock
          Vendor {
            id
            name
            number
            product {
              id
              name
              stock 
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
      setVendors(transform || []);
    }
  }, [data]);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
console.log("vendors", vendors)
  const toggleVendorExpansion = (vendorId: string) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const filterOrders = (orders: Order[]) => {
    // Implement your filtering logic here
    return orders; // Update with actual filtering logic if needed
  };

  return (
    <div className="p-4">
              <Search />


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