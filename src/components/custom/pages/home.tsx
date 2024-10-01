import BoxLayout from "../useAble/boxLayout";
import { gql, useQuery } from "@apollo/client";
import Empty, {
  LoadingSpinner,
  ErrorMessage,
} from "../useAble/LoadAndErrorStatus";
import { useEffect } from "react";
import { Search } from "../NavBars/search";
import { useSearch } from "../useAble/search/useSearch";

// Define the structure of a Product
interface Product {
  id: string;
}

// Define the structure of a Vendor
interface Vendor {
  id: string;
  name: string;
  product: Product[]; // Array of products
  profileUrl: string;
  backgroundUrl: string;
}

// Define the response structure for the GET_ALL_VENDORS query
interface GetAllVendorsResponse {
  getAllVendor: Vendor[]; // Array of vendors
}

// Define the GraphQL query to fetch all vendors
const GET_ALL_VENDORS = gql`
  query GetAllVendor {
    getAllVendor {
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

function Home() {
  // Use the useQuery hook with the typed response
  const { loading, error, data, refetch } =
    useQuery<GetAllVendorsResponse>(GET_ALL_VENDORS);
  // State for search input
  useEffect(() => {
    if (!loading && !error) {
      refetch();
    }
  }, [loading, error, refetch]);
  const { handleSearch, filteredData: filteredVendors } = useSearch(
    data?.getAllVendor
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  if (data?.getAllVendor.length === 0)
    return <Empty message="No Shop found." />;

  return (
    <>
      <Search onSearch={handleSearch} />
      <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredVendors?.map((vendor) => {
          const count = vendor?.product?.length; // Access the length safely
          const countAsString = count?.toString(); // Convert the count to a string

          return (
            <BoxLayout
              key={vendor.id}
              vendorId={vendor.id}
              bgimage={vendor.profileUrl}
              vendor={vendor}
              count={countAsString}
              srcimage={vendor.profileUrl}
              name={vendor.name}
              description={"Descriptions will be here"}
            />
          );
        })}
      </div>
    </>
  );
}

export default Home;
