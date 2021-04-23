import styles from "../../styles/pages/profile/ProfileIndex.module.css";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
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

const Profile = () => {
  const [{ user }, dispatch] = useStateValue();
  const [page, setPage] = useState("Queries");

  return (
    <motion.div
      className={styles.container}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <IconButton className={styles.icon}>
        <EditRoundedIcon />
      </IconButton>
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
          className={styles.name}
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
