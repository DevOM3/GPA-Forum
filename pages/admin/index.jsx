import styles from "../../styles/components/admin/AdminDashboard.module.css";
import React, { useState } from "react";
import Login from "../../components/admin/AdminLogin";

// imports dashboard components
import Profile from "../../components/admin/Profile";
import Notice from "../../components/admin/Notice";
import Queries from "../../components/admin/Query";
import Blogs from "../../components/admin/Blogs";
import { useEffect } from "react";
import Head from "next/head";

const Dashboard = () => {
  const [toggle, setToggle] = useState(false);
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  // Open dashboard
  const [page, setPage] = useState("Notice");

  const onToggle = (e) => {
    setToggle(!toggle);
  };

  const ID = "16287689";
  const PASSWORD = "qwertyuiop1234567890";

  const login = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    if (id === ID && password === PASSWORD) {
      setLoggedIn(true);
    } else if (id !== ID || password !== PASSWORD) {
      alert("Your username or password does not match");
    }
  };

  useEffect(() => {
    window.innerWidth <= 1000 && setToggle(false);
  }, [page]);

  return loggedIn ? (
    <div className={styles.container}>
      <Head>
        <title>GPAForum | Admin Panel</title>
        {/* <meta
          property="og:title"
          content="GPAForum | Admin Panel"
          key="title"
        />
        <meta
          name="description"
          content="Administrative control for GPAForum."
        />
        <meta
          property="og:description"
          content="Administrative control for GPAForum."
        /> */}
      </Head>
      <span className={styles.hamburger} onClick={onToggle}>
        &#9776;
      </span>

      <div className={styles.inner_container}>
        <div
          className={styles.admin}
          style={{
            left: toggle ? "0px" : "-230px",
            zIndex: toggle ? "3" : "1",
          }}
        >
          <div className={styles.admin_dash_name}>
            <h2 className={styles.dash_h2_1}>Admin</h2>
            <h2 className={styles.dash_h2_2}>Dashboard</h2>
          </div>

          <div className={styles.profile}>
            <div className={styles.profile_picture}>A</div>
            <p className={styles.profile_name} style={{ marginRight: "10px" }}>
              GPA Admin
            </p>
            <p
              className={styles.dot}
              style={{
                background: "green",
                width: "9px",
                height: "9px",
                borderRadius: "16px",
              }}
            ></p>
          </div>

          <div className={styles.main_nav_title}>
            <p className={styles.nav_title}>MAIN NAVIGATION</p>
          </div>

          <div className={styles.admin_links}>
            <div
              className={styles.link}
              style={{ borderLeftColor: page === "Queries" && "#367fa9" }}
              onClick={() => setPage("Queries")}
            >
              <i className="fa fa-comments"></i>
              <p className={styles.link_name}>Queries</p>
            </div>
            <div
              className={styles.link}
              style={{ borderLeftColor: page === "Blogs" && "#367fa9" }}
              onClick={() => setPage("Blogs")}
            >
              <i className="fab fa-blogger"></i>
              <p className={styles.link_name}>Blogs</p>
            </div>
            <div
              className={styles.link}
              style={{ borderLeftColor: page === "Notice" && "#367fa9" }}
              onClick={() => setPage("Notice")}
            >
              <i className="fa fa-comment-medical"></i>
              <p className={styles.link_name}>Notice</p>
            </div>
            <div
              className={styles.link}
              style={{ borderLeftColor: page === "Profiles" && "#367fa9" }}
              onClick={() => setPage("Profiles")}
            >
              <i className="fas fa-user-circle"></i>
              <p className={styles.link_name}>Profiles</p>
            </div>
          </div>
        </div>

        <div className={styles.dashboard}>
          {page === "Queries" ? (
            <Queries />
          ) : page === "Blogs" ? (
            <Blogs />
          ) : page === "Notice" ? (
            <Notice />
          ) : page === "Profiles" ? (
            <Profile />
          ) : (
            <Profile />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Login
      id={id}
      setID={setID}
      password={password}
      setPassword={setPassword}
      login={login}
      setLoggingIn={setLoggingIn}
    />
  );
};

export default Dashboard;
