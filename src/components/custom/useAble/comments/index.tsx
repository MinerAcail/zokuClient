import React, { useState } from "react";
import { ChevronUp, ChevronDown, MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { initialComments } from "./data";

export type Comments = {
  id: number;
  author: string;
  content: string;
  votes: number;
  replies: Comments[];
  avatar: string;
};




const CommentComponent: React.FC<{ comment: Comments; depth: number }> = ({
  comment,
  depth,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleUpvote = () => {
    // Implement upvote logic here
  };

  const handleDownvote = () => {
    // Implement downvote logic here
  };

  const handleReply = () => {
    // Implement reply logic here
    console.log("Reply submitted:", replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <Card
      className={`mb-4 ${
        depth > 0 ? "ml-6" : ""
      } bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-sm rounded-2xl`}
    >
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-10 w-10 rounded-full border-2 border-blue-100">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {comment.author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800">{comment.author}</h3>
          <p className="text-xs text-gray-500">2 hours ago</p>
        </div>
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
            <ChevronUp className="h-4 w-4 mr-1" />
            <span className="text-xs font-semibold">{comment.votes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownvote}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ChevronDown className="h-4 w-4" />
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
            <Button
              onClick={handleReply}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Reply
            </Button>
          </div>
        </CardFooter>
      )}
      {comment.replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </Card>
  );
};

const CommentForm: React.FC<{ onSubmit: (content: string) => void }> = ({ onSubmit }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(content)
    setContent('')
  }

  return (
    <Card className="mb-4 bg-gradient-to-b from-gray-50 to-white  shadow-sm rounded-2xl">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow text-sm rounded-xl border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-2 h-8 resize-none"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-1 h-8 px-3 text-sm">
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}



export default function CommentSystem() {
  const [comments, setComments] = useState<Comments[]>(initialComments);

  const handleAddComment = (content: string) => {
    const newComment: Comments = {
      id: comments.length + 1,
      author: "CurrentUser",
      content,
      votes: 0,
      replies: [],
      avatar: "/placeholder.svg?height=40&width=40",
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="max-w-3xl max-h-[464px] overflow-auto mx-auto mt-8 p-4">
     
      <CommentForm onSubmit={handleAddComment} />

      {/* Scrollable Comments Section */} 
      <div className=" p-2 rounded-lg">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments available.</p>
        ) : (
          comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} depth={0} />
          ))
        )}
      </div>
     
    </div>
  );
}
