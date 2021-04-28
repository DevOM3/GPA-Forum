import styles from "../../styles/components/admin/Profile.module.css";
import HeaderStyles from "../../styles/components/admin/DashboardHeader.module.css";
import { db } from "../../services/firebase";
import React, { useEffect, useState } from "react";
import User from "./User";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    db.collection("Users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          branch: doc.data().branch,
          phno: doc.data().phno,
        }))
      )
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={HeaderStyles.path}>
        <i className={`fas fa-user-shield ${HeaderStyles.admin_icon}`}></i>
        Admin/
        <span className={HeaderStyles.path_link}>Profiles</span>
      </div>

      <div className={HeaderStyles.search}>
        <div className={HeaderStyles.search_group}>
          <input
            type="text"
            placeholder="Search..."
            className={HeaderStyles.search_box}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <span className={HeaderStyles.icon}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
      </div>

      <div className={styles.profiles}>
        {users
          .filter(
            (user) =>
              user.name?.toLowerCase().includes(searchString.toLowerCase()) ||
              user.branch?.title
                ?.toLowerCase()
                .includes(searchString.toLowerCase()) ||
              user.branch?.acronym
                ?.toLowerCase()
                .includes(searchString.toLowerCase())
          )

          .map((user) => (
            <User
              key={user.id}
              name={user?.name}
              branch={user?.branch?.title}
              phno={user?.phno}
              id={user?.id}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
