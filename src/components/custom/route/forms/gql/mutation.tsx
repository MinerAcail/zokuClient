    import { gql } from '@apollo/client';

    export const CREATE_VENDOR = gql`
    mutation CreateVendor($input: NewUser!) {
        createVendor(input: $input) {
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
        createdAt
        updatedAt
        }
        ... on Vendor {
        id
        name
        number
        createdAt
        updatedAt
        }
    }		
    }
    `;