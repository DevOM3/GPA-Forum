import React, { useState } from "react";
import blogPageStyles from "../../styles/pages/blogs/BlogPage.module.css";
import { Divider, IconButton } from "@material-ui/core";
import BlogPostListItem from "../../components/blogs/BlogPostListItem";
import { AnimatePresence, motion } from "framer-motion";
import {
  fabAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import { useStateValue } from "../../context/StateProvider";
import BlogForm from "../../components/blogs/BlogForm";
import EditIcon from "@material-ui/icons/Edit";
import { db } from "../../services/firebase";
import { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import BlogEditForm from "../../components/blogs/BlogEditForm";
import { BootstrapTooltip } from "../../services/utilities";
import Head from "next/head";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BlogPage = () => {
  const [{ user, searchString }, dispatch] = useStateValue();
  const [open, setDialogOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [openBlogCopy, setOpenBlogCopy] = useState(false);
  const [currentID, setCurrentID] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const handleClickBlogCopy = () => {
    setOpenBlogCopy(true);
  };

  const handleCloseBlogCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBlogCopy(false);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const fetchBlogs = () => {
    db.collection("Blogs")
      .orderBy("timestamp", "desc")
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
      <Head>
        <title>GPAForum | Blogs</title>
        <meta property="og:title" content="GPAForum | Blogs" key="title" />
        <meta
          name="description"
          content="See blogs from all GPAForum users."
          key="desc"
        />
        <meta
          property="og:description"
          content="See blogs from all GPAForum users."
          key="og-desc"
        />
      </Head>
      <Snackbar
        open={openBlogCopy}
        autoHideDuration={6000}
        onClose={handleCloseBlogCopy}
      >
        <Alert onClose={handleCloseBlogCopy} severity="success">
          Blog URL copied!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteOpen(false)}
      >
        <Alert onClose={() => setDeleteOpen(false)} severity="warning">
          Blog post deleted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateOpen}
        autoHideDuration={6000}
        onClose={() => setUpdateOpen(false)}
      >
        <Alert onClose={() => setUpdateOpen(false)} severity="info">
          Blog post updated!
        </Alert>
      </Snackbar>
      <BlogForm open={open} fetchBlogs={fetchBlogs} handleClose={handleClose} />
      <BlogEditForm
        open={openEdit}
        fetchBlogs={fetchBlogs}
        handleClose={setOpenEdit}
        setUpdateOpen={setUpdateOpen}
        id={currentID}
        setCurrentID={setCurrentID}
      />
      <BootstrapTooltip title="Add Blog">
        <motion.div
          className="fab"
          variants={fabAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <IconButton onClick={handleClickOpen}>
            <EditIcon style={{ color: "black" }} />
          </IconButton>
        </motion.div>
      </BootstrapTooltip>
      <AnimatePresence>
        {blogs
          .filter(
            (blog) =>
              blog?.title.toLowerCase().includes(searchString.toLowerCase()) ||
              blog?.text.toLowerCase().includes(searchString.toLowerCase())
          )
          .map((blog, index) => (
            <div key={blog?.id}>
              <BlogPostListItem
                index={index > 0 ? index / 7 : index}
                id={blog?.id}
                image={blog?.image}
                title={blog?.title}
                text={blog?.text}
                timestamp={blog?.timestamp}
                by={blog?.by}
                handleClickBlogCopy={handleClickBlogCopy}
                setDeleteOpen={setDeleteOpen}
                fetchBlogs={fetchBlogs}
                setCurrentID={setCurrentID}
                setOpenEdit={setOpenEdit}
              />
              <Divider style={{ width: "80%", margin: "auto" }} />
            </div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogPage;
