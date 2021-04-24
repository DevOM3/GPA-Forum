import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import SendIcon from "@material-ui/icons/Send";
import blogFormStyles from "../../styles/components/blogs/BlogForm.module.css";
import {
  AddPhotoAlternateOutlined,
  DescriptionOutlined,
  RemoveCircleOutlineOutlined,
  TitleOutlined,
} from "@material-ui/icons";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { AnimatePresence, motion } from "framer-motion";
import { db, firebase, storage } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "sticky",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlogEditForm = ({
  open,
  fetchBlogs,
  handleClose,
  setUpdateOpen,
  id,
  setCurrentID,
}) => {
  const classes = useStyles();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [blogImageLink, setBlogImageLink] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [{ user }, dispatch] = useStateValue();
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateBlog = async () => {
    if (blogTitle.trim().length < 2) {
      alert("Blog title must be at least 3 characters long.");
    } else if (blogText.trim().length < 10) {
      alert("Blog content/text must be at least 10 characters long");
    } else if (blogImage && !blogImage.type.includes("image")) {
      alert("You must upload a valid image");
    } else {
      setPosting(true);

      let imageURL = blogImageLink;
      if (blogImage) {
        const storageRef = await storage.ref(
          `/blogs/${user?.id}/${blogImage.name}-${new Date()}`
        );
        await storageRef.put(blogImage);

        imageURL = await storageRef.getDownloadURL();
      }

      await db.collection("Blogs").doc(id).update({
        image: imageURL,
        title: blogTitle,
        text: blogText,
      });

      setUpdateOpen(true);
      setPosting(false);
      handleClose();
      fetchBlogs();
    }
  };

  useEffect(() => {
    user &&
      id &&
      db
        .collection("Blogs")
        .doc(id)
        .get()
        .then((data) => {
          setBlogTitle(data.data().title);
          setBlogText(data.data().text);
          setBlogImageLink(data.data().image);
        })
        .then(() => setLoading(false));

    () => setCurrentID("");
  }, [user, id]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => handleClose(false)}
      TransitionComponent={Transition}
    >
      {loading ? (
        <motion.div
          className="progress-div"
          style={{ height: 100 }}
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
        <>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => handleClose(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Update a Blog
              </Typography>
              {posting ? (
                <div className="progress-div">
                  <CircularProgress size={24} style={{ color: "black" }} />
                </div>
              ) : (
                <Button
                  style={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  onClick={updateBlog}
                >
                  Update
                  <SendIcon
                    style={{ color: "white", marginLeft: 4 }}
                    fontSize="small"
                  />
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <div className={blogFormStyles.inputs}>
            <div className={blogFormStyles.inputDiv}>
              <TitleOutlined
                fontSize="small"
                style={{ marginLeft: 4, color: "grey" }}
              />
              <input
                placeholder={`Blog Title`}
                type="text"
                className={blogFormStyles.input}
                onChange={(e) => setBlogTitle(e.target.value)}
                value={blogTitle}
                maxLength={111}
              />
            </div>
            <div
              className={blogFormStyles.inputDiv}
              onClick={() => document.getElementById("image-picker").click()}
              style={{ height: 47, cursor: "pointer" }}
            >
              <AddPhotoAlternateOutlined
                fontSize="small"
                style={{ marginLeft: 4, color: "grey" }}
              />
              <p
                style={{
                  margin: 0,
                  color: "grey",
                  fontFamily: `"Poppins", sans-serif`,
                  fontSize: 14,
                  marginLeft: 11,
                }}
              >
                Pick an Image (Optional)
              </p>
              <input
                hidden
                id="image-picker"
                placeholder={`Blog Image (Optional)`}
                type="file"
                accept="image/*"
                className={blogFormStyles.input}
                onChange={(e) => setBlogImage(e.target.files[0])}
              />
            </div>
            <AnimatePresence>
              {(blogImage || blogImageLink) && (
                <motion.div
                  className={blogFormStyles.imagePreview}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.571 }}
                >
                  <img
                    src={
                      blogImage ? URL.createObjectURL(blogImage) : blogImageLink
                    }
                    alt=""
                  />
                  <IconButton
                    onClick={() =>
                      blogImage ? setBlogImage(null) : setBlogImageLink("")
                    }
                    className={blogFormStyles.removeImageButton}
                  >
                    <RemoveCircleOutlineOutlined
                      style={{ color: "red" }}
                      fontSize="small"
                    />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={blogFormStyles.inputDiv}>
              <DescriptionOutlined
                fontSize="small"
                style={{ marginLeft: 4, color: "grey" }}
              />
              <TextareaAutosize
                rowsMax={5}
                placeholder={`Blog Content`}
                type="text"
                className={blogFormStyles.input}
                onChange={(e) => setBlogText(e.target.value)}
                value={blogText}
              />
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
};

export default BlogEditForm;
