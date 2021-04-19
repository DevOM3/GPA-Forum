import React, { useEffect } from "react";
import { useState } from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import loginStyles from "../../styles/pages/auth/SignUp.module.css";
import {
  PhoneIphoneOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";
import { auth, db, firebase } from "../../services/firebase";
import { useRouter } from "next/router";
import Link from "next/link";



const Login = () => {
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
          localStorage.setItem("forumUserID", data.docs[0].id);
          router.push("/");
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
    <div className={loginStyles.login}>
      <form className={loginStyles.form}>
        <img src="/images/circle.svg" alt="" />
        <div className={loginStyles.mainForm}>
      <div className={loginStyles.inputDiv}>
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
        </div>
        <div className={loginStyles.inputDiv}>
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
                </div>
        {loggingIn ? (
          <div className="progress-div">
            <CircularProgress size={33} style={{ color: "black" }} />
          </div>
        ) : (
          <button
            className={loginStyles.submitButton}
            type="submit"
            className={loginStyles.button}
          >
            Login
          </button>
        )}
        <p  className="alternate-text">
            Don't have an account? Create one!{" "}
            <Link href="/auth/signup">
              <a>Signup</a>
              </Link>
              </p> 
        </div>
      </form>
    </div>
  );
};
export default Login;
