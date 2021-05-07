import React from "react";
import { useState } from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import loginStyles from "../../styles/pages/auth/Login.module.css";
import {
  LockOutlined,
  PhoneIphoneOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";
import { auth, db, firebase } from "../../services/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  inputAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import Head from "next/head";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const router = useRouter();
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (contactNumber.trim().length === 10) {
      setLoggingIn(true);
      const data = await db
        .collection("Users")
        .where("phno", "==", contactNumber)
        .get();
      if (!data.empty) {
        if (data.docs[0].data().password === password) {
          dispatch({
            type: actionTypes.SET_USER,
            user: {
              id: data.docs[0].id,
              name: data.docs[0].data().name,
              branch: data.docs[0].data().branch,
              phno: data.docs[0].data().phno,
              password: data.docs[0].data().password,
            },
          });
          localStorage.setItem("forumUserID", data.docs[0].id);
          router.push("/queries");
        } else {
          alert("Incorrect Password");
        }
      } else {
        alert("You are not authenticated user");
      }
      setLoggingIn(false);
    } else {
      alert("Enter a valid Mobile Number");
    }
  };

  return (
    <motion.div
      className={loginStyles.login}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <title>GPAForum | Login</title>
        <meta property="og:title" content="GPAForum | Login" key="title" />
        <meta
          name="description"
          content="Login to GPAForum from your account."
          key="desc"
        />
        <meta
          property="og:description"
          content="Login to GPAForum from your account."
          key="og-desc"
        />
      </Head>
      <form className={loginStyles.form} onSubmit={login}>
        <img src="/images/circle.svg" alt="" />
        <div className={loginStyles.mainForm}>
          <motion.div
            className={loginStyles.inputDiv}
            variants={inputAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              delay: 0.7,
              duration: 0.5,
            }}
          >
            <PhoneIphoneOutlined style={{ color: "grey" }} />
            <input
              required
              className={loginStyles.input}
              placeholder="Contact Number"
              type="text"
              pattern="[0-9]*"
              maxLength={10}
              minLength={10}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </motion.div>
          <motion.div
            className={loginStyles.inputDiv}
            variants={inputAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              delay: 0.9,
              duration: 0.5,
            }}
          >
            <LockOutlined style={{ color: "grey" }} />
            <input
              required
              minLength={8}
              maxLength={51}
              type={passwordVisible ? "text" : "password"}
              className={loginStyles.input}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <IconButton
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              {passwordVisible ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </motion.div>
          {loggingIn ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <motion.button
              type="submit"
              className={loginStyles.button}
              variants={inputAnimationVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                delay: 1.1,
                duration: 0.5,
              }}
            >
              Login
            </motion.button>
          )}
          <motion.p
            className="alternate-text"
            variants={inputAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              delay: 1.5,
              duration: 0.5,
            }}
            style={{ marginBottom: 0 }}
          >
            Don't have an account?
            <Link href="/auth/signup">
              <a className="alternate-link"> Create one! Sign Up</a>
            </Link>
          </motion.p>
          <motion.p
            className="alternate-text"
            variants={inputAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              delay: 1.7,
              duration: 0.5,
            }}
            style={{ marginTop: 7 }}
          >
            Forgot Password?
            <Link href="/auth/forgot-password">
              <a className="alternate-link"> Recover it!</a>
            </Link>
          </motion.p>
        </div>
      </form>
    </motion.div>
  );
};
export default Login;
