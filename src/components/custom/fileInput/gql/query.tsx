import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS_BY_VENDOR = gql`
    query getAllProductByVendor {
      getAllProductByVendor {
        id
        name
        imageUrls
      }
    }
`;
