import styles from "../../styles/pages/profile/ProfileIndex.module.css";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { useState } from "react";
import ProfileQuery from "../../components/profile/ProfileQuery";
import ProfileBlog from "../../components/profile/ProfileBlog";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { ShareRounded } from "@material-ui/icons";
import { motion } from "framer-motion";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {
  fadeWidthAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import { CircularProgress } from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UserProfile = () => {
  const router = useRouter();
  const [page, setPage] = useState("Queries");
  const [userData, setUserData] = useState({});
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

  const sharePost = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = window.location;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    handleClickBlogCopy();
  };

  useEffect(() => {
    if (router.query?.userID) {
      db.collection("Users")
        .doc(router.query?.userID)
        .get()
        .then((data) =>
          setUserData({
            id: data?.id,
            name: data.data()?.name,
            branch: data.data()?.branch,
            phno: data.data()?.phno,
          })
        );
    }
  }, [router.query?.userID]);

  return userData?.name ? (
    <motion.div
      className={styles.container}
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
          Profile URL copied!
        </Alert>
      </Snackbar>
      <IconButton className={styles.icon} onClick={sharePost}>
        <ShareRounded />
      </IconButton>
      <div className={styles.information}>
        <motion.div
          className={styles.name}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.1,
          }}
        >
          {userData?.name}
        </motion.div>
        <motion.p
          className={styles.branch}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.2,
          }}
        >
          {userData?.branch?.title}
        </motion.p>
        <motion.p
          className={styles.contact}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.3,
          }}
        >
          {userData?.phno
            ?.split("")
            .map((no, index) => (index > 1 && index < 7 ? "*" : no))
            .toString()
            .replaceAll(",", "")}
        </motion.p>
      </div>

      <motion.div
        className={styles.titles}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: 1.3,
        }}
      >
        <h2
          onClick={() => setPage("Queries")}
          className={`${styles.title} ${styles.border}`}
          style={{ backgroundColor: page === "Queries" && "#222d32" }}
        >
          Queries
        </h2>
        <h2
          onClick={() => setPage("Blogs")}
          className={styles.title}
          style={{ backgroundColor: page === "Blogs" && "#222d32" }}
        >
          Blogs
        </h2>
      </motion.div>

      <motion.div
        className={styles.path}
        initial={{
          opacity: 0,
          x: "-50vw",
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: "-50vw",
        }}
        transition={{
          duration: 0.5,
          delay: 1.5,
        }}
      >
        <AccountCircleRoundedIcon />
        <p className={styles.main_path}>{userData?.name}</p>/
        <p className={styles.sub_path}>{page}</p>
      </motion.div>

      <div className={styles.content}>
        {page === "Queries" ? (
          <ProfileQuery
            userID={router.query.userID}
            branch={userData?.branch?.title}
          />
        ) : (
          <ProfileBlog userID={router.query.userID} />
        )}
      </div>
    </motion.div>
  ) : (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress style={{ color: "black" }} />
    </div>
  );
};

export default UserProfile;
