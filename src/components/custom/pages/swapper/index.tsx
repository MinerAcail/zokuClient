import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { AvatarDemo } from "./AvatarDemo";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import SwappersDescription from "../../useAble/swapper/SliderForSwapper";
// Define TypeScript types for GraphQL responses
type AddedSideSwapperProduct = {
  id: string;
  sideSwapperID: string;
  productId: string;
  product: {
    id: string;
  };
  sideSwapper: {
    id: string;
    name: string;
  };
};

export type GetAddedSideSwapperProductsResponse = {
  getAddedSideSwapperProducts: AddedSideSwapperProduct[];
};
// Define GraphQL queries and mutations
const GET_ADDED_SIDE_SWAPPER_PRODUCTS = gql`
  query GetAddedSideSwapperProducts {
    getAddedSideSwapperProducts {
      id
      sideSwapperID
      productId
      product {
        id
      }
      sideSwapper {
        id
        name
      }
    }
  }
`;

// Define TypeScript types for the query result
export interface SideSwapperProduct {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
}

export interface SideSwapperProductsData {
  getSideSwapperProducts: {
    VendorName: string;
    count: number;
    products: SideSwapperProduct[];
  }[];
}

// GraphQL query
export const GET_SIDE_SWAPPER_PRODUCTS = gql`
  query GetSideSwapperProducts {
    getSideSwapperProducts {
      VendorName
      count
      products {
        id
        name
        price
        imageUrls
      }
    }
  }
`;

export function SwapperShop() {
  const { data, loading, error } = useQuery<SideSwapperProductsData>(
    GET_SIDE_SWAPPER_PRODUCTS
  );
  const [showAll, setShowAll] = useState([]);

  // Memoize AS to avoid re-computation on every render
  const AS = useMemo(() => (data ? data.getSideSwapperProducts : []), [data]);

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
        <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {AS.map((vendor, idx) => (
            <div key={idx}>
              <div className="w-23 h-6  bg-[#74727ca4] text-white">
                {vendor.VendorName} - {vendor.count}
              </div>
              <ScrollArea className={`h-[390px] w-23`}>
                {vendor.products
                  .slice(0, showAll[idx] ? vendor.products.length : 4)
                  .map((product, index) => (
                    <div
                      key={index}
                      className="p-3 my-2 rounded-xl flex justify-between items-center w-full bg-[#74727c]"
                    >
                      <div className="inline-block justify-center items-center text-center">
                        <h2 className="text-left text-white text-[12px]">
                          {product.name}
                        </h2>
                        <img
                          src={product.imageUrls[0]} // Assuming you want to show the first image
                          alt={`Image ${index + 1}`}
                          className="rounded-xl mr-5 w-16 h-16"
                        />
                      </div>
                      <SwappersDescription
                        added={true}
                        price={product.price}
                        productId={product.id}
                      />
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
