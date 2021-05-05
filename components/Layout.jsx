import { BootstrapTooltip, speak } from "../services/utilities";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { db } from "../services/firebase";
import { CircularProgress, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion } from "framer-motion";
import { fabAnimationVariant } from "../services/utilities";
import { MicNoneRounded } from "@material-ui/icons";

const Layout = ({ children }) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [noUser, setNoUser] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(async () => {
    if (!user) {
      const userID = localStorage.getItem("forumUserID");

      if (userID) {
        await db
          .collection("Users")
          .doc(userID)
          .onSnapshot((doc) => {
            if (doc.exists) {
              dispatch({
                type: actionTypes.SET_USER,
                user: {
                  id: doc?.id,
                  name: doc.data()?.name,
                  branch: doc.data()?.branch,
                  phno: doc.data()?.phno,
                  password: doc.data()?.password,
                },
              });
            } else {
              localStorage.clear();
              router.replace("/auth/login");
            }
          });
        setNoUser(false);
      } else {
        if (
          router.pathname !== "/" &&
          router.pathname !== "/auth/login" &&
          router.pathname !== "/auth/signup" &&
          router.pathname !== "/auth/forgot-password" &&
          router.pathname !== "/admin"
        ) {
          router.replace("/auth/login");
        } else {
          setNoUser(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (
      user &&
      (router.pathname === "/auth/forgot-password" ||
        router.pathname === "/auth/signup" ||
        router.pathname === "/auth/login" ||
        router.pathname === "/")
    ) {
      setNoUser(false);
      router.replace("/queries");
    } else if (
      noUser &&
      router.pathname !== "/auth/forgot-password" &&
      router.pathname !== "/auth/signup" &&
      router.pathname !== "/auth/login" &&
      router.pathname !== "/admin" &&
      router.pathname !== "/"
    ) {
      router.replace("/auth/login");
      setNoUser(true);
    }
    if (user) {
      dispatch({
        type: actionTypes.SET_SEARCH_STRING,
        searchString: "",
      });
    }
  }, [user, router.pathname]);

  const commands = [
    {
      command: [
        "Navigate to the Queries page",
        "Navigate to the Query page",
        "Go to Queries page",
        "Go to Query page",
        "Head towards Queries page",
        "Head towards Query page",
        "Show Queries page",
        "Show Query page",
        "Visit Queries page",
        "Visit Query page",
        "Open * Queries page",
        "Open * Query page",
        "* Queries page *",
        "* Query page *",
        "Show queries",
      ],
      callback: () => {
        resetTranscript();
        speak("Navigating to Queries page", window);
        router.push("/queries");
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "Navigate to the Blogs page",
        "Go to Blogs page",
        "Head towards Blogs page",
        "Show Blogs page",
        "Visit Blogs page",
        "Open * Blogs page",
        "Open * Blocked page",
        "Open * Block page",
        "Navigate * Block page",
        "* Blogs page * ",
        "Show blogs",
      ],
      callback: () => {
        resetTranscript();
        speak("Navigating to Blogs page", window);
        router.push("/blogs");
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "Navigate to the Notices page",
        "Navigate to the Notice page",
        "Go to Notices page",
        "Go to Notice page",
        "Head towards Notices page",
        "Head towards Notice page",
        "Show Notices page",
        "Show Notice page",
        "Visit Notices page",
        "Visit Notice page",
        "Open * Notices page",
        "Open * Notice page",
        "* Notices *",
        " Notice *",
        "Show notices",
      ],
      callback: () => {
        resetTranscript();
        speak("Navigating to Notices page", window);
        router.push("/notices");
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "Navigate to the Profile page",
        "Go to Profile page",
        "Head towards Profile page",
        "Show Profile page",
        "Visit Profile page",
        "Open * Profile page",
        "* Profile *",
        "show my profile (please) *",
      ],
      callback: () => {
        resetTranscript();
        speak("Navigating to Profile page", window);
        router.push("/profile");
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "* my name *",
        "what is my name *",
        "tell me my name *",
        "who am i",
        "introduce me (please) *",
        "introduce myself (please) *",
      ],
      callback: () => {
        resetTranscript();
        speak(`Your name is, ${user?.name}!`, window);
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "* my branch *",
        "which is my branch *",
        "what is my branch *",
        "tell me my branch *",
        "* branch am i",
        "introduce my branch",
      ],
      callback: () => {
        resetTranscript();
        speak(`You are studying in ${user?.branch?.title}!`, window);
      },
      isFuzzyMatch: true,
    },
    {
      command: [
        "* previous page *",
        "* go back *",
        "navigate back",
        "navigate to previous page *",
      ],
      callback: () => {
        resetTranscript();
        router.back();
        speak("Navigating to the previous page", window);
      },
      isFuzzyMatch: true,
    },
    {
      command: ["log (me) out *", "log out", "lock out", "locked out"],
      callback: () => {
        resetTranscript();
        speak(
          `Logging you out, ${user?.name.split(" ")[0]}, please wait!`,
          window
        );
        localStorage.removeItem("forumUserID");
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
        router.replace("/auth/login").then(() => router.reload());
      },
      isFuzzyMatch: true,
    },
  ];

  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands,
  });

  useEffect(() => {
    if (!listening) {
      resetTranscript();
    }
  }, [listening]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (user &&
    router.pathname !== "/auth/forgot-password" &&
    router.pathname !== "/auth/signup" &&
    router.pathname !== "/auth/login" &&
    router.pathname !== "/") ||
    (noUser &&
      (router.pathname === "/auth/forgot-password" ||
        router.pathname === "/auth/signup" ||
        router.pathname === "/auth/login" ||
        router.pathname === "/admin" ||
        router.pathname === "/")) ? (
    <div
      id="main"
      style={{ overflow: "scroll", height: "100vh", position: "relative" }}
    >
      <Head>
        <title>
          GPAForum |{" "}
          {router.pathname === "/auth/forgot-password"
            ? "Forgot Password"
            : router.pathname === "/auth/signup"
            ? "Sign Up"
            : router.pathname === "/auth/login"
            ? "Login"
            : router.pathname === "/queries" ||
              router.pathname === "/queries/[queryID]"
            ? "Queries"
            : router.pathname === "/blogs" ||
              router.pathname === "/blogs/[blogID]"
            ? "Blogs"
            : router.pathname === "/profile" ||
              router.pathname === "/profile/[userID]"
            ? "Profile"
            : router.pathname === "/notices"
            ? "Notices"
            : router.pathname === "/admin"
            ? "Admin"
            : router.pathname === "/"
            ? "Home"
            : ""}
        </title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <BootstrapTooltip title="Sitebot - Voice Assistant">
        <motion.div
          className="voice-fab"
          variants={fabAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <IconButton
            onClick={() =>
              SpeechRecognition.startListening({
                // continuous: SpeechRecognition.browserSupportsSpeechRecognition(),
                language: "en-IN",
              })
            }
          >
            <MicNoneRounded style={{ color: "black" }} />
          </IconButton>
        </motion.div>
      </BootstrapTooltip>
      {router.pathname !== "/auth/forgot-password" &&
        router.pathname !== "/auth/signup" &&
        router.pathname !== "/auth/login" &&
        router.pathname !== "/" &&
        router.pathname !== "/admin" && <Navbar />}
      {children}
      {router.pathname !== "/admin" && <Footer />}
    </div>
  ) : (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Head>
        <title>GPA Forum</title>
      </Head>
      <CircularProgress style={{ color: "black" }} />
    </div>
  );
};

export default Layout;
