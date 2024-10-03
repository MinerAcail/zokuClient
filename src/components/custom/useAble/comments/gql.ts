import { gql } from "@apollo/client";
export type Comments = {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    content: string;
    parentCommentId: string | null;
    replies: Comments[];
    createdAt: string; // Add this line
    updatedAt: string; // Add this line
  };
export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: String!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      updatedAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: CommentInput!, $userId: String!) {
    addComment(input: $input, userId: $userId) {
      id
      userId
      productId
      content
      parentCommentId
    }
  }
`;

export const GET_COMMENT_BY_PRODUCT = gql`
  query GetCommentsByProduct($productId: String!) {
    getCommentsByProduct(productId: $productId) {
      id
      userId
      productId
      content
      userName
      parentCommentId
      createdAt
      updatedAt
    }
  }
`;