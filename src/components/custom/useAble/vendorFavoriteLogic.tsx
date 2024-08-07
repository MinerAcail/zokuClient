import { gql, useMutation, useQuery } from "@apollo/client";
import { SwatchBook } from "lucide-react";
import { useState, useEffect } from "react";

// Define TypeScript types for GraphQL responses
export type FavoriteVendor = {
  id: string;
  name: string;

  product: { id: string } | null; // Assuming `product` may be null
  profileUrl: string | null; // Assuming `profileUrl` may be null
  backgroundUrl: string | null; // Assuming `backgroundUrl` may be null
};

export type GetUserFavoriteVendorsResponse = {
  getUserFavoriteVendors: FavoriteVendor[];
};

type AddFavoriteVendorResponse = {
  addFavoriteVendor: {
    id: string;
    userId: string;
  };
};

type RemoveFavoriteVendorResponse = {
  removeFavoriteVendor: boolean;
};

// Define GraphQL queries and mutations
const ADD_FAVORITE_VENDOR = gql`
  mutation AddFavoriteVendor($vendorId: String!) {
    addFavoriteVendor(vendorId: $vendorId) {
      id
      userId
    }
  }
`;

const REMOVE_FAVORITE_VENDOR = gql`
  mutation RemoveFavoriteVendor($id: String!) {
    removeFavoriteVendor(id: $id)
  }
`;

export const GET_USER_FAVORITE_VENDORS = gql`
  query GetUserFavoriteVendors {
    getUserFavoriteVendors {
      id
      name
      product {
        id
      }
      profileUrl
      backgroundUrl
    }
  }
`;

// Component props
interface VendorFavoriteLogicIconsProps {
  vendorId: string;
}

export function VendorFavoriteLogicIcons({
  vendorId,
}: VendorFavoriteLogicIconsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { data, loading, error } = useQuery<GetUserFavoriteVendorsResponse>(
    GET_USER_FAVORITE_VENDORS
  );

  const [addFavoriteVendor] = useMutation<AddFavoriteVendorResponse>(
    ADD_FAVORITE_VENDOR,
    {
      update(cache, { data }) {
        if (data) {
          const existingFavorites =
            cache.readQuery<GetUserFavoriteVendorsResponse>({
              query: GET_USER_FAVORITE_VENDORS,
            });
          const newFavorite = {
            id: data.addFavoriteVendor?.id,
            name: "",
            product: null,
            profileUrl: null,
            backgroundUrl: null,
          };
          if (existingFavorites) {
            cache.writeQuery({
              query: GET_USER_FAVORITE_VENDORS,
              data: {
                getUserFavoriteVendors: [
                  ...existingFavorites.getUserFavoriteVendors,
                  newFavorite,
                ],
              },
            });
          }
        }
      },
    }
  );

  const [removeFavoriteVendor] = useMutation<RemoveFavoriteVendorResponse>(
    REMOVE_FAVORITE_VENDOR,
    {
      update(cache) {
        const existingFavorites =
          cache.readQuery<GetUserFavoriteVendorsResponse>({
            query: GET_USER_FAVORITE_VENDORS,
          });
        if (existingFavorites) {
          cache.writeQuery({
            query: GET_USER_FAVORITE_VENDORS,
            data: {
              getUserFavoriteVendors:
                existingFavorites.getUserFavoriteVendors.filter(
                  (vendor) => vendor?.id !== vendorId
                ),
            },
          });
        }
      },
    }
  );

  useEffect(() => {
    if (data && data.getUserFavoriteVendors) {
      setIsFavorite(
        data.getUserFavoriteVendors.some((fav) => fav.id === vendorId)
      );
    }
  }, [data, vendorId]);

  const handleSwatchBookClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    try {
      event.preventDefault(); // Prevent the Link from being followed
      if (isFavorite) {
        await removeFavoriteVendor({ variables: { id: vendorId } });
      } else {
        await addFavoriteVendor({ variables: { vendorId } });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite vendor:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading favorite vendors.</p>;

  return (
    <div
      className={`absolute bottom-2 p-2 right-1 flex justify-between items-center rounded-xl w-fit h-8 cursor-pointer ${
        isFavorite ? "bg-white" : "bg-black"
      }`}
      onClick={handleSwatchBookClick}
    >
      <h3
      //  className="text-white mx-2"
      className={`mx-2 text-xs  ${isFavorite ? "text-black" : "text-[#f1f1f1]"}`}

       >10</h3>
      <SwatchBook
        className={`w-4 h-4 ${isFavorite ? "text-black" : "text-[#f1f1f1]"}`}
      />
    </div>
  );
}


