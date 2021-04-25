import React, { useState } from "react";
import blogsStyles from "../../styles/pages/blogs/Blog.module.css";
import ShareIcon from "@material-ui/icons/Share";
import { Divider, IconButton, CircularProgress } from "@material-ui/core";
import Link from "next/link";
import {
  FavoriteBorderOutlined,
  FavoriteRounded,
  ModeCommentOutlined,
  PauseCircleOutlineOutlined,
  PlayCircleOutlineRounded,
  SendRounded,
  StopOutlined,
} from "@material-ui/icons";
import { db, firebase } from "../../services/firebase";
import { motion } from "framer-motion";
import {
  fadeAnimationVariant,
  fadeWidthAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactLinkify from "react-linkify";
import Comment from "../../components/blogs/Comment";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { report } from "../../services/report";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Blog = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commenting, setCommenting] = useState(false);
  const [speechState, setSpeechState] = useState("");
  const [blogData, setBlogData] = useState({});
  const [userData, setUserData] = useState({});
  const [openBlogCopy, setOpenBlogCopy] = React.useState(false);

  const handleClickBlogCopy = () => {
    setOpenBlogCopy(true);
  };

  const handleCloseBlogCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBlogCopy(false);
  };

  const addComment = (e) => {
    e.preventDefault();

    if (comment.trim().length < 4) {
      alert("Your comment must be at least 3 letters long.");
    } else {
      if (!report(comment)) {
        setCommenting(true);
        db.collection("Blogs")
          .doc(router.query.blogID)
          .collection("Comments")
          .add({
            comment,
            by: user?.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setCommenting(false);
            setComment("");
          });
      } else {
        alert(
          "You cannot use slangs in Solution. \nKeep the platform clean 🙏."
        );
      }
    }
  };

  const likePost = () => {
    db.collection("Blogs")
      .doc(router.query.blogID)
      .update({
        likes: blogData?.likes?.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };

  const sharePost = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    handleClickBlogCopy();
  };

  const loadComments = () => {
    db.collection("Blogs")
      .doc(router.query.blogID)
      .collection("Comments")
      .onSnapshot((snapshot) =>
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: doc.data().comment,
            by: doc.data().by,
            timestamp: doc.data().timestamp,
          }))
        )
      );
  };

  useEffect(() => {
    db.collection("Blogs")
      .doc(router.query.blogID)
      .onSnapshot((snapshot) => {
        setBlogData({
          title: snapshot.data().title,
          text: snapshot.data().text,
          by: snapshot.data().by,
          timestamp: snapshot.data().timestamp,
          likes: snapshot.data().likes,
          views: snapshot.data().views,
          image: snapshot.data().image,
        });
        db.collection("Users")
          .doc(snapshot.data().by)
          .get()
          .then((data) =>
            setUserData({
              id: data?.id,
              name: data.data()?.name,
            })
          );
      });
    loadComments();

    return () => {
      if (speechSynthesis) {
        speechSynthesis.resume();
        speechSynthesis.cancel();
      }
    };
  }, []);

  const readPost = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis && speechSynthesis.cancel();

      const speechSynthesis = new SpeechSynthesisUtterance();
      speechSynthesis.text = `Title- ${blogData?.title}.By ${userData?.name} ${blogData?.text}`;
      speechSynthesis.addEventListener("end", () => setSpeechState(""));
      speechSynthesis.volume = 1;
      speechSynthesis.rate = 0.8;
      speechSynthesis.pitch = 1;
      speechSynthesis.lang = "en-IN";
      window.speechSynthesis.speak(speechSynthesis);
      setSpeechState("Speaking");
    } else {
      alert("Sorry, your browser doesn't support this feature!");
    }
  };

  return (
    <motion.div
      className={blogsStyles.blogPage}
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
      <div className={blogsStyles.blog}>
        <motion.p
          className={blogsStyles.topText}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.0,
          }}
        >
          On: {blogData?.timestamp?.toDate().toLocaleString()} / Likes:{" "}
          {blogData?.likes?.length} / Comments: {comments?.length} / Views:{" "}
          {blogData?.views?.length}
        </motion.p>
        <motion.p
          className={blogsStyles.title}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.1,
          }}
        >
          {blogData?.title}
        </motion.p>
        <Link
          href={
            userData?.id === user?.id ? `/profile` : `/profile/${userData?.id}`
          }
        >
          <motion.a
            className={blogsStyles.author}
            variants={fadeAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: 1.2,
            }}
          >
            {userData?.name}
          </motion.a>
        </Link>
        <motion.img
          src={blogData?.image ? blogData?.image : "/images/logo.png"}
          alt="blog"
          className={blogsStyles.image}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 1.1,
            delay: 1.3,
          }}
        />
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <motion.pre
            className={blogsStyles.blogText}
            variants={fadeAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: 1.4,
            }}
          >
            {blogData?.text}
          </motion.pre>
        </ReactLinkify>
        <div className={blogsStyles.buttons}>
          <button className={blogsStyles.button} onClick={likePost}>
            {/* <Badge
              badgeContent={4}
              color="secondary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            > */}
            {blogData?.likes?.includes(user?.id) ? (
              <FavoriteRounded
                fontSize="small"
                style={{ marginRight: 4 }}
                color="secondary"
              />
            ) : (
              <FavoriteBorderOutlined
                fontSize="small"
                style={{ marginRight: 4 }}
              />
            )}
            {/* </Badge> */}
            {blogData?.likes?.includes(user?.id)
              ? "Dislike this Article"
              : "Like this Article"}
          </button>
          {speechSynthesis &&
            (speechState === "Speaking" || speechState === "Paused") && (
              <div className={blogsStyles.speechButtons}>
                <IconButton
                  style={{ padding: 4, marginRight: 4 }}
                  onClick={() => {
                    if (speechState === "Paused") {
                      speechSynthesis.resume();
                      setSpeechState("Speaking");
                    } else if (speechState === "Speaking") {
                      speechSynthesis.pause();
                      setSpeechState("Paused");
                    }
                  }}
                >
                  {speechState === "Paused" && <PlayCircleOutlineRounded />}{" "}
                  {speechState === "Speaking" && <PauseCircleOutlineOutlined />}
                </IconButton>
                <IconButton
                  style={{ padding: 4 }}
                  onClick={() => {
                    speechSynthesis.resume();
                    speechSynthesis.cancel();
                    setSpeechState("");
                  }}
                >
                  <StopOutlined />
                </IconButton>
              </div>
            )}{" "}
          {speechState === "" && (
            <button className={blogsStyles.button} onClick={readPost}>
              Read Aloud
            </button>
          )}
          <button className={blogsStyles.button} onClick={sharePost}>
            Share this Article
            <ShareIcon fontSize="small" style={{ marginLeft: 4 }} />
          </button>
        </div>
        <Divider />
        <div className={blogsStyles.comments}>
          {/* <p
            style={{
              margin: 0,
              textAlign: "center",
              color: "#e84118",
              cursor: "pointer",
            }}
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? "Hide Comments" : "Show Comments"}
          </p> */}
          {comments.map((comment) => (
            <Comment
              by={comment?.by}
              comment={comment.comment}
              timestamp={comment?.timestamp?.toDate().toLocaleString()}
            />
          ))}
        </div>
        <Divider />
        <div className={blogsStyles.commentInputDiv}>
          <ModeCommentOutlined
            fontSize="small"
            style={{ marginLeft: 4, color: "grey" }}
          />
          <TextareaAutosize
            id="comment-input"
            placeholder={`Leave a comment`}
            type="text"
            className={blogsStyles.commentInput}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength={71}
          />
          {commenting ? (
            <div className="progress-div">
              <CircularProgress size={21} style={{ color: "black" }} />
            </div>
          ) : (
            <IconButton onClick={addComment}>
              <SendRounded fontSize="small" style={{ marginRight: 4 }} />
            </IconButton>
          )}
        </div>
        <Divider />
      </div>
    </motion.div>
  );
};

export default Blog;
