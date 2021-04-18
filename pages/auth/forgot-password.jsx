import { Button, makeStyles, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import forgotStyles from "../../styles/pages/auth/ForgotPassword.module.css";
import { auth, db, firebase } from "../../services/firebase";
import { useRouter } from "next/router";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    flex: "0.5",
    width: "100%",
    marginTop: theme.spacing(1),
    flexDirection: "column",
    paddingRight: "5vh",
  },
  submit: {
    width: "20vh",
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgotPassword = () => {
  const router = useRouter();
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [codeResult, setCodeResult] = useState(null);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();

    if (phone.trim().length === 10) {
      setSendingOTP(true);
      const data = await db
        .collection("Users")
        .where("phno", "==", phone)
        .get();
      if (!data.empty) {
        const confirmationResult = await auth.signInWithPhoneNumber(
          `+91${phone}`,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;
        setCodeResult(confirmationResult);
        setDisabled(false);
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

        <form className={classes.form} method="post" noValidate>
          <div id="verifier"></div>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone-no"
            label="Phone Number"
            name="number"
            autoComplete="phone"
            autoFocus
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {sendingOTP ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              onClick={sendOTP}
              className={classes.submit}
            >
              Send OTP
            </Button>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="OTP"
            name="number"
            autoComplete="otp"
            disabled={disabled}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          {verifyingOTP ? (
            <div className="progress-div">
              <CircularProgress size={33} style={{ color: "black" }} />
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              disabled={disabled}
              variant="outlined"
              className={classes.submit}
              onClick={verifyOTP}
            >
              Verify
            </Button>
          )}
        </form>
      </form>
    </div>
  );
};
export default ForgotPassword;
