import React, { useEffect, useState } from "react";
import forgotStyles from "../../styles/pages/auth/ForgotPassword.module.css";
import { auth, db, firebase } from "../../services/firebase";
import { useRouter } from "next/router";
import { CircularProgress } from "@material-ui/core";
import {
  PhoneIphoneOutlined,
  PermPhoneMsgOutlined,
  DoneOutlined,
  ChatBubbleOutlineOutlined,
} from "@material-ui/icons";
import { motion } from "framer-motion";
import {
  inputAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";
import Head from "next/head";

const ForgotPassword = () => {
  const [{ user }, dispatch] = useStateValue();
  const router = useRouter();
  const [phno, setPhno] = useState("");
  const [otp, setOTP] = useState("");
  const [visible, setVisible] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [userData, setUserData] = useState("");

  const getOTP = async (e) => {
    e.preventDefault();

    if (phno.trim().length === 10) {
      setSendingOTP(true);
      const data = await db.collection("Users").where("phno", "==", phno).get();
      if (!data.empty) {
        setUserData({
          id: data.docs[0].id,
          name: data.docs[0].data().name,
          branch: data.docs[0].data().branch,
          phno: data.docs[0].data().phno,
          password: data.docs[0].data().password,
        });
        const confirmationResult = await auth.signInWithPhoneNumber(
          `+91${phno}`,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;
        setVisible(true);
        setCodeResult(confirmationResult);
      } else {
        alert("Phone number is not registered!");
      }
      setSendingOTP(false);
    } else {
      alert("Enter a valid Phone Number.");
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();

    if (otp.trim().length === 6) {
      setVerifyingOTP(true);

      codeResult
        .confirm(otp)
        .then(async (result) => {
          if (result.user) {
            setVerifyingOTP(false);
            dispatch({
              type: actionTypes.SET_USER,
              user: userData,
            });
            localStorage.setItem("forumUserID", userData?.id);
            router.push("/profile");
          }
        })
        .catch((error) => {
          alert(error.message);
          setVerifyingOTP(false);
        });
    } else {
      alert("Enter a valid OTP");
    }
  };

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("verifier", {
      size: "invisible",
    });
    recaptchaVerifier
      .render()
      .then((widgetId) => (window.recaptchaWidgetId = widgetId));
  }, []);

  return (
    <motion.div
      className={forgotStyles.signup}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <title>GPAForum | Forgot Password</title>
        <meta property="og:title" content="GPAForum | Forgot Password" />
        <meta name="description" content="Reset your password." />
        <meta property="og:description" content="Reset your password." />
      </Head>
      <form className={forgotStyles.form} onSubmit={verifyOTP}>
        <img src="/images/circle.svg" alt="" />
        <div className={forgotStyles.mainForm}>
          {visible ? (
            <>
              <motion.div
                className={forgotStyles.inputDiv}
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
              >
                <ChatBubbleOutlineOutlined style={{ color: "grey" }} />
                <input
                  required
                  minLength={6}
                  maxLength={6}
                  type="text"
                  pattern="[0-9]*"
                  className={forgotStyles.input}
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </motion.div>
              {verifyingOTP ? (
                <div className="progress-div">
                  <CircularProgress size={33} style={{ color: "black" }} />
                </div>
              ) : (
                <motion.button
                  className={forgotStyles.button}
                  onClick={verifyOTP}
                  type="submit"
                  variants={inputAnimationVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                  }}
                >
                  <DoneOutlined style={{ color: "grey" }} />
                  <p className={forgotStyles.buttonText}>Verify OTP</p>
                </motion.button>
              )}
            </>
          ) : (
            <>
              <div id="verifier"></div>
              <motion.div
                className={forgotStyles.inputDiv}
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
              >
                <PhoneIphoneOutlined style={{ color: "grey" }} />
                <input
                  required
                  minLength={10}
                  maxLength={10}
                  type="text"
                  pattern="[0-9]*"
                  className={forgotStyles.input}
                  placeholder="Enter your Phone Number"
                  value={phno}
                  onChange={(e) =>
                    setPhno(
                      e.target.value
                        .toString()
                        .replace("+", "")
                        .replace("e", "")
                        .replace("-", "")
                        .replace("/", "")
                        .replace("*", "")
                        .replace(".", "")
                    )
                  }
                />
              </motion.div>
              {sendingOTP ? (
                <div className="progress-div">
                  <CircularProgress size={33} style={{ color: "black" }} />
                </div>
              ) : (
                <motion.button
                  className={forgotStyles.button}
                  onClick={getOTP}
                  type="button"
                  variants={inputAnimationVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    delay: 0.9,
                    duration: 0.5,
                  }}
                >
                  <PermPhoneMsgOutlined style={{ color: "grey" }} />
                  <p className={forgotStyles.buttonText}>Get OTP</p>
                </motion.button>
              )}
            </>
          )}
        </div>
      </form>
    </motion.div>
  );
};
export default ForgotPassword;
