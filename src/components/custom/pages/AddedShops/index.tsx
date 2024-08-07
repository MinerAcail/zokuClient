import { useQuery } from "@apollo/client";
import { GET_VENDOR_BY_ID } from "../../fileInput/gql/query";
import { useState, useEffect } from "react";
import { ItemLayout } from "../../useAble/ItemLayout";
import fallbackImage from "../../../../assets/images/1.jpg"; // Fallback image URL
import { useParams } from "react-router-dom";

function AddedShop() {
  const { vendorId } = useParams();
  const {
    data: vendorData,
    loading: vendorLoading,
    error: vendorError,
  } = useQuery(GET_VENDOR_BY_ID, {
    variables: { id: vendorId },
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (
      vendorData &&
      vendorData.getVendorById &&
      vendorData.getVendorById.product
    ) {
      const adjustedProducts = vendorData.getVendorById.product.map(
        (product) => ({
          ...product,
          imageUrls: product.imageUrls
            ? product.imageUrls.map((url) =>
                url.replace("http://minio:9000", "/minio")
              )
            : [],
        })
      );
      setProducts(adjustedProducts);
    }
  }, [vendorData]);

  if (vendorLoading) return <p>Loading...</p>;
  if (vendorError) return <p>Error: {vendorError.message}</p>;

  const backgroundImage = vendorData?.getVendorById?.backgroundUrl
    ? vendorData.getVendorById.backgroundUrl.replace(
        "http://minio:9000",
        "/minio"
      )
    : fallbackImage;

  return (
    <div className="p-4">
      <div className="w-full flex items-center justify-center bg-slate-400 h-[200px] md:h-[300px] lg:h-[100px] relative group">
        <img
          src={backgroundImage}
          alt="Vendor Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white p-4 text-center">
            <p className="text-lg font-semibold">
              Vendor Name: {vendorData?.getVendorById?.name || "Unknown"}
            </p>
            <p className="text-sm">
              Vendor Details:{" "}
              {vendorData?.getVendorById?.type || "No details available"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;
          // const imageSrc = imageUrls.length > 0 ? imageUrls[0] : fallbackImage;

          return (
            <ItemLayout
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

export default AddedShop;
