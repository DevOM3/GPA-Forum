import React, { useEffect } from "react";
import { useState } from "react";
import {
  IconButton,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  Box,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SignUp = () => {
  const classes = useStyles();
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
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  // useEffect(() => {
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("verifier", {
  //     size: "invisible",
  //   });
  //   recaptchaVerifier
  //     .render()
  //     .then((widgetId) => (window.recaptchaWidgetId = widgetId));
  // }, []);

  return (
    <motion.div
      className={signUpStyles.signUp}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <AppBar position="sticky" color="transparent">
          <DialogTitle id="responsive-dialog-title">{"Agreements"}</DialogTitle>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Terms and Conditions" {...a11yProps(0)} />
            <Tab label="Privacy policies" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <DialogContent>
          <TabPanel value={value} index={0}>
            <p>Last updated: 10 July 2020</p>
            <h4>AGREEMENT TO TERMS</h4>
            These Terms and Conditions constitute a legally binding agreement
            made between you, whether personally or on behalf of an entity and
            "GPAForum", concerning your access to and use of the GPAForum
            website as well as any other media form, media channel, mobile
            website or mobile application related, linked, or otherwise
            connected there to GPAForum.
            <br />
            <br />
            You agree that by accessing the Site, you have read, understood, and
            agree to be bound by all of these Terms and Conditions. If you do
            not agree with all of these Terms and Conditions, then you are
            expressly prohibited from creating your account and you must
            discontinue use immediately.
            <br />
            <br />
            Supplemental terms and conditions or documents that may be posted on
            the Site from time to time are hereby expressly incorporated here in
            by reference. We reserve the right, in our sole discretion, to make
            changes or modifications to these Terms and Conditions at any time
            and for any reason.
            <br />
            <br />
            We will alert you about any changes by updating the “Last updated”
            date of these Terms and Conditions, and you waive any right to
            receive specific notice of each such change.
            <br />
            <br />
            It is your responsibility to periodically review these Terms and
            Conditions to stay informed of updates though we try to not change
            them so frequently. You will be subject to, and will be deemed to
            have been made aware of and to have accepted, the changes in any
            revised Terms and Conditions by your continued use of the Site after
            the date such revised Terms and Conditions are posted. The
            information provided on the Site is not intended for distribution to
            or use by any person or entity in any jurisdiction or country where
            such distribution or use would be contrary to law or regulation or
            which would subject us to any registration requirement within such
            jurisdiction or country.
            <br />
            <br />
            Accordingly, those persons who choose to access the Site from other
            locations do so on their own initiative and are solely responsible
            for compliance with local laws, if and to the extent local laws are
            applicable.
            <br />
            <br />
            The Site is intended for users who are an indivisible part of
            Government Polytechnic Aurangabad (GPA). Persons who are/were not
            part of Government Polytechnic Aurangabad (GPA) are not permitted to
            register for the Site.
            <br />
            <br />
            <br />
            <h4>INTELLECTUAL PROPERTY RIGHTS</h4>
            This website is property of Government Polytechnic Aurangabad (GPA)
            and is associated with it in all forms. The GPAForum is not
            registered as an INTELLECTUAL PROPERTY but its associate is,
            GPAForum was donated to Government Polytechnic Aurangabad (GPA) by
            following Final Year Students in year 2021 as their Final Year
            Project to help the college during <em>COVID19 Pandemic</em>{" "}
            situation-
            <br />
            <ol>
              <li>
                <strong>Anuj Narayan Babhulgaonkar</strong>
              </li>
              <li>
                <strong>Dhananjay Narayan Kuber</strong>
              </li>
              <li>
                <strong>Om Prashant Londhe</strong>
              </li>
              <li>
                <strong>Ajay Kisan Rathod</strong>
              </li>
            </ol>
            <br />
            <br />
            <h4>USER REGISTRATION</h4>
            You may be required to register with the Site. You agree to keep
            your password confidential and will be responsible for all use of
            your account and password. We reserve the right to remove, reclaim,
            or change a username you select if we determine, in our sole
            discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
            <br />
            <br />
            <br />
            <h4>PROHIBITED ACTIVITIES</h4>
            You may not access or use the Site for any purpose other than that
            for which we make the Site available. The Site may not be used in
            connection with any commercial endeavors except those that are
            specifically endorsed or approved by us.
            <br />
            As a user of the Site, you agree not to:
            <ol>
              <li>Use bad words in any language.</li>
              <li>Use hate speech.</li>
              <li>
                Post any query containing bad words, slangs or hate speech.
              </li>
              <li>
                Leave a solution containing bad words, slangs or hate speech in
                any recognizable form.
              </li>
              <li>Use bad words, slangs or hate speech in your blog.</li>
              <li>Write a blog targeting a person or pornography.</li>
              <li>Post images which discloses sexual or private parts.</li>
              <li>
                Leave bad words, slangs or hate speech as a comment for a blog.
              </li>
            </ol>
            <br />
            <br />
            <br />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Government Polytechnic Aurangabad (GPA) operates the GPAForum
            website.
            <br />
            This page is used to inform website visitors regarding our policies
            with the collection, use, and disclosure of Personal Information if
            anyone decided to use the GPAForum website.
            <br />
            If you choose to use this website, then you agree to the collection
            and use of information in relation with this policy. The Personal
            Information that we collect are used for providing and improving the
            website as a whole. We will not use or share your information with
            anyone except as described in this Privacy Policy.
            <br />
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which is accessible at from the above
            tabs, unless otherwise defined in this Privacy Policy.
            <br />
            <br />
            <br />
            <h4>Information Collection and Use</h4>
            For a better experience while using this website, we may require you
            to provide us with certain personally identifiable information,
            including but not limited to your name and phone number. The
            information that we collect will be used to contact or identify you.
            <br />
            <br />
            <br />
            <h4>Log Data</h4>
            We want to inform you that whenever you visit us, we collect
            information that your browser sends to us that is called "Log Data".
            This Log Data may include information such as your computer's
            Internet Protocol (“IP”) address, browser version, pages of this
            website that you visit, the time and date of your visit, the time
            spent on those pages, and other statistics.
            <br />
            <br />
            <br />
            <h4>Cookies</h4>
            Cookies are files with small amount of data that is commonly used an
            anonymous unique identifier. These are sent to your browser from the
            website that you visit and are stored on your computer's hard drive.
            <br />
            Our website uses Firebase Authentication which uses these “cookies”
            to collect information and to improve this website's performance.
            You have no option to refuse these cookies, and know when a cookie
            is being sent to your computer.
            <br />
            <br />
            <br />
            <h4>Service Providers</h4>
            We may employ third-party companies and individuals due to the
            following reasons:
            <br />
            <ul>
              <li>To facilitate this website;</li>
              <li>To provide the Service on our behalf;</li>
              <li>To perform Service-related services; or</li>
              <li>To assist us in analyzing how this website is used.</li>
            </ul>
            <br />
            We want to inform this website users that these third parties have
            access to your Personal Information. The reason is to perform the
            tasks assigned to them on our behalf. However, they are obligated
            not to disclose or use the information for any other purpose.
            <br />
            <br />
            <br />
            <h4>Security</h4>
            We value your trust in providing us your Personal Information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and we
            cannot guarantee its absolute security.
            <br />
            <br />
            <br />
            <h4>Links to Other Sites</h4>
            GPAForum may contain links to other sites. If you click on a
            third-party link, you will be directed to that site. Note that these
            external sites are not operated by us. Therefore, we strongly advise
            you to review the Privacy Policy of these websites. We have no
            control over, and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
            <br />
            <br />
            <br />
            <h4>Non-GPA Users</h4>
            GPAForum do not address anyone who is/was not a part Government
            Polytechnic Aurangabad (GPA). We do not recommend Non-GPA users to
            join us. In the case we discover that Non-GPA has provided us with
            personal information, we immediately delete this from our servers.
            <br />
            <br />
            <br />
            <h4>Changes to This Privacy Policy</h4>
            We may update our Privacy Policy from time to time. Thus, we advise
            you to review this page periodically for any changes. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            These changes are effective immediately, after they are posted on
            this page.
            <br />
            <br />
            <br />
            <h4>Contact Us</h4>
            If you have any questions or suggestions about our Privacy Policy,
            do not hesitate to contact us.
            <br />
            <br />
            <br />
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Understood!
          </Button>
        </DialogActions>
      </Dialog>
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
          <label
            style={{
              fontSize: 11,
              textAlign: "center",
              marginTop: 7,
              margin: 11,
              marginBottom: 0,
            }}
            onClick={handleClickOpen}
          >
            By Signing up and creating your account, you are agreeing to our
            'Terms and Conditions of usage' and 'Privacy Policy Agreement'.
            <br />
            (Click here to know more)
          </label>
        </div>
      </form>
    </motion.div>
  );
};

export default SignUp;
