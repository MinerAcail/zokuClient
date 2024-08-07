import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const link = createUploadLink({
  uri: "http://localhost:3001/query",
  credentials: "include",
});

const Client = new ApolloClient({
 

  cache: new InMemoryCache(),
  link,
});

export default Client;  






// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// const link = createUploadLink({
//   uri: "http://localhost:3001/query",
//   credentials: "include",
// });

// const client = new ApolloClient({
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           getUserFavoriteProducts: {
//             merge(existing = [], incoming) {
//               return [...existing, ...incoming];
//             },
//           },
//         },
//       },
//     },
//   }),
//   link,
// });

// export default client;
