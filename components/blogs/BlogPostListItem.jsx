import React from "react";
import Link from "next/link";
import { IconButton, CircularProgress } from "@material-ui/core";
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
import { db, firebase, storage } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";
import Menu from "@material-ui/core/Menu";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ReportOutlined } from "@material-ui/icons";
import ReactLinkify from "react-linkify";
import { report } from "../../services/report";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

const BlogPostListItem = ({
  index,
  id,
  image,
  title,
  text,
  timestamp,
  by,
  handleClickBlogCopy,
  setDeleteOpen,
  fetchBlogs,
  setOpenEdit,
  setCurrentID,
}) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [blogUser, setBlogUser] = useState({});
  const [views, setViews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleting, setDeleting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setBlogUser({
            id: doc?.id,
            name: doc.data()?.name,
          });
        }
      });
    db.collection("Blogs")
      .doc(id)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setViews(snapshot.data().views);
          setLikes(snapshot.data().likes);
        }
      });
    db.collection("Blogs")
      .doc(id)
      .collection("Comments")
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          setCommentCount(snapshot.docs.length);
        }
      });
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

  const reportBlog = () => {
    if (report(title) || report(text)) {
      deleteBlog();
    } else {
      alert("This blog is all right!");
    }
  };

  const deleteBlog = async () => {
    setDeleting(true);
    if (image) {
      await storage.refFromURL(image).delete();
    }
    const blogRef = await db.collection("Blogs").doc(id);
    const blogComments = (await blogRef.collection("Comments").get()).docs;

    for (let index = 0; index < blogComments.length; index++) {
      await db
        .collection("Blogs")
        .doc(id)
        .collection("Comments")
        .doc(blogComments[index].id)
        .delete();
    }

    await blogRef.delete();
    setDeleteOpen(true);
    fetchBlogs();
    setDeleting(false);
  };

  const editPost = async () => {
    setCurrentID(id);
    setOpenEdit(true);
  };
  const deletePost = async () => {
    if (confirm("Are you sure to delete this Blog post?")) {
      deleteBlog();
    }
  };

  return deleting ? (
    <motion.div
      className={`${blogPostListItemStyles.blog} progress-div`}
      style={{ height: 400 }}
      variants={fadeWidthAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
      }}
    >
      <CircularProgress size={24} style={{ color: "black" }} />
    </motion.div>
  ) : (
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton disabled>
          <MoreVertIcon style={{ color: "white" }} />
        </IconButton>
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
        {user?.id === by ? (
          <div className={blogPostListItemStyles.menu}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={() => {
                    option === "Edit" ? editPost() : deletePost();
                    handleClose();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {option}
                  {option === "Edit" ? (
                    <EditRoundedIcon
                      fontSize="small"
                      style={{ color: "grey" }}
                    />
                  ) : (
                    <DeleteRoundedIcon
                      fontSize="small"
                      style={{ color: "grey" }}
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : (
          <div className={blogPostListItemStyles.menu}>
            <IconButton onClick={reportBlog}>
              <ReportOutlined />
            </IconButton>
          </div>
        )}
      </div>
      {/* <ReactLinkify> */}
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
      {/* </ReactLinkify> */}
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
