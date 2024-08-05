  import { gql } from "@apollo/client";

  export const VENDOR_UPLOAD_MUTATION = gql`
    mutation VendorUpload($files: [Upload], $input: ProductInput) {
      VendorUpload(files: $files, input: $input) {
        id
        vendorsBucketName
       imageUrls
        name
        price
        state
        title
        brand
        vendorsBucketName
        vendorId
      }
    }
  `;
