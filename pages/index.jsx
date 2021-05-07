import { PersonOutlineOutlined } from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/pages/Home.module.css";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import {
  counterBottomAnimationVariant,
  counterDivAnimationVariant,
  counterTopAnimationVariant,
  homeButtonAnimationVariant,
  homeTopAnimationVariant,
  pageAnimationVariant,
} from "../services/utilities";
import { useRouter } from "next/router";
import Head from "next/head";

const Home = () => {
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    db.collection("Users").onSnapshot((data) => {
      let counter = 0;
      const updateTimer = () => {
        setTimeout(() => {
          setUserCount(counter);
          counter++;
          if (counter <= data.docs.length) {
            updateTimer();
          }
        }, 100);
      };
      updateTimer();
    });
    db.collection("Queries").onSnapshot((data) => {
      let counter = 0;
      const updateTimer = () => {
        setTimeout(() => {
          setForumCount(counter);
          counter++;
          if (counter <= data.docs.length) {
            updateTimer();
          }
        }, 100);
      };
      updateTimer();
    });
    db.collection("Blogs").onSnapshot((data) => {
      let counter = 0;
      const updateTimer = () => {
        setTimeout(() => {
          setBlogCount(counter);
          counter++;
          if (counter <= data.docs.length) {
            updateTimer();
          }
        }, 100);
      };
      updateTimer();
    });

    // const logo = document.querySelectorAll("#svg path");
    // for (let i = 0; i < logo.length; i++) {
    //   console.log(`Letter: ${i} is  ${logo[i].getTotalLength()}`);
    // }
  }, []);

  return (
    <motion.div
      className={styles.home}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <meta property="og:title" content="GPAForum | Home" key="title" />
        <meta
          name="description"
          content="Sign Up to be the indivisible part of GPA forever."
          key="desc"
        />
        <meta
          property="og:description"
          content="Sign Up to be the indivisible part of GPA forever."
          key="og-desc"
        />
      </Head>
      <div className={styles.image_and_title} style={{ background: "#1a2226" }}>
        <svg
          id="svg"
          width="268"
          height="41"
          viewBox="0 0 268 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.855 12.755C29.869 10.681 28.441 9.08298 26.571 7.96098C24.701 6.80498 22.525 6.22698 20.043 6.22698C17.561 6.22698 15.317 6.80498 13.311 7.96098C11.339 9.08298 9.775 10.715 8.619 12.857C7.497 14.965 6.936 17.413 6.936 20.201C6.936 22.989 7.497 25.437 8.619 27.545C9.775 29.653 11.339 31.285 13.311 32.441C15.317 33.563 17.561 34.124 20.043 34.124C23.511 34.124 26.367 33.087 28.611 31.013C30.855 28.939 32.164 26.134 32.538 22.598H18.36V18.824H37.485V22.394C37.213 25.318 36.295 28.004 34.731 30.452C33.167 32.866 31.11 34.787 28.56 36.215C26.01 37.609 23.171 38.306 20.043 38.306C16.745 38.306 13.736 37.541 11.016 36.011C8.296 34.447 6.137 32.288 4.539 29.534C2.975 26.78 2.193 23.669 2.193 20.201C2.193 16.733 2.975 13.622 4.539 10.868C6.137 8.07998 8.296 5.92098 11.016 4.39098C13.736 2.82698 16.745 2.04498 20.043 2.04498C23.817 2.04498 27.149 2.97998 30.039 4.84998C32.963 6.71998 35.088 9.35498 36.414 12.755H30.855Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M67.8973 12.857C67.8973 15.815 66.8773 18.28 64.8373 20.252C62.8313 22.19 59.7543 23.159 55.6063 23.159H48.7723V38H44.1313V2.45298H55.6063C59.6183 2.45298 62.6613 3.42198 64.7353 5.35998C66.8433 7.29798 67.8973 9.79698 67.8973 12.857ZM55.6063 19.334C58.1903 19.334 60.0943 18.773 61.3183 17.651C62.5423 16.529 63.1543 14.931 63.1543 12.857C63.1543 8.47098 60.6383 6.27798 55.6063 6.27798H48.7723V19.334H55.6063Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M95.1875 30.095H79.6835L76.8275 38H71.9315L84.7835 2.65698H90.1385L102.94 38H98.0435L95.1875 30.095ZM93.8615 26.321L87.4355 8.36898L81.0095 26.321H93.8615Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M129.145 2.45298V6.22698H113.692V18.212H126.238V21.986H113.692V38H109.051V2.45298H129.145Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M147.449 38.459C144.831 38.459 142.451 37.864 140.309 36.674C138.201 35.484 136.535 33.801 135.311 31.625C134.121 29.415 133.526 26.865 133.526 23.975C133.526 21.119 134.138 18.603 135.362 16.427C136.62 14.217 138.32 12.534 140.462 11.378C142.604 10.188 145.001 9.59298 147.653 9.59298C150.305 9.59298 152.702 10.188 154.844 11.378C156.986 12.534 158.669 14.2 159.893 16.376C161.151 18.552 161.78 21.085 161.78 23.975C161.78 26.865 161.134 29.415 159.842 31.625C158.584 33.801 156.867 35.484 154.691 36.674C152.515 37.864 150.101 38.459 147.449 38.459ZM147.449 34.379C149.115 34.379 150.679 33.988 152.141 33.206C153.603 32.424 154.776 31.251 155.66 29.687C156.578 28.123 157.037 26.219 157.037 23.975C157.037 21.731 156.595 19.827 155.711 18.263C154.827 16.699 153.671 15.543 152.243 14.795C150.815 14.013 149.268 13.622 147.602 13.622C145.902 13.622 144.338 14.013 142.91 14.795C141.516 15.543 140.394 16.699 139.544 18.263C138.694 19.827 138.269 21.731 138.269 23.975C138.269 26.253 138.677 28.174 139.493 29.738C140.343 31.302 141.465 32.475 142.859 33.257C144.253 34.005 145.783 34.379 147.449 34.379Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M173.033 14.591C173.849 12.993 175.005 11.752 176.501 10.868C178.031 9.98398 179.884 9.54198 182.06 9.54198V14.336H180.836C175.634 14.336 173.033 17.158 173.033 22.802V38H168.392V10.052H173.033V14.591Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M212.713 10.052V38H208.072V33.869C207.188 35.297 205.947 36.419 204.349 37.235C202.785 38.017 201.051 38.408 199.147 38.408C196.971 38.408 195.016 37.966 193.282 37.082C191.548 36.164 190.171 34.804 189.151 33.002C188.165 31.2 187.672 29.007 187.672 26.423V10.052H192.262V25.811C192.262 28.565 192.959 30.69 194.353 32.186C195.747 33.648 197.651 34.379 200.065 34.379C202.547 34.379 204.502 33.614 205.93 32.084C207.358 30.554 208.072 28.327 208.072 25.403V10.052H212.713Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M254.669 9.54198C256.845 9.54198 258.783 10.001 260.483 10.919C262.183 11.803 263.526 13.146 264.512 14.948C265.498 16.75 265.991 18.943 265.991 21.527V38H261.401V22.19C261.401 19.402 260.704 17.277 259.31 15.815C257.95 14.319 256.097 13.571 253.751 13.571C251.337 13.571 249.416 14.353 247.988 15.917C246.56 17.447 245.846 19.674 245.846 22.598V38H241.256V22.19C241.256 19.402 240.559 17.277 239.165 15.815C237.805 14.319 235.952 13.571 233.606 13.571C231.192 13.571 229.271 14.353 227.843 15.917C226.415 17.447 225.701 19.674 225.701 22.598V38H221.06V10.052H225.701V14.081C226.619 12.619 227.843 11.497 229.373 10.715C230.937 9.93298 232.654 9.54198 234.524 9.54198C236.87 9.54198 238.944 10.069 240.746 11.123C242.548 12.177 243.891 13.724 244.775 15.764C245.557 13.792 246.849 12.262 248.651 11.174C250.453 10.086 252.459 9.54198 254.669 9.54198Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <motion.h2
          className={styles.title}
          variants={homeTopAnimationVariant}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.4,
            duration: 1,
            ease: "easeIn",
          }}
        >
          Welcome to GPA Forum
        </motion.h2>
      </div>
      <motion.p
        className={styles.top_text}
        variants={homeTopAnimationVariant}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 0.6,
          duration: 1.5,
          ease: "easeIn",
        }}
      >
        This website is about Forums and Blog posts and is proprietary of GPA
        (Government Polytechnic, Aurangabad). If you are one of the indivisible
        part of the college and want to be a part for lifetime, click the button
        below and get Registered on "<strong>GPA Forum</strong>". <br />
        Here you can ask for what you are curious about and donate the knowledge
        you have to help others.
      </motion.p>
      <motion.button
        className={styles.button}
        variants={homeButtonAnimationVariant}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 1,
        }}
        onClick={() => router.push("/auth/signup")}
      >
        <PersonOutlineOutlined fontSize="small" /> &nbsp;Create Account{" "}
      </motion.button>
      <motion.div
        className={styles.stats}
        variants={counterDivAnimationVariant}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.statItem}>
          <motion.p
            className={styles.count}
            variants={counterTopAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            {userCount}
          </motion.p>
          <motion.p
            className={styles.text}
            variants={counterBottomAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            Users
          </motion.p>
        </div>
        <div
          className={styles.statItem}
          style={{
            borderLeft: "1px solid lightgrey",
            borderRight: "1px solid lightgrey",
          }}
        >
          <motion.p
            className={styles.count}
            variants={counterTopAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            {forumCount}
          </motion.p>
          <motion.p
            className={styles.text}
            variants={counterBottomAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            Queries
          </motion.p>
        </div>
        <div className={styles.statItem}>
          <motion.p
            className={styles.count}
            variants={counterTopAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            {blogCount}
          </motion.p>
          <motion.p
            className={styles.text}
            variants={counterBottomAnimationVariant}
            initial="hidden"
            animate="visible"
          >
            Blogs
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
