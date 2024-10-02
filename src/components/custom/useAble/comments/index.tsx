import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ChevronDown, MessageSquare, Send,  Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/middleware/context/authContext";
import moment from 'moment';
export type Comment = {
  id: string;
  userId: string;
  productId: string;
  content: string;
  parentCommentId: string | null;
  replies: Comment[];
  createdAt: string; // Add this line
  updatedAt: string; // Add this line
};
function formatTimeAgo(dateString: string): string {
  return moment(dateString).fromNow();
}

const CommentComponent: React.FC<{ comment: Comment; depth: number }> = ({
  comment,
  depth,
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_PRODUCT, variables: { productId: comment.productId } }],
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENT_BY_PRODUCT, variables: { productId: comment.productId } }],
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setLoadingDelete(true);
      deleteComment({ variables: { id: comment.id } })
        .then(() => {
          console.log("Comment deleted:", comment.id);
        })
        .catch((error) => {
          console.error("Error deleting comment:", error);
        })
        .finally(() => {
          setLoadingDelete(false);
        });
    }
  };

  const handleReply = () => {
    setLoadingReply(true);
    addComment({
      variables: {
        input: {
          content: replyContent,
          productId: comment.productId,
          parentCommentId: comment.id,
        },
        userId: user?.id,
      },
    }).then(() => {
      console.log("Reply submitted:", replyContent);
      setReplyContent("");
      setIsReplying(false);
    }).catch((error) => {
      console.error("Error adding reply:", error);
    }).finally(() => {
      setLoadingReply(false);
    });
  };

  const handleUpvote = () => {
    // Implement upvote logic here
  };

  return (
    <Card
      className={`mb-4 ${depth > 0 ? "ml-6" : ""} bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-sm rounded-2xl`}
    >
      <CardHeader className="flex flex-row  justify-between ">
        <div className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-10 w-10 rounded-full border-2 border-blue-100">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {comment.userId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800">{comment.userId}</h3>
          <p className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</p>
        </div>
        </div>
        <button className="" onClick={handleDelete} disabled={loadingDelete}>
          <Trash2 className={`text-gray-500 ${loadingDelete ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'}`} />
        </button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">{comment.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpvote}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            <span className="text-xs font-semibold">
              {comment.replies.length > 0 ? `${comment.replies.length} Replies` : "No Replies"}
            </span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          <span className="text-xs">Reply</span>
        </Button>
      </CardFooter>
      {isReplying && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full rounded-xl border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <div className="flex">
              <Button
                onClick={handleReply}
                disabled={loadingReply}
                className="w-1/2 mx-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                <Send className="h-4 w-4 mr-2" />
                {loadingReply ? 'Submitting...' : 'Submit Reply'}
              </Button>
              <Button
                onClick={() => setIsReplying(!isReplying)}
                className="w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                <Send className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
      {comment.replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </Card>
  );
};

const CommentForm: React.FC<{ onSubmit: (content: string) => void }> = ({
  onSubmit,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
    setContent("");
  };

  return (
    <Card className="mb-4 bg-gradient-to-b from-gray-50 to-white shadow-sm rounded-2xl">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow text-sm rounded-xl border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-2 h-8 resize-none"
          />
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-1 h-8 px-3 text-sm"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const GET_COMMENT_BY_PRODUCT = gql`
  query GetCommentsByProduct($productId: String!) {
    getCommentsByProduct(productId: $productId) {
      id
      userId
      productId
      content
      parentCommentId
      createdAt 
      updatedAt 
    }
  }
`;

 const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

const ADD_COMMENT = gql`
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

function nestComments(comments: Comment[]): Comment[] {
  const commentMap: { [key: string]: Comment } = {};

  const clonedComments = comments.map((comment) => ({
    ...comment,
    replies: [],
  }));

  clonedComments.forEach((comment) => {
    commentMap[comment.id] = comment;
  });

  const nestedComments: Comment[] = [];

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
  
  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

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
        {structuredComments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet.</p>
        ) : (
          structuredComments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}
