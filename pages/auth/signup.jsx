import React, { useEffect } from "react";
import { useState } from "react";
import { IconButton, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import signUpStyles from "../../styles/pages/auth/SignUp.module.css";
import {
  LockOutlined,
  PersonOutlineRounded,
  PhoneIphoneOutlined,
  SchoolOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  PermPhoneMsgOutlined,
  DoneOutlined,
  ChatBubbleOutlineOutlined,
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

const SignUp = () => {
  const [{ user }, dispatch] = useStateValue();
  const router = useRouter();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [phno, setPhno] = useState("");
  const [codeResult, setCodeResult] = useState(null);
  const [otp, setOTP] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const branchData = [
    {
      acronym: "CO",
      title: "Computer Engineering",
    },
    {
      acronym: "IT",
      title: "Information Technology",
    },
    {
      acronym: "CE",
      title: "Civil Engineering",
    },
    {
      acronym: "E&TC",
      title: "Electronics and Telecommunication",
    },
    {
      acronym: "ME",
      title: "Mechanical Engineering",
    },
    {
      acronym: "EE",
      title: "Electrical Engineering",
    },
    {
      acronym: "AE",
      title: "Automobile Engineering",
    },
    {
      acronym: "DDGM",
      title: "Dress Designing and Garments Management",
    },
  ];

  const getOTP = async () => {
    if (name.trim().length < 2) {
      alert("Your name must be at last 2 characters long.");
    } else if (!branch?.title) {
      alert("You must select your Branch first.");
    } else if (phno.trim().length !== 10) {
      alert("Enter a valid Phone number");
    } else {
      setSendingOTP(true);
      const data = await db.collection("Users").where("phno", "==", phno).get();
      if (data.empty) {
        const confirmationResult = await auth.signInWithPhoneNumber(
          `+91${phno}`,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;
        setCodeResult(confirmationResult);
        setShowOTPScreen(true);
      } else {
        alert("Phone number already registered!");
      }
      setSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    setVerifyingOTP(true);

    codeResult
      .confirm(otp)
      .then(async (result) => {
        if (result.user) {
          const data = await db.collection("Users").add({
            name,
            branch,
            phno,
            password,
            reports: 0,
          });
          dispatch({
            type: actionTypes.SET_USER,
            user: {
              id: data.id,
              name,
              branch,
              phno,
              password,
              reports: 0,
            },
          });
          localStorage.setItem("forumUserID", data.id);
          setVerifyingOTP(false);
          router.push("/queries");
        }
      })
      .catch((error) => {
        alert(error.message);
        setVerifyingOTP(false);
      });
  };

  useEffect(() => {
    // if (user) {
    //   router.replace("/query");
    // } else {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("verifier", {
      size: "invisible",
    });
    recaptchaVerifier
      .render()
      .then((widgetId) => (window.recaptchaWidgetId = widgetId));
    // }
  }, []);

  return (
    <motion.div
      className={signUpStyles.signUp}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <title>GPAForum | Sign Up</title>
        <meta
          name="description"
          content="Sign Up to GPAForum to be indivisible part of GPA Forever."
          key="desc"
        />
      </Head>
      <form className={signUpStyles.form} onSubmit={verifyOTP}>
        <div className={signUpStyles.mainForm}>
          <img
            className={signUpStyles.circleImage}
            src="/images/navlogo.svg"
            alt=""
          />
          {showOTPScreen ? (
            <motion.div
              className={signUpStyles.inputDiv}
              variants={inputAnimationVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
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
                className={signUpStyles.input}
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                className={signUpStyles.inputDiv}
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
              >
                <PersonOutlineRounded style={{ color: "grey" }} />
                <input
                  required
                  minLength={2}
                  maxLength={51}
                  type="text"
                  className={signUpStyles.input}
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
              <Autocomplete
                onChange={(e, v) => setBranch(v)}
                options={branchData}
                getOptionLabel={(option) =>
                  `${option.acronym} (${option.title})`
                }
                renderInput={(params) => (
                  <motion.div
                    className={signUpStyles.inputDiv}
                    ref={params.InputProps.ref}
                    variants={inputAnimationVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      delay: 0.9,
                      duration: 0.5,
                    }}
                  >
                    <SchoolOutlined style={{ color: "grey" }} />
                    <input
                      required
                      value={branch}
                      required
                      {...params.inputProps}
                      type="text"
                      className={signUpStyles.input}
                      placeholder="Select your branch"
                    />
                  </motion.div>
                )}
              />
              <motion.div
                className={signUpStyles.inputDiv}
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
              >
                <LockOutlined style={{ color: "grey" }} />
                <input
                  required
                  minLength={8}
                  maxLength={51}
                  type={passwordVisible ? "text" : "password"}
                  className={signUpStyles.input}
                  placeholder="Choose a Password"
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
              <motion.div
                className={signUpStyles.inputDiv}
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 1.1,
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
                  className={signUpStyles.input}
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
            </>
          )}
          <div id="verifier"></div>
          {showOTPScreen ? (
            verifyingOTP ? (
              <div className="progress-div">
                <CircularProgress size={33} style={{ color: "black" }} />
              </div>
            ) : (
              <motion.button
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                }}
                className={signUpStyles.button}
                onClick={verifyOTP}
                type="submit"
              >
                <DoneOutlined style={{ color: "grey" }} />
                <p className={signUpStyles.buttonText}>Verify OTP</p>
              </motion.button>
            )
          ) : sendingOTP ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <>
              <motion.button
                variants={inputAnimationVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  delay: 1.3,
                  duration: 0.5,
                }}
                className={signUpStyles.button}
                onClick={getOTP}
                type="button"
              >
                <PermPhoneMsgOutlined style={{ color: "grey" }} />
                <p className={signUpStyles.buttonText}>Get OTP</p>
              </motion.button>
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
              >
                Already have an account?{" "}
                <Link href="/auth/login">
                  <a className="alternate-link">Login</a>
                </Link>
              </motion.p>
            </>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default SignUp;
