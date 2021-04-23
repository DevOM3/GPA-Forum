import React, { useState } from "react";
import { useStateValue } from "../../context/StateProvider";
import { db } from "../../services/firebase";
import blogPageStyles from "../../styles/pages/blogs/BlogPage.module.css";
import { Divider } from "@material-ui/core";
import BlogPostListItem from "../../components/blogs/BlogPostListItem";
import { motion } from "framer-motion";
import { pageAnimationVariant } from "../../services/utilities";
import { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProfileBlog = ({ userID }) => {
  const [{ user }, dispatch] = useStateValue();
  const [blogs, setBlogs] = useState([]);
  const [openBlogCopy, setOpenBlogCopy] = useState(false);

  const handleClickBlogCopy = () => {
    setOpenBlogCopy(true);
  };

  const handleCloseBlogCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBlogCopy(false);
  };

  const fetchBlogs = () => {
    db.collection("Blogs")
      .where("by", "==", userID)
      .get()
      .then((snapshot) =>
        setBlogs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            image: doc.data().image,
            title: doc.data().title,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            by: doc.data().by,
          }))
        )
      );
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  return (
    <motion.div
      className={blogPageStyles.main_page}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Snackbar
        open={openBlogCopy}
        autoHideDuration={6000}
        onClose={handleCloseBlogCopy}
      >
        <Alert onClose={handleCloseBlogCopy} severity="success">
          Blog URL copied!
        </Alert>
      </Snackbar>
      {blogs.map((blog, index) => (
        <>
          <BlogPostListItem
            index={index > 0 ? index / 7 : index}
            id={blog?.id}
            key={blog?.id}
            image={blog?.image}
            title={blog?.title}
            text={blog?.text}
            timestamp={blog?.timestamp}
            by={blog?.by}
            handleClickBlogCopy={handleClickBlogCopy}
          />
          <Divider style={{ width: "80%", margin: "auto" }} />
        </>
      ))}
    </motion.div>
  );
};

export default ProfileBlog;
