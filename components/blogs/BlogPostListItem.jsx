import React from "react";
import Link from "next/link";
import { IconButton } from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteRounded from "@material-ui/icons/FavoriteRounded";
import blogPostListItemStyles from "../../styles/components/blogs/BlogPostListItem.module.css";
import { AnimatePresence, motion } from "framer-motion";
import {
  fadeAnimationVariant,
  fadeWidthAnimationVariant,
} from "../../services/utilities";
import { useState } from "react";
import { useEffect } from "react";
import { db, firebase } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";

const BlogPostListItem = ({
  index,
  id,
  image,
  title,
  text,
  timestamp,
  by,
  handleClickBlogCopy,
}) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [blogUser, setBlogUser] = useState({});
  const [views, setViews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((doc) =>
        setBlogUser({
          id: doc?.id,
          name: doc.data()?.name,
        })
      );
    db.collection("Blogs")
      .doc(id)
      .onSnapshot((snapshot) => {
        setViews(snapshot.data().views);
        setLikes(snapshot.data().likes);
      });
    db.collection("Blogs")
      .doc(id)
      .collection("Comments")
      .onSnapshot((snapshot) => setCommentCount(snapshot.docs.length));
  }, []);

  const likePost = () => {
    db.collection("Blogs")
      .doc(id)
      .update({
        likes: likes.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };

  const readMore = () => {
    db.collection("Blogs")
      .doc(id)
      .update({
        views: firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
    router.push(`/blogs/${id}`);
  };

  const sharePost = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.hostname}/blogs/${id}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    handleClickBlogCopy();
  };

  return (
    <motion.div
      className={blogPostListItemStyles.blog}
      variants={fadeAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
        delay: index - 0.2,
      }}
    >
      <motion.p
        className={blogPostListItemStyles.topText}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: index - 0.1,
        }}
      >
        On: {timestamp?.toDate().toLocaleString()} / Likes: {likes.length} /
        Comments: {commentCount} / Views: {views.length}
      </motion.p>
      <motion.p
        className={blogPostListItemStyles.title}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: index,
        }}
      >
        {title}
      </motion.p>
      <motion.p
        className={blogPostListItemStyles.author}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: index + 0.1,
        }}
      >
        <Link
          href={
            blogUser?.id === user?.id ? `/profile` : `/profile/${blogUser?.id}`
          }
        >
          <a>{blogUser?.name}</a>
        </Link>
      </motion.p>
      <AnimatePresence>
        <motion.img
          src={image ? image : "/images/logo.png"}
          alt="blog"
          className={blogPostListItemStyles.image}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: index + 0.2,
          }}
        />
      </AnimatePresence>
      <motion.p
        className={blogPostListItemStyles.blogText}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: index + 0.3,
        }}
      >
        {text}
      </motion.p>
      <div className={blogPostListItemStyles.buttons}>
        <IconButton
          style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
          className={blogPostListItemStyles.button}
          onClick={likePost}
        >
          {likes.includes(user?.id) ? (
            <FavoriteRounded
              fontSize="small"
              style={{ marginLeft: 4 }}
              color="secondary"
            />
          ) : (
            <FavoriteBorderOutlined
              fontSize="small"
              style={{ marginLeft: 4 }}
            />
          )}
        </IconButton>
        <button onClick={readMore} className={blogPostListItemStyles.button}>
          Read More
        </button>
        <IconButton
          style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
          className={blogPostListItemStyles.button}
          onClick={sharePost}
        >
          <ShareIcon fontSize="small" style={{ marginLeft: 4 }} />
        </IconButton>
      </div>
    </motion.div>
  );
};

export default BlogPostListItem;
