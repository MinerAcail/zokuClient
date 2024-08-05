declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  import { HttpOptions } from '@apollo/client/link/http';

  export function createUploadLink(linkOptions?: HttpOptions): ApolloLink;
}
