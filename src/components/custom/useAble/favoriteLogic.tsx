import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { MessageCircleDashed, ShoppingCart, SwatchBook } from "lucide-react";
import { DrawSheet } from "./drawer";
import CartLogic from "./utils/cartLogic";
import { useAuth } from "@/middleware/context/authContext";
import CartOrderLogic from "./utils/cartOrderLogic";
import { useLocation } from "react-router-dom";
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
  quantityGroup:number;
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
      imageUrls
      price
      brand
      title
      Vendor {
        name
      }
    }
  }
`;

export function FavoriteLogicIcons({ productId,quantityGroup }: FavoriteLogicIconsProps) {
  const location = useLocation();
  const [isCartPage, setIsCartPage] = useState(false);
  const [selected, setSelected] = useState(false);
  const [clickError, setClickError] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery<GetUserFavoriteProductsResponse>(
    GET_USER_FAVORITE_PRODUCTS
  );

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
    // Check if the current URL is the "/cart" route
    if (location.pathname === "/cart") {
      setIsCartPage(true);
      // Perform other actions here, such as updating a status
      console.log("You are on the cart page.");
    } else {
      setIsCartPage(false);
    }
  }, [data, productId, location]);

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
    return (
      <div className="flex items-center text-[#ffdaf9] ml-2">
        {!clickError ? (
          <>
            <DrawSheet productId={productId}>
              <MessageCircleDashed
                className={`size-[18px] cursor-pointer ${
                  !isAuthenticated && "ml-2"
                }`}
              />
            </DrawSheet>
            {isAuthenticated && (
              <>
                <div
                  onClick={() => setClickError(true)}
                  className="flex items-center text-[#ffdaf9] "
                >
                  <ShoppingCart className="mx-2 size-[18px] cursor-pointer" />
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
              </>
            )}
          </>
        ) : (
          <p
            onClick={() => setClickError(!clickError)}
            className="text-[10px] cursor-pointer"
          >
            Please login For result
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center text-[#ffdaf9] ml-2">
      <DrawSheet productId={productId}>
        <MessageCircleDashed className="size-[18px] cursor-pointer" />
      </DrawSheet>
      {isAuthenticated && (
        <>
          {isCartPage ? (
            <CartOrderLogic productId={productId} quantityGroup={quantityGroup} />
          ) : (
            <CartLogic productId={productId} />
          )}

          <div
            className={`mr-2 flex justify-center items-center rounded-xl w-5 h-5 cursor-pointer ${
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
        </>
      )}
    </div>
  );
}
