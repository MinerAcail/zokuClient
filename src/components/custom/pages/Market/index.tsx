import { useEffect, useState } from "react";
import { ItemLayout } from "../../useAble/ItemLayout";
import Description from "../../useAble/description";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../../fileInput/gql/query";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL

function Market() {
  const {
    data: Data,
    loading: vendorLoading,
    error: vendorError,
  } = useQuery(GET_ALL_PRODUCTS);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (Data && Data.getAllProduct) {
      setProducts(Data.getAllProduct);
    }
  }, [Data]);

  return (
    <div>
      <Description text={"Find All Items On Zuko Here"} />

      <div
        className="m-5  grid gap-4 
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;
          const imageSrc = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;

          return (
            <ItemLayout
            productId={id}

              description={title}
              brand={brand}
              price={price}
              name={name}
              key={id}
            >
              <img
                src={imageSrc}
                alt={name}
                className="rounded-xl object-cover w-full h-full"
              />
            </ItemLayout>
          );
        })}
      </div>
    </div>
  );
}

export default Market;
