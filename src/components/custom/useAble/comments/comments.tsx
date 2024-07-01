import { useEffect, useState } from "react";
import { getComments as getCommentsApi } from "./api";
import Comment from "./comment";
import "./index.css";
function Comments() {
  const [backendComments, setBackendComments] = useState([]);
  console.log("backendComments", backendComments);

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );
  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendComments(data);
    });
  }, []);
  return (
    <div>
      <div className="comments">
        <h3 className="comments-title">Comments</h3>
        <div className="comment-form-title">Write comment</div>
        <div className="comments-container">
          {rootComments.map((rootComment) => (
            <>
              <Comment key={rootComment.id} comment={rootComment} replies={getReplies(rootComment.id)} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;
