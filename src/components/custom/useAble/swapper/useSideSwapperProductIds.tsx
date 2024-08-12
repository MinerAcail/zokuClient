import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_SIDE_SWAPPER_PRODUCTS } from "../../pages/swapper";
// import { GET_SIDE_SWAPPER_PRODUCTS } from "../swapper";

export function useSideSwapperProductIds() {
  const { data, loading, error } = useQuery(GET_SIDE_SWAPPER_PRODUCTS);
  const [sideSwapperProductIds, setSideSwapperProductIds] = useState(new Set());

  useEffect(() => {
    if (data && data.getSideSwapperProducts) {
      const ids = new Set();

      data.getSideSwapperProducts.forEach(({ products }) => {
        products.forEach(product => {
          ids.add(product.id);
        });
      });

      setSideSwapperProductIds(ids);
    }
  }, [data]);

  return { sideSwapperProductIds, loading, error };
}
