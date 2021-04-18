import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import loginStyles from "../../styles/pages/auth/Login.module.css";
import { db } from "../../services/firebase";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

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
    <div>
      <form id={loginStyles.loginForm} onSubmit={login}>
        <input
          required
          className={loginStyles.inputField}
          placeholder="Contact Number"
          type="text"
          maxLength={10}
          minLength={10}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <input
          required
          className={loginStyles.inputField}
          placeholder="Password"
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        />
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
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
