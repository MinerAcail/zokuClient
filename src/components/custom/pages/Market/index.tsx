import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS, Product } from "../../fileInput/gql/query";
import Description from "../../useAble/description";
import { ItemLayout } from "../../useAble/ItemLayout";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import { useSearch } from "../../useAble/search/useSearch";
import { Search } from "../../NavBars/search";

function Market() {
  const { data: Data, loading: vendorLoading, error: vendorError } = useQuery(GET_ALL_PRODUCTS);
  const { sideSwapperProductIds } = useSideSwapperProductIds();

  const [products, setProducts] = useState([]);
  const { handleSearch,  filteredData } = useSearch<Product>(products);

  useEffect(() => {
    if (Data && Data.getAllProduct) {
      setProducts(Data.getAllProduct);
    }
  }, [Data]);



  if (vendorLoading ) return <p>Loading products...</p>;
  if (vendorError) return <p>Error loading products: {vendorError.message}</p>;

  return (
    <div>
      
      <Search onSearch={handleSearch} />

      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredData?.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;

          const added = sideSwapperProductIds.has(id); // Check if the product is already added

          return (
            <ItemLayout
              added={added}
              productId={id}
              description={title}
              brand={brand}
              price={price}
              name={name}
              key={id}
              imageUrls={imageUrls}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Market;
