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
  VicsibilityOffOutlined,
  VisibilityOutlined,
  PermPhoneMsgOutlined,
  DoneOutlined,
  ChatBubbleOutlineOutlined,
} from "@material-ui/icons";
import { auth, db, firebase } from "../../services/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

const SignUp = () => {
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
          });
          localStorage.setItem("forumUserID", data.id);
          setVerifyingOTP(false);
          router.push("/");
        }
      })
      .catch((error) => {
        alert(error.message);
        setVerifyingOTP(false);
      });
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
    <div className={signUpStyles.signUp}>
      <form className={signUpStyles.form} onSubmit={verifyOTP}>
        <img id="img" src="/images/circle.svg" alt="" />
        <div className={signUpStyles.mainForm}>
          {showOTPScreen ? (
            <div className={signUpStyles.inputDiv}>
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
            </div>
          ) : (
            <>
              <div className={signUpStyles.inputDiv}>
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
              </div>
              <Autocomplete
                onChange={(e, v) => setBranch(v)}
                options={branchData}
                getOptionLabel={(option) =>
                  `${option.acronym} (${option.title})`
                }
                renderInput={(params) => (
                  <div
                    className={signUpStyles.inputDiv}
                    ref={params.InputProps.ref}
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
                  </div>
                )}
              />
              <div className={signUpStyles.inputDiv}>
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
              </div>
              <div className={signUpStyles.inputDiv}>
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
              </div>
            </>
          )}
          <div id="verifier"></div>
          {showOTPScreen ? (
            verifyingOTP ? (
              <div className="progress-div">
                <CircularProgress size={33} style={{ color: "black" }} />
              </div>
            ) : (
              <button
                className={signUpStyles.button}
                onClick={verifyOTP}
                type="submit"
              >
                <DoneOutlined style={{ color: "grey" }} />
                <p className={signUpStyles.buttonText}>Verify OTP</p>
              </button>
            )
          ) : sendingOTP ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <button
              className={signUpStyles.button}
              onClick={getOTP}
              type="button"
            >
              <PermPhoneMsgOutlined style={{ color: "grey" }} />
              <p className={signUpStyles.buttonText}>Get OTP</p>
            </button>
          )}
          <p className="alternate-text">
            Already have an account?{" "}
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
