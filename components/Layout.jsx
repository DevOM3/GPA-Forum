import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { db } from "../services/firebase";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";

const Layout = ({ children }) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [noUser, setNoUser] = useState(false);

  useEffect(async () => {
    if (!user) {
      const userID = localStorage.getItem("forumUserID");

      if (userID) {
        await db
          .collection("Users")
          .doc(userID)
          .onSnapshot((doc) => {
            if (doc.exists) {
              dispatch({
                type: actionTypes.SET_USER,
                user: {
                  id: doc?.id,
                  name: doc.data()?.name,
                  branch: doc.data()?.branch,
                  phno: doc.data()?.phno,
                  password: doc.data()?.password,
                },
              });
            } else {
              localStorage.clear();
              router.replace("/auth/login");
            }
          });
        setNoUser(false);
      } else {
        if (
          router.pathname !== "/" &&
          router.pathname !== "/auth/login" &&
          router.pathname !== "/auth/signup" &&
          router.pathname !== "/auth/forgot-password"
        ) {
          router.replace("/auth/login");
        } else {
          setNoUser(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (
      user &&
      (router.pathname === "/auth/forgot-password" ||
        router.pathname === "/auth/signup" ||
        router.pathname === "/auth/login" ||
        router.pathname === "/")
    ) {
      setNoUser(false);
      router.replace("/queries");
    }
  }, [user, router.pathname]);

  return user ||
    (noUser &&
      (router.pathname === "/auth/forgot-password" ||
        router.pathname === "/auth/signup" ||
        router.pathname === "/auth/login" ||
        router.pathname === "/")) ? (
    <div>
      <Head>
        <title>
          GPAForum |{" "}
          {router.pathname === "/auth/forgot-password"
            ? "Forgot Password"
            : router.pathname === "/auth/signup"
            ? "Sign Up"
            : router.pathname === "/auth/login"
            ? "Login"
            : router.pathname === "/queries" ||
              router.pathname === "/queries/[queryID]"
            ? "Queries"
            : router.pathname === "/blogs" ||
              router.pathname === "/blogs/[blogID]"
            ? "Blogs"
            : router.pathname === "/profile" ||
              router.pathname === "/profile/[userID]"
            ? "Profile"
            : router.pathname === "/notices"
            ? "Notices"
            : router.pathname === "/admin"
            ? "Admin"
            : router.pathname === "/"
            ? "Home"
            : ""}
        </title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      {router.pathname !== "/auth/forgot-password" &&
        router.pathname !== "/auth/signup" &&
        router.pathname !== "/auth/login" &&
        router.pathname !== "/" && <Navbar />}
      {children}
      <Footer />
    </div>
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
      <Head>
        <title>GPA Forum</title>
      </Head>
      <CircularProgress style={{ color: "black" }} />
    </div>
  );
};

export default Layout;

// import Fab from "@material-ui/core/Fab";
// import EditIcon from "@material-ui/icons/Edit";

{
  /* <Fab
      style={{
        position: "sticky",
        top: "calc(100vh - 100px)",
        left: "calc(100vw - 100px)",
        width: 71,
        height: 71,
        zIndex: 4,
      }}
      color="secondary"
      aria-label="edit"
    >
      <EditIcon fontSize="large" />
    </Fab> */
}
