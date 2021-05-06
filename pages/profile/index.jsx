import styles from "../../styles/pages/profile/ProfileIndex.module.css";
import MoreVertRounded from "@material-ui/icons/MoreVertRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { useStateValue } from "../../context/StateProvider";
import { useState } from "react";
import ProfileQuery from "../../components/profile/ProfileQuery";
import ProfileBlog from "../../components/profile/ProfileBlog";
import IconButton from "@material-ui/core/IconButton";
import {
  fadeWidthAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import { motion } from "framer-motion";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import EditRounded from "@material-ui/icons/EditRounded";
import { MeetingRoomOutlined, ShareRounded } from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import EditProfile from "../../components/profile/EditProfile";
import { actionTypes } from "../../context/reducer";
import { useRouter } from "next/router";
import { BootstrapTooltip } from "../../services/utilities";
import ReportModal from "../../components/report/ReportModal";
import { Rating } from "@material-ui/lab";
import Head from "next/head";

const ITEM_HEIGHT = 48;
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Profile = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [page, setPage] = useState("Queries");
  const [openCopy, setOpenCopy] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleReportModalOpen = () => {
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(`${window.location}/${user?.id}`);

    setOpenCopy(true);
    handleClose();
  };

  const logOut = () => {
    localStorage.removeItem("forumUserID");
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
    });
    router.replace("/auth/login");
  };

  return (
    <motion.div
      className={styles.container}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <meta property="og:title" content="GPAForum | Profile" />
        <meta name="description" content="See your profile." />
        <meta name="og:description" content="See your profile." />
      </Head>
      <ReportModal
        reportModalOpen={reportModalOpen}
        handleReportModalClose={handleReportModalClose}
        id={user?.id}
        reports={user?.reports}
      />
      <EditProfile
        openEditProfile={openEditProfile}
        setOpenEditProfile={setOpenEditProfile}
      />
      <Snackbar
        open={openCopy}
        autoHideDuration={6000}
        onClose={() => setOpenCopy(false)}
      >
        <Alert onClose={() => setOpenCopy(false)} severity="success">
          Profile URL copied!
        </Alert>
      </Snackbar>
      <BootstrapTooltip title="Options">
        <IconButton className={styles.icon} onClick={handleClick}>
          <MoreVertRounded />
        </IconButton>
      </BootstrapTooltip>
      <Menu
        id="long-menu"
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
        <MenuItem
          onClick={() => {
            setOpenEditProfile(true);
            handleClose();
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit
          <EditRounded fontSize="small" style={{ color: "grey" }} />
        </MenuItem>
        <MenuItem
          onClick={shareProfile}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Share
          <ShareRounded fontSize="small" style={{ color: "grey" }} />
        </MenuItem>
        <MenuItem
          onClick={logOut}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Log Out
          <MeetingRoomOutlined fontSize="small" style={{ color: "grey" }} />
        </MenuItem>
      </Menu>
      <div className={styles.information}>
        <motion.div
          className={styles.name}
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
          {user?.name}
        </motion.div>
        <motion.p
          className={styles.branch}
          className={styles.name}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.2,
          }}
        >
          {user?.branch?.title}
        </motion.p>
        <motion.p
          className={styles.contact}
          style={{ marginBottom: 4 }}
          variants={fadeWidthAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.3,
          }}
        >
          {user?.phno}
        </motion.p>
        <Rating
          style={{ marginLeft: 7 }}
          name="read-only"
          value={5 - user?.reports / 4}
          size="small"
          readOnly
        />
        <p
          className={styles.name}
          style={{ marginTop: 0, cursor: "pointer" }}
          onClick={handleReportModalOpen}
        >
          Show report
        </p>
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
        <p className={styles.main_path}>{user?.name}</p>/
        <p className={styles.sub_path}>{page}</p>
      </motion.div>

      <div className={styles.content}>
        {page === "Queries" ? (
          <ProfileQuery userID={user?.id} branch={user?.branch?.title} />
        ) : (
          <ProfileBlog userID={user?.id} />
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
