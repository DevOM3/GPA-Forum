import React from "react";
import blogPageStyles from "../../styles/pages/blogs/BlogPage.module.css";
import { Divider } from "@material-ui/core";
import BlogPostListItem from "../../components/blogs/BlogPostListItem";
import { motion } from "framer-motion";
import { pageAnimationVariant } from "../../services/utilities";

const BlogPage = () => {
  return (
    <motion.div
      className={blogPageStyles.main_page}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {[1, 2, 3, 4, 5].map((no, index) => (
        <>
          <BlogPostListItem id={index} key={index} />
          <Divider style={{ width: "80%", margin: "auto" }} />
        </>
      ))}
    </motion.div>
  );
};

export default BlogPage;
