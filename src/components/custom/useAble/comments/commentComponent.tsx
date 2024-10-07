import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/middleware/context/authContext";
import {  useMutation } from "@apollo/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash,
  Flag,
  Share,
  ChevronDown,
  MessageSquare,
  Send,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ADD_COMMENT, GET_COMMENT_BY_PRODUCT, DELETE_COMMENT, UPDATE_COMMENT, Comments } from "./gql";





export function FormatTimeAgo(dateString: string): string {
  return moment(dateString).fromNow();
}

export const CommentComponent: React.FC<{ comment: Comments; depth: number }> = ({
  comment,
  depth,
}) => {
  const { user,isAuthenticated } = useAuth();
  const isCommentOwner = user?.id === comment.userId; // Check if the current user is the comment owner

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [, setLoadingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false); // New state for toggling replies

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENT_BY_PRODUCT,
        variables: { productId: comment.productId },
      },
    ],
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENT_BY_PRODUCT,
        variables: { productId: comment.productId },
      },
    ],
  });

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENT_BY_PRODUCT,
        variables: { productId: comment.productId },
      },
    ],
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
    if (!replyContent.trim()) return; // Prevent empty replies
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
    })
      .then(() => {
        setReplyContent("");
        setIsReplying(false);
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      })
      .finally(() => {
        setLoadingReply(false);
      });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (!editContent.trim()) return; // Prevent empty edits
    updateComment({
      variables: {
        id: comment.id,
        content: editContent,
      },
    })
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => console.error("Error updating comment:", error));
  };



  return (
    <Card
      className={`mb-4 ${
        depth > 0 ? "ml-6" : ""
      } bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-sm rounded-2xl`}
    >
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-4 p-4">
          <Avatar className="h-10 w-10 rounded-full border-2 border-blue-100">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {comment.userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-800">{comment.userName}</h3>
            <p className="text-xs text-gray-500">
              {FormatTimeAgo(comment.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isCommentOwner && 
            <>
            
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            </>
            }
            <DropdownMenuItem>
              <Flag className="mr-2 h-4 w-4" />
              <span>Report</span>
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <form onSubmit={handleEdit} className="flex items-center space-x-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit a comment..."
              className="flex-grow text-sm rounded-xl border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-2 h-8 resize-none"
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-1 h-8 px-3 text-sm"
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">{comment.content}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
           
            onClick={() => setAreRepliesVisible(!areRepliesVisible)}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <ChevronDown className={`h-4 w-4 mr-1 transform ${areRepliesVisible ? "rotate-180" : ""}`} />
            <span className="text-xs font-semibold">
              {comment.replies.length > 0
                ? `${comment.replies.length} Replies`
                : "No Replies"}
            </span>
          </Button>
        </div>
        {isAuthenticated &&
        
        <div>
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)} className="text-xs">
              Close
            </Button>
          ) : (

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          )}
        </div>
        }
      </CardFooter>

      {isReplying && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full rounded-xl border-gray-300 focus:border-blue-300"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleReply}
                disabled={loadingReply}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                <Send className="h-4 w-4 mr-2" />
                {loadingReply ? "Submitting..." : "Submit Reply"}
              </Button>
              <Button
                onClick={() => setIsReplying(false)}
                className="w-1/4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardFooter>
      )}

      
       {areRepliesVisible && isAuthenticated && comment.replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </Card>
  );
};
