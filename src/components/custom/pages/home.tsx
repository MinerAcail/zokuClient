import BoxLayout from "../useAble/boxLayout";
import { gql, useQuery } from "@apollo/client";

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
  const { loading, error, data } = useQuery(GET_ALL_VENDORS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="m-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.getAllVendor.map((vendor) => {
        const count = vendor?.product?.length || 0;

        return (
          <BoxLayout
            key={vendor.id}
            vendorId={vendor.id}
            bgimage={vendor?.profileUrl}
            vendor={vendor}
            count={count}
            srcimage={vendor?.profileUrl}
            name={vendor?.name}
            description={"Descriptions will be here"}
          />
        );
      })}
    </div>
  );
}

export default Home;


{/* <GradientDisplay startColor="#04ac5c" numSteps={6} /> */}
