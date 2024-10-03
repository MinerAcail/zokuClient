import { gql, useMutation, useQuery } from "@apollo/client";
import { SwatchBook } from "lucide-react";
import { useState, useEffect } from "react";
import Empty, { LoadingSpinner } from "./LoadAndErrorStatus";

// GraphQL Queries and Mutations
const GET_TOTAL_COUNT = gql`
  query GetTotalCountOfFavoriteVendor($vendorId: String!) {
    getTotalCountOfFavoriteVendor(vendorId: $vendorId)
  }
`;

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

interface GetTotalCountOfFavoriteVendorResponse {
  getTotalCountOfFavoriteVendor: number;
}

export type FavoriteVendor = {
  id: string;
  name: string;
  product: { id: string } | null;
  profileUrl: string | null;
  backgroundUrl: string | null;
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

interface VendorFavoriteLogicIconsProps {
  vendorId: string;
}

export function VendorFavoriteLogicIcons({
  vendorId,
}: VendorFavoriteLogicIconsProps) {
  const {
    data: countData,
    loading: countLoading,
   // error: countError,
  } = useQuery<GetTotalCountOfFavoriteVendorResponse>(GET_TOTAL_COUNT, {
    variables: { vendorId },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: favoriteData,
    loading: favoriteLoading,
  //  error: favoriteError,
  } = useQuery<GetUserFavoriteVendorsResponse>(GET_USER_FAVORITE_VENDORS, {
    fetchPolicy: "cache-and-network",
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clickError, setClickError] = useState(false);

  const [addFavoriteVendor] = useMutation<AddFavoriteVendorResponse>(
    ADD_FAVORITE_VENDOR,
    {
      update(cache, { data }) {
        if (data) {
          const { getTotalCountOfFavoriteVendor } =
            cache.readQuery<GetTotalCountOfFavoriteVendorResponse>({
              query: GET_TOTAL_COUNT,
              variables: { vendorId },
            }) || { getTotalCountOfFavoriteVendor: 0 };

          cache.writeQuery({
            query: GET_TOTAL_COUNT,
            variables: { vendorId },
            data: {
              getTotalCountOfFavoriteVendor: getTotalCountOfFavoriteVendor + 1,
            },
          });

          const { getUserFavoriteVendors } =
            cache.readQuery<GetUserFavoriteVendorsResponse>({
              query: GET_USER_FAVORITE_VENDORS,
            }) || { getUserFavoriteVendors: [] };

          cache.writeQuery({
            query: GET_USER_FAVORITE_VENDORS,
            data: {
              getUserFavoriteVendors: [
                ...getUserFavoriteVendors,
                {
                  id: vendorId,
                  name: "",
                  product: null,
                  profileUrl: null,
                  backgroundUrl: null,
                },
              ],
            },
          });
        }
      },
    }
  );

  const [removeFavoriteVendor] = useMutation<RemoveFavoriteVendorResponse>(
    REMOVE_FAVORITE_VENDOR,
    {
      update(cache) {
        const { getTotalCountOfFavoriteVendor } =
          cache.readQuery<GetTotalCountOfFavoriteVendorResponse>({
            query: GET_TOTAL_COUNT,
            variables: { vendorId },
          }) || { getTotalCountOfFavoriteVendor: 0 };

        cache.writeQuery({
          query: GET_TOTAL_COUNT,
          variables: { vendorId },
          data: {
            getTotalCountOfFavoriteVendor: Math.max(
              0,
              getTotalCountOfFavoriteVendor - 1
            ),
          },
        });

        const { getUserFavoriteVendors } =
          cache.readQuery<GetUserFavoriteVendorsResponse>({
            query: GET_USER_FAVORITE_VENDORS,
          }) || { getUserFavoriteVendors: [] };

        cache.writeQuery({
          query: GET_USER_FAVORITE_VENDORS,
          data: {
            getUserFavoriteVendors: getUserFavoriteVendors.filter(
              (vendor) => vendor.id !== vendorId
            ),
          },
        });
      },
    }
  );

  useEffect(() => {
    if (favoriteData) {
      setIsFavorite(
        favoriteData.getUserFavoriteVendors.some((fav) => fav.id === vendorId)
      );
    }
  }, [favoriteData, vendorId]);

  const handleSwatchBookClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      if (isFavorite) {
        await removeFavoriteVendor({ variables: { id: vendorId } });
      } else {
        await addFavoriteVendor({ variables: { vendorId } });
      }
      setIsFavorite(!isFavorite);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to toggle favorite vendor:", error);
      setErrorMessage(
        "Error occurred while toggling favorite status. Please try again later."
      );
      setClickError(true); // Show error on click
    }
  };

  const handleClickErr = (
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (errorMessage) {
      setClickError(true); // Show error message if there was an error
    }
  };

  if (countLoading || favoriteLoading) return <LoadingSpinner />;

  if (!favoriteData?.getUserFavoriteVendors.length && countData?.getTotalCountOfFavoriteVendor === 0) {
    return <Empty message="No Favorite Vendor found." />;
  }

  //todachange error from here if (favoriteError || countError) return <ErrorMessage message={favoriteError?.message || countError?.message} />;

  return (
    <div className="">
      <div
        className={`absolute bottom-2 p-2 right-1 flex justify-between items-center rounded-xl w-fit h-8 cursor-pointer ${
          isFavorite ? "bg-white" : "bg-black"
        }`}
        onClick={handleSwatchBookClick}
      >
        <h3
          className={`mx-2 text-xs ${
            isFavorite ? "text-black" : "text-[#f1f1f1]"
          }`}
        >
          {countData?.getTotalCountOfFavoriteVendor || 0}
        </h3>
        <SwatchBook
          className={`w-4 h-4 transition-transform duration-300 ${
            isFavorite ? "text-black rotate-0" : "text-[#f1f1f1] rotate-180"
          }`}
          onClick={handleClickErr} // Show error on click if there's an error
        />
      </div>
      {clickError && errorMessage && (
        <div className="absolute bottom-2 right-1 bg-red-100 border border-red-400 text-red-700 p-2 rounded">
          <p className="text-xs">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
