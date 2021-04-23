import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../services/firebase";
import commentStyles from "../../styles/components/blogs/Comment.module.css";

const Comment = ({ by, comment, timestamp }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((data) => setUser({ id: data.id, name: data.data().name }));
  }, []);

  return (
    <div className={commentStyles.comment}>
      <p className={commentStyles.by}>{user?.name}</p>
      <p className={commentStyles.commentText}>{comment}</p>
      <p className={commentStyles.timestamp}>{timestamp}</p>
    </div>
  );
};

export default Comment;
