
import {  useMutation, useQuery } from "@apollo/client";

import { useAuth } from "@/middleware/context/authContext";

import { CommentForm } from "./commentForm";
import { CommentComponent } from "./commentComponent";
import { GET_COMMENT_BY_PRODUCT, ADD_COMMENT, Comments } from "./gql";
import Empty, { ErrorMessage, LoadingSpinner } from "../LoadAndErrorStatus";

function nestComments(comments: Comments[]): Comments[] {
  const commentMap: { [key: string]: Comments } = {};

  const clonedComments = comments.map((comment) => ({
    ...comment,
    replies: [],
  }));

  clonedComments.forEach((comment) => {
    commentMap[comment.id] = comment;
  });

  const nestedComments: Comments[] = [];

  clonedComments.forEach((comment) => {
    if (comment.parentCommentId) {
      commentMap[comment.parentCommentId]?.replies.push(comment);
    } else {
      nestedComments.push(comment);
    }
  });

  // Sort comments and their replies by createdAt (newest first)
  nestedComments.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  nestedComments.forEach((comment) => {
    comment.replies.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  });

  return nestedComments;
}


export default function CommentSystem({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_COMMENT_BY_PRODUCT, {
    variables: { productId },
    skip: !productId, // Avoid query if productId is not available
  });
  
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_PRODUCT, variables: { productId } }],
  });
  

  const structuredComments = nestComments(data?.getCommentsByProduct || []);

  const handleAddComment = (content: string) => {
    addComment({
      variables: {
        input: {
          content,
          productId,
          parentCommentId: null, // This is for top-level comments
        },
        userId: user?.id,
      },
    }).then(() => console.log("Comment submitted:", content));
  };

  return (
    <div className="max-w-3xl max-h-[464px] overflow-auto mx-auto mt-8 p-4">
      <CommentForm onSubmit={handleAddComment} />

      <div className="p-2 rounded-lg">
        {error && <ErrorMessage message="Error loading comments" /> }
        {loading && <LoadingSpinner /> }
        {structuredComments.length === 0 ? (
     
          <Empty message="No comments yet" />
        ) : (
          structuredComments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}
