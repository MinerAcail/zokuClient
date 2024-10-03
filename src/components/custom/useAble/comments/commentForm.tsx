import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";



export const CommentForm: React.FC<{ onSubmit: (content: string) => void }> = ({
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