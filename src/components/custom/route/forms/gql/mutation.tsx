    import { gql } from '@apollo/client';

    export const CREATE_VENDOR = gql`
        mutation CreateVendor($mateData: UploadVendorMateData,$input: NewVendor!) {
        createVendor(input: $input,mateData:$mateData) {
        id
        name
        number
        pin
        createdAt
        }
    }
    `;


        export const LOGIN = gql`
    mutation login($input:LoginInput!){
        login(input:$input){
            __typename
            ... on User {
            id
            name		
            number
            type
            createdAt
            updatedAt
            }
            ... on Vendor {
            id
            name
            number
            type
            createdAt
            updatedAt
            }
            ... on SideSwapper {
            id
            name
            number
            type
            createdAt
            updatedAt
            }
        }		
        }
        `;




export const LOGOUT = gql`
  mutation logOut {
    logOut
  }
`;