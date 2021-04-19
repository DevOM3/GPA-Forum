import { PersonOutlineOutlined } from "@material-ui/icons";
import Head from "next/head";
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
    db.collection("Forums").onSnapshot((data) => {
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
        <title>GPA Forum</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <div className={styles.image_and_title}>
        <motion.img
          src="/images/logo.png"
          alt=""
          variants={homeTopAnimationVariant}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: "easeIn",
          }}
        />
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
        part of teh college and want to be a part for lifetime, click the button
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
            User Count
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
            Forum Count
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
            Blog Count
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
