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

export const GET_VENDOR_BY_ID = gql`
  query GetVendorByID($id: String!) {
    getVendorById(id: $id) {
      id
      name
      name
      backgroundUrl
      profileUrl
      type

      product {
        id
        name
        imageUrls
        price
        brand
        title
      }
      profileUrl
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProduct {
    getAllProduct {
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
