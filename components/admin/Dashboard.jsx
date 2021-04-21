import styles from "../../styles/components/admin/Dashboard.module.css";
import React, { useState } from "react";

const Dashboard = () => {
  const [toggle, setToggle] = useState(false);

  const onToggle = (e) => {
    setToggle(!toggle);
  };

  return (
    <div className={styles.container}>
      <span className={styles.hamburger} onClick={onToggle}>
        &#9776;
      </span>

      <div className={styles.inner_container}>
        <div
          className={styles.admin}
          style={{
            left: toggle ? "0px" : "-230px",
            "z-index": toggle ? "3" : "1",
          }}
        >
          <div className={styles.admin_dash_name}>
            <h2 className={styles.dash_h2_1}>Admin</h2>
            <h2 className={styles.dash_h2_2}>Dashboard</h2>
          </div>

          <div className={styles.profile}>
            <div className={styles.profile_picture}>DK</div>
            <p className={styles.profile_name}>Dhananjay Kuber</p>
          </div>

          <div className={styles.search}>
            <div className={styles.search_group}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.search_box}
              />
              <span className={styles.icon}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>

          <div className={styles.main_nav_title}>
            <p className={styles.nav_title}>MAIN NAVIGATION</p>
          </div>

          <div className={styles.admin_links}>
            <div className={styles.link}>
              <i className="fa fa-comments"></i>
              <p className={styles.link_name}>Forum</p>
            </div>
            <div className={styles.link}>
              <i className="fab fa-blogger"></i>
              <p className={styles.link_name}>Blogs</p>
            </div>
            <div className={styles.link}>
              <i className="fa fa-comment-medical"></i>
              <p className={styles.link_name}>Notice</p>
            </div>
            <div className={styles.link}>
              <i className="fas fa-user-circle"></i>
              <p className={styles.link_name}>Profiles</p>
            </div>
          </div>
        </div>

        <div className={styles.dashboard}>
          {/* content here */}

          <div className={styles.path}>
            <i className={`fas fa-user-shield ${styles.admin_icon}`}></i>Admin/
            <span className={styles.path_link}>Notice</span>
          </div>

          <h2 className={styles.path_title}>NOTICE FORM</h2>

          <form action="" className={styles.notice_form}>
            <div className={styles.notice_input_grp}>
              <input
                type="text"
                placeholder="Type notice here..."
                className={styles.notice_input}
              />
              <i class="fas fa-user-edit"></i>
            </div>
            <button className={styles.notice_submit}>Add notice</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
