import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ShoppingBasket, BadgeCheck, MenuIcon, Trash2 } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import { GET_ALL_PRODUCTS, GetAllProductData } from "../../fileInput/gql/query";
import { GET_USER_FAVORITE_PRODUCTS, GetUserFavoriteProductsResponse } from "../favoriteLogic";
import { GET_SIDE_SWAPPER_PRODUCTS, SideSwapperProductsData } from "../../pages/swapper";

// Define GraphQL mutations and queries
const ADD_SIDE_SWAPPER_PRODUCT = gql`
  mutation AddSideSwapperProduct($percentage: String!, $productId: String!) {
    addSideSwapperProduct(percentage: $percentage, productId: $productId) {
      id
      sideSwapper {
        name
        type
      }
      Pricing {
        basePrice
        markupPercentage
      }
      vendorId
      vendor {
        name
      }
      PricingId
    }
  }
`;

const REMOVE_SIDE_SWAPPER_PRODUCT = gql`
  mutation RemoveSideSwapperProduct($productId: String!) {
    removeSideSwapperProduct(productId: $productId)
  }
`;

interface SwappersDescriptionProps {
  price: number;
  productId: string;
  added: boolean;
}

const SwappersDescription = ({
  price,
  productId,
  added
}: SwappersDescriptionProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>([1]);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(price);
  const [addSideSwapperProduct] = useMutation(ADD_SIDE_SWAPPER_PRODUCT);
  const [removeSideSwapperProduct] = useMutation(REMOVE_SIDE_SWAPPER_PRODUCT);
  const [isProductAdded, setIsProductAdded] = useState<boolean>(added);
  // const [isProductRemoved, setIsProductRemoved] = useState<boolean>(false);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const percentageIncrease = value[0] / 100;
    const newPrice = price * (1 + percentageIncrease);
    setAdjustedPrice(newPrice);
  };

  useEffect(() => {
    const percentageIncrease = sliderValue[0] / 100;
    const newPrice = price * (1 + percentageIncrease);
    setAdjustedPrice(newPrice);
  }, [price, sliderValue]);

  const handleAddProduct = () => {
    const percentage = sliderValue[0].toString();
    addSideSwapperProduct({
      variables: { percentage, productId },
      update: (cache, { data }) => {
        if (!data) return;

        // Read existing data from the cache
        const existingProducts = cache.readQuery<GetAllProductData>({ query: GET_ALL_PRODUCTS });
        const existingFavoriteProducts = cache.readQuery<GetUserFavoriteProductsResponse>({ query: GET_USER_FAVORITE_PRODUCTS });
        const existingSideSwapperProducts = cache.readQuery<SideSwapperProductsData>({ query: GET_SIDE_SWAPPER_PRODUCTS });

        if (existingProducts) {
          const newProduct = data.addSideSwapperProduct;
          const updatedProducts = [...existingProducts.getAllProduct, newProduct];

          cache.writeQuery({
            query: GET_ALL_PRODUCTS,
            data: { getAllProduct: updatedProducts },
          });
        }

        if (existingFavoriteProducts) {
          const updatedFavoriteProducts = [...existingFavoriteProducts.getUserFavoriteProducts];
          // Optionally, handle favorite products update if needed
          cache.writeQuery({
            query: GET_USER_FAVORITE_PRODUCTS,
            data: { getUserFavoriteProducts: updatedFavoriteProducts },
          });
        }

        if (existingSideSwapperProducts) {
          const updatedSideSwapperProducts = [...existingSideSwapperProducts.getSideSwapperProducts, data.addSideSwapperProduct];
          cache.writeQuery({
            query: GET_SIDE_SWAPPER_PRODUCTS,
            data: { getSideSwapperProducts: updatedSideSwapperProducts },
          });
        }
      },
    })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        setIsProductAdded(true);
        // setIsProductRemoved(false);
      })
      .catch((err) => {
        console.error("Error adding side swapper product:", err);
        // Handle error (e.g., show an error message)
      });
  };

  const handleRemoveProduct = () => {
    removeSideSwapperProduct({
      variables: { productId },
      update: (cache) => {
        // Read existing data from the cache
        const existingProducts = cache.readQuery<GetAllProductData>({ query: GET_ALL_PRODUCTS });
        const existingFavoriteProducts = cache.readQuery<GetUserFavoriteProductsResponse>({ query: GET_USER_FAVORITE_PRODUCTS });
        const existingSideSwapperProducts = cache.readQuery<SideSwapperProductsData>({ query: GET_SIDE_SWAPPER_PRODUCTS });

        if (existingProducts) {
          const updatedProducts = existingProducts.getAllProduct.filter(product => product.id !== productId);

          cache.writeQuery({
            query: GET_ALL_PRODUCTS,
            data: { getAllProduct: updatedProducts },
          });
        }

        if (existingFavoriteProducts) {
          const updatedFavoriteProducts = existingFavoriteProducts.getUserFavoriteProducts.filter(product => product.id !== productId);
          
          cache.writeQuery({
            query: GET_USER_FAVORITE_PRODUCTS,
            data: { getUserFavoriteProducts: updatedFavoriteProducts },
          });
        }

        if (existingSideSwapperProducts) {
          const updatedSideSwapperProducts = existingSideSwapperProducts.getSideSwapperProducts.filter(product => product.id !== productId);
          
          cache.writeQuery({
            query: GET_SIDE_SWAPPER_PRODUCTS,
            data: { getSideSwapperProducts: updatedSideSwapperProducts },
          });
        }
      },
    })
      .then(() => {
        setIsProductAdded(false);
        // setIsProductRemoved(true);
      })
      .catch((err) => {
        console.error("Error removing side swapper product:", err);
        // Handle error (e.g., show an error message)
      });
  };

  const formattedPrice =
    typeof adjustedPrice === "number" && !isNaN(adjustedPrice)
      ? adjustedPrice.toFixed(2)
      : "Invalid Price";

  return (
    <>
      {!added ? (
        isProductAdded ? (
          <BadgeCheck className="text-white mr-3" />
        ) : (
          <ShoppingBasket
            onClick={handleAddProduct}
            className="text-white mr-3 cursor-pointer"
          />
        )
      ) : (
        <Trash2
          onClick={handleRemoveProduct}
          className="text-white mr-3 cursor-pointer"
        />
      )}
      <div className="text-white bg-red-600 rounded-xl w-1/2 font-normal text-[14px]">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={30}
          step={1}
        />
        <div className="mt-2">
          {sliderValue[0]}% = ${formattedPrice}
        </div>
      </div>
    </>
  );
};

export default SwappersDescription;
