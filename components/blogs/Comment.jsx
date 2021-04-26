import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import commentStyles from "../../styles/components/blogs/Comment.module.css";
import moment from "moment";
import { useRouter } from "next/router";

const Comment = ({ id, by, comment, timestamp }) => {
  const router = useRouter();
  const [user, setUser] = useState({});

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((data) => {
        if (data.exists) {
          setUser({ id: data?.id, name: data.data()?.name });
        } else {
          db.collection("Blogs")
            .doc(router.query.blogID)
            .collection("Comments")
            .doc(id)
            .delete();
        }
      });
  }, []);

  return (
    <div className={commentStyles.comment}>
      <Link href={`/profile/${user.id}`}>
        <a className={commentStyles.by}>{user?.name}</a>
      </Link>
      <p className={commentStyles.timestamp}>{moment(timestamp).fromNow()}</p>
      <p className={commentStyles.commentText}>{comment}</p>
    </div>
  );
};

export default Comment;
