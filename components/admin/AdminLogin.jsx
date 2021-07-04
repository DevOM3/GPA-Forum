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
import { motion } from "framer-motion";
import {
  inputAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";

const Login = ({ id, setID, password, setPassword, login, loggingIn }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <motion.div
      className={loginStyles.login}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <form className={loginStyles.form} onSubmit={login}>
        {/* <img src="/images/circle.svg" alt="" /> */}
        <h1>GPA Admin Login</h1>
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
              placeholder="Your ID"
              type="text"
              value={id}
              onChange={(e) => setID(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>
      </form>
    </motion.div>
  );
};
export default Login;
