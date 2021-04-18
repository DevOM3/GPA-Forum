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

const ForgotPassword = () => {
  const router = useRouter();
  const [phno, setPhno] = useState("");
  const [otp, setOTP] = useState("");
  const [visible, setVisible] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const getOTP = async (e) => {
    e.preventDefault();

    if (phno.trim().length === 10) {
      setSendingOTP(true);
      const data = await db
        .collection("Users")
        .where("phno", "==", phno)
        .get();
      if (!data.empty) {
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
        .then((result) => {
          if (result.user) {
            setVerifyingOTP(false);
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
    <div className={forgotStyles.signup}>
      <form className={forgotStyles.form} onSubmit={verifyOTP}>
        <img src="/images/circle.svg" alt="" />
        <div className={forgotStyles.mainForm}>
          <div id="verifier"></div>
            <div className={forgotStyles.inputDiv}>
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
            </div>
          {sendingOTP ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <button
              className={forgotStyles.button}
              onClick={getOTP}
              type="button"
            >
              <PermPhoneMsgOutlined style={{ color: "grey" }} />
              <p className={forgotStyles.buttonText}>Get OTP</p>
            </button>
          )}
          {visible ? (
            <>
              <div className={forgotStyles.inputDiv}>
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
            </div>
            {verifyingOTP ? (
              <div className="progress-div">
                <CircularProgress size={33} style={{ color: "black" }} />
              </div>
            ) : (
              <button
                  className={forgotStyles.button}
                  onClick={verifyOTP}
                  type="submit"
                >
                  <DoneOutlined style={{ color: "grey" }} />
                  <p className={forgotStyles.buttonText}>Verify OTP</p>
                </button>
            )}
            </>
          ) : 
          (<>
          </>)}
            
        </div>
      </form>
    </div>
  );
};
export default ForgotPassword;
