import React, { useState } from "react";
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

const BlogForm = ({ open, fetchBlogs, handleClose }) => {
  const classes = useStyles();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [{ user }, dispatch] = useStateValue();
  const [posting, setPosting] = useState(false);

  const postBlog = async () => {
    if (blogTitle.trim().length < 2) {
      alert("Blog title must be at least 3 characters long.");
    } else if (blogText.trim().length < 10) {
      alert("Blog content/text must be at least 10 characters long");
    } else if (blogImage && !blogImage.type.includes("image")) {
      alert("You must upload a valid image");
    } else {
      setPosting(true);

      let imageURL = "";
      if (blogImage) {
        const storageRef = await storage.ref(
          `/blogs/${user?.id}/${blogImage.name}-${new Date()}`
        );
        await storageRef.put(blogImage);

        imageURL = await storageRef.getDownloadURL();
      }

      await db.collection("Blogs").add({
        by: user?.id,
        image: imageURL,
        title: blogTitle,
        text: blogText,
        views: [],
        likes: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setBlogImage(null);
      setBlogTitle("");
      setBlogText("");
      setPosting(false);
      handleClose();
      fetchBlogs();
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Post a Blog
          </Typography>
          {posting ? (
            <div className="progress-div">
              <CircularProgress size={24} style={{ color: "black" }} />
            </div>
          ) : (
            <Button
              style={{ display: "flex", alignItems: "center" }}
              color="inherit"
              onClick={postBlog}
            >
              Publish
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
          {blogImage && (
            <motion.div
              className={blogFormStyles.imagePreview}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.571 }}
            >
              <img src={URL.createObjectURL(blogImage)} alt="" />
              <IconButton
                onClick={() => setBlogImage(null)}
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
    </Dialog>
  );
};

export default BlogForm;
