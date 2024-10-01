import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_VENDOR_BY_ID } from "../../fileInput/gql/query";
import { ItemLayout } from "../../useAble/ItemLayout";
import fallbackImage from "../../../../assets/images/1.jpg";
import { useSideSwapperProductIds } from "../../useAble/swapper/useSideSwapperProductIds";
import { ErrorMessage, LoadingSpinner } from "../../useAble/LoadAndErrorStatus";
import { MinioUrl, MinioVariable } from "@/middleware/minio";

// Type definitions
interface Product {
  id: string;
  name: string;
  imageUrls: string[];
  price: number;
  brand: string;
  title: string;
}

interface VendorData {
  getVendorById: {
    name: string;
    type: string;
    product: Product[];
    backgroundUrl: string;
  };
}

const BackgroundSection: React.FC<{ backgroundImage: string; vendorName: string; vendorType: string }> = ({ backgroundImage, vendorName, vendorType }) => (
  <div className="w-full flex items-center justify-center bg-slate-400 h-[200px] md:h-[300px] lg:h-[100px] relative group">
    <img
      src={backgroundImage}
      alt="Vendor Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="text-white p-4 text-center">
        <p className="text-lg font-semibold">Vendor Name: {vendorName || "Unknown"}</p>
        <p className="text-sm">Vendor Details: {vendorType || "No details available"}</p>
      </div>
    </div>
  </div>
);

function AddedShop() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { data: vendorData, loading: vendorLoading, error: vendorError } = useQuery<VendorData>(GET_VENDOR_BY_ID, { variables: { id: vendorId } });
  const [products, setProducts] = useState<Product[]>([]);
  
  const { sideSwapperProductIds, loading: sideSwapperLoading, error: sideSwapperError } = useSideSwapperProductIds();

  useEffect(() => {
    if (vendorData?.getVendorById?.product) {
      const adjustedProducts = vendorData.getVendorById.product.map((product) => ({
        ...product,
        imageUrls: product.imageUrls.map((url) => url.replace(MinioUrl, MinioVariable)),
      }));
      setProducts(adjustedProducts);
    }
  }, [vendorData]);

  if (vendorLoading || sideSwapperLoading) return <LoadingSpinner />;
  if (vendorError || sideSwapperError) return <ErrorMessage message={vendorError?.message || sideSwapperError?.message} />;

  const backgroundImage = vendorData?.getVendorById?.backgroundUrl
    ? vendorData.getVendorById.backgroundUrl.replace(MinioUrl, MinioVariable)
    : fallbackImage;

  return (
    <div className="p-4">
      <BackgroundSection
        backgroundImage={backgroundImage}
        vendorName={vendorData?.getVendorById?.name ??"Unknow Name"}
        vendorType={vendorData?.getVendorById?.type ??"Unknow Type"}
      />

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const { id, name, imageUrls, price, brand, title } = product;
          const added = sideSwapperProductIds.has(id);

          return (
            <ItemLayout
              key={id}
              added={added}
              productId={id}
              description={title}
              brand={brand}
              price={price}
              name={name}
              imageUrls={imageUrls}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AddedShop;
