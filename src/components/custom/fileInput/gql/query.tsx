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


// Define TypeScript types for the query result
export interface Vendor {
  name: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrls: string[];
  price: number;
  brand: string;
  title: string;
  Vendor: Vendor;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllProductData {
  getAllProduct: Product[];
}


