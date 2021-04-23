import styles from "../../styles/pages/profile/ProfileIndex.module.css";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { useStateValue } from "../../context/StateProvider";
import { useState } from "react";
import ProfileQuery from "../../components/profile/ProfileQuery";
import ProfileBlog from "../../components/profile/ProfileBlog";
import IconButton from "@material-ui/core/IconButton";

const Profile = () => {
  const [{ user }, dispatch] = useStateValue();
  const [page, setPage] = useState("Queries");

  return (
    <div className={styles.container}>
      <IconButton className={styles.icon}>
        <EditRoundedIcon />
      </IconButton>
      <div className={styles.information}>
        <div className={styles.name}>{user?.name}</div>
        <p className={styles.branch}>{user?.branch?.title}</p>
        <p className={styles.contact}>{user?.phno}</p>
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
        <p className={styles.main_path}>{user?.name}</p>/
        <p className={styles.sub_path}>{page}</p>
      </div>

      <div className={styles.content}>
        {page === "Queries" ? (
          <ProfileQuery userID={user?.id} branch={user?.branch?.title} />
        ) : (
          <ProfileBlog userID={user?.id} />
        )}
      </div>
    </div>
  );
};

export default Profile;
