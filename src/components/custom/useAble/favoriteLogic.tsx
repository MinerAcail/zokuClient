import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { MessageCircleDashed, ShoppingCart, SwatchBook } from "lucide-react";
import { DrawSheet } from "./drawer";

// Define TypeScript types for GraphQL responses
type FavoriteProduct = {
  id: string;
  name: string;
  title: string;
  price: number;
  brand: string;
  imageUrls: string[];
};

export type GetUserFavoriteProductsResponse = {
  getUserFavoriteProducts: FavoriteProduct[];
};

type AddFavoriteProductResponse = {
  addFavoriteProduct: {
    id: string;
    userId: string;
    product: FavoriteProduct;
  };
};

type RemoveFavoriteProductResponse = {
  removeFavoriteProduct: boolean;
};

// Define TypeScript types for component props
interface FavoriteLogicIconsProps {
  productId: string;
}

const ADD_FAVORITE_PRODUCT = gql`
  mutation AddFavoriteProduct($productId: String!) {
    addFavoriteProduct(productId: $productId) {
      id
      productId
      userId
      __typename
      product {
        id
        name
        title
        price
        brand
        imageUrls
        __typename
      }
    }
  }
`;

const REMOVE_FAVORITE_PRODUCT = gql`
  mutation RemoveFavoriteProduct($id: String!) {
    removeFavoriteProduct(id: $id)
  }
`;

export const GET_USER_FAVORITE_PRODUCTS = gql`
  query GetUserFavoriteProducts {
    getUserFavoriteProducts {
      id
      name
      price
      title
      imageUrls
    }
  }
`;

export function FavoriteLogicIcons({ productId }: FavoriteLogicIconsProps) {
  const [selected, setSelected] = useState(false);
  const [clickError, setClickError] = useState(false);

  const { data, loading, error } = useQuery<GetUserFavoriteProductsResponse>(
    GET_USER_FAVORITE_PRODUCTS
  );
  console.log(data);

  const [addFavoriteProduct] = useMutation<AddFavoriteProductResponse>(
    ADD_FAVORITE_PRODUCT,
    {
      update(cache, { data }) {
        if (data) {
          const existingFavorites =
            cache.readQuery<GetUserFavoriteProductsResponse>({
              query: GET_USER_FAVORITE_PRODUCTS,
            });
          const newFavorite = data.addFavoriteProduct.product;
          if (existingFavorites) {
            cache.writeQuery({
              query: GET_USER_FAVORITE_PRODUCTS,
              data: {
                getUserFavoriteProducts: [
                  ...existingFavorites.getUserFavoriteProducts,
                  newFavorite,
                ],
              },
            });
          }
        }
      },
    }
  );

  const [removeFavoriteProduct] = useMutation<RemoveFavoriteProductResponse>(
    REMOVE_FAVORITE_PRODUCT,
    {
      update(cache) {
        const existingFavorites =
          cache.readQuery<GetUserFavoriteProductsResponse>({
            query: GET_USER_FAVORITE_PRODUCTS,
          });
        if (existingFavorites) {
          cache.writeQuery({
            query: GET_USER_FAVORITE_PRODUCTS,
            data: {
              getUserFavoriteProducts:
                existingFavorites.getUserFavoriteProducts.filter(
                  (product) => product.id !== productId
                ),
            },
          });
        }
      },
    }
  );

  useEffect(() => {
    if (data && data.getUserFavoriteProducts) {
      setSelected(
        data.getUserFavoriteProducts.some((fav) => fav.id === productId)
      );
    }
  }, [data, productId]);

  const handleSwatchBookClick = async () => {
    try {
      if (selected) {
        await removeFavoriteProduct({ variables: { id: productId } });
      } else {
        await addFavoriteProduct({ variables: { productId: productId } });
      }
      setSelected(!selected);
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error(
          "Failed to toggle favorite product:",
          error.message,
          error.graphQLErrors,
          error.networkError
        );
      } else {
        console.error("Failed to toggle favorite product:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error("Error loading favorite products:", error.message);
    return (
      <div className="flex items-center text-[#ffdaf9] ">
        {!clickError ? (
          <div
          onClick={() => setClickError(true)}

           className="flex items-center text-[#ffdaf9] ml-2">
            <DrawSheet>
              <MessageCircleDashed className="size-[18px] cursor-pointer" />
            </DrawSheet>
            <ShoppingCart 
            className="mx-2 size-[18px] cursor-pointer" />
            <div
              className={`mr-2 flex justify-center items-center rounded-xl w-8 h-8 cursor-pointer ${
                selected ? "bg-white" : "bg-transparent"
              }`}
             
            >
              <SwatchBook
                className={`size-[18px] transition-transform duration-300 ${
                  selected
                    ? "transform rotate-[360deg] text-black"
                    : "text-white"
                }`}
              />
            </div>
          </div>
        ) : (
          <p 
          onClick={() => setClickError(!clickError)}

          className="text-[10px] cursor-pointer">Error loading favorite</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center text-[#ffdaf9] ml-2">
      <DrawSheet>
        <MessageCircleDashed className="size-[18px] cursor-pointer" />
      </DrawSheet>
      <ShoppingCart className="mx-2 size-[18px] cursor-pointer" />
      <div
        className={`mr-2 flex justify-center items-center rounded-xl w-8 h-8 cursor-pointer ${
          selected ? "bg-white" : "bg-transparent"
        }`}
        onClick={handleSwatchBookClick}
      >
        <SwatchBook
          className={`size-[18px] transition-transform duration-300 ${
            selected ? "transform rotate-[360deg] text-black" : "text-white"
          }`}
        />
      </div>
    </div>
  );
}
