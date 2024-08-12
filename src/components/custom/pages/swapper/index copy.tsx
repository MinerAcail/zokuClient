import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { AvatarDemo } from "./AvatarDemo";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

// GraphQL query
const GET_SIDE_SWAPPER_PRODUCTS = gql`
  query GetSideSwapperProducts {
    getSideSwapperProducts {
      VendorName
      count
      products {
        name
        price
        imageUrls
      }
    }
  }
`;

export function SwapperShop() {
  const { data, loading, error } = useQuery(GET_SIDE_SWAPPER_PRODUCTS);
  const [showAll, setShowAll] = useState([]);

  // Memoize AS to avoid re-computation on every render
  const AS = useMemo(() => data ? data.getSideSwapperProducts : [], [data]);

  useEffect(() => {
    if (AS.length > 0) {
      setShowAll(Array(AS.length).fill(false));
    }
  }, [AS]);

  const handleShowAll = (index) => {
    const newShowAll = [...showAll];
    newShowAll[index] = true;
    setShowAll(newShowAll);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* <AvatarDemo /> */}
      <div>
        <div
          className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {AS.map((vendor, idx) => (
            <div key={idx}>
              <div
                className="w-23 h-6 bg-[#74727ca4]"
              >
                {vendor.VendorName}
              </div>
              <ScrollArea className={`h-[390px] w-fit`}>
                {vendor.products.slice(0, showAll[idx] ? vendor.products.length : 4).map((product, index) => (
                  <div key={index} className="p-3 my-2 rounded-xl flex justify-between items-center w-full bg-[#74727c]">
                    <img
                      src={product.imageUrls[0]} // Assuming you want to show the first image
                      alt={`Image ${index + 1}`}
                      className="rounded-xl mr-5 w-16 h-16"
                    />
                    <h2 className="text-left text-[13px]">
                      {product.name} - ${product.price}
                    </h2>
                  </div>
                ))}
              </ScrollArea>
              <Button
                className="rounded-xl w-23 h-6"
                onClick={() => handleShowAll(idx)}
              >
                More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SwapperShop;
