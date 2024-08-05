import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS_BY_VENDOR } from "../../fileInput/gql/query";
import { useState, useEffect } from "react";
import { ItemLayout } from "../../useAble/ItemLayout";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL
import srcimage from "../../../../assets/images/b1.jpg";


function AddedShop() {
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS_BY_VENDOR);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data && data.getAllProductByVendor) {
      // Adjust URLs to be relative to the /minio proxy
      const adjustedProducts = data.getAllProductByVendor.map(product => ({
        ...product,
        imageUrls: product.imageUrls ? product.imageUrls.map(url => url.replace('http://minio:9000', '/minio')) : []
      }));
      setProducts(adjustedProducts);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="w-full flex items-center justify-center bg-slate-400 h-[130px] relative group">
        <img src={srcimage} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white p-4">
            <p>Vendor Name: XYZ</p>
            <p>Vendor Details: Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </div>

      <div
        className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map(product => {
          const { id, name, imageUrls } = product;
          // Use fallback image if no image URLs are available
          const imageSrc = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;
          
          return (
            <ItemLayout name={name} key={id}>
              <img
                src={imageSrc}
                alt={name}
                className="rounded-xl object-cover"
              />
            </ItemLayout>
          );
        })}
      </div>
    </div>
  );
}

export default AddedShop;
