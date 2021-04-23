import styles from "../../styles/pages/profile/ProfileIndex.module.css";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { useStateValue } from "../../context/StateProvider";
import { useState } from "react";
import ProfileQuery from "../../components/profile/ProfileQuery";
import ProfileBlog from "../../components/profile/ProfileBlog";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { ShareRounded } from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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

  return (
    <div className={styles.container}>
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
        <div className={styles.name}>{userData?.name}</div>
        <p className={styles.branch}>{userData?.branch?.title}</p>
        {/* <p className={styles.contact}>{userData?.phno}</p> */}
      </div>

      <div className={styles.titles}>
        <h2
          onClick={() => setPage("Queries")}
          className={`${styles.title} ${styles.border}`}
        >
          Queries
        </h2>
        <h2 onClick={() => setPage("Blogs")} className={styles.title}>
          Blogs
        </h2>
      </div>

      <div className={styles.path}>
        <AccountCircleRoundedIcon />
        <p className={styles.main_path}>{userData?.name}</p>/
        <p className={styles.sub_path}>{page}</p>
      </div>

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
    </div>
  );
};

export default UserProfile;
