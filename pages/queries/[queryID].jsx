import React, { useState } from "react";
import queryStyles from "../../styles/pages/queries/QueryPage.module.css";
import ShareIcon from "@material-ui/icons/Share";
import { Divider, IconButton, CircularProgress } from "@material-ui/core";
import Link from "next/link";
import {
  DeleteOutlined,
  ModeCommentOutlined,
  ReportOutlined,
  SendRounded,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";
import { db, firebase } from "../../services/firebase";
import { motion } from "framer-motion";
import {
  fadeAnimationVariant,
  pageAnimationVariant,
} from "../../services/utilities";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactLinkify from "react-linkify";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Badge, withStyles } from "@material-ui/core";
import { report, REPORT_THRESHOLD, suspendUser } from "../../services/report";
import Solution from "../../components/queries/Solution";
import { BootstrapTooltip } from "../../services/utilities";
import Head from "next/head";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const Query = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [solution, setSolution] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [uploadingSolutions, setUploadingSolution] = useState(false);
  const [queryData, setQueryData] = useState({});
  const [userData, setUserData] = useState({});
  const [openQueryCopy, setOpenQueryCopy] = useState(false);
  const [sortByUpVotes, setSortByUpVotes] = useState(true);

  const handleClickQueryCopy = () => {
    setOpenQueryCopy(true);
  };

  const handleCloseQueryCopy = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenQueryCopy(false);
  };

  const addSolution = (e) => {
    e.preventDefault();

    if (solution.trim().length < 4) {
      alert("Your solution must be at least 3 letters long.");
    } else {
      if (!report(solution)) {
        setUploadingSolution(true);
        db.collection("Queries")
          .doc(router.query.queryID)
          .collection("Solutions")
          .add({
            solution,
            by: user?.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            upVotes: [],
          })
          .then(() => {
            setUploadingSolution(false);
            setSolution("");
          });
      } else {
        alert(
          "You cannot use slangs in Solution. \nKeep the platform clean 🙏."
        );
      }
    }
  };

  const likePost = () => {
    db.collection("Queries")
      .doc(router.query.queryID)
      .update({
        upVotes: queryData?.upVotes?.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };

  const sharePost = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    handleClickQueryCopy();
  };

  const loadSolutions = () => {
    db.collection("Queries")
      .doc(router.query.queryID)
      .collection("Solutions")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (snapshot) =>
          !snapshot.empty &&
          setSolutions(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              solution: doc.data().solution,
              by: doc.data().by,
              timestamp: doc.data().timestamp,
              upVotes: doc.data().upVotes,
            }))
          )
      );
  };

  const deletePost = async (queryRef) => {
    router.back();
    const querySolutions = (await queryRef.collection("Solutions").get()).docs;

    for (let index = 0; index < querySolutions.length; index++) {
      await db
        .collection("Queries")
        .doc(router.query.queryID)
        .collection("Solutions")
        .doc(querySolutions[index].id)
        .delete();
    }

    await queryRef.delete();
  };

  const reportPost = async () => {
    if (report(queryData?.query)) {
      alert(
        "We found slangs in this query, we are deleting this query right now.\nThank you for contributing to make this platform clean . "
      );
      const queryRef = await db.collection("Queries").doc(router.query.queryID);
      if (
        (
          await db
            .collection("Users")
            .doc((await queryRef.get()).data()?.by)
            .get()
        ).data().reports >= REPORT_THRESHOLD
      ) {
        router.back();
        await deletePost(queryRef);
        await suspendUser((await queryRef.get()).data()?.by);
      } else {
        await deletePost(queryRef);
        await db
          .collection("Users")
          .doc((await queryRef.get()).data()?.by)
          .update({
            reports: firebase.firestore.FieldValue.increment(1),
          });
      }
    } else {
      alert("This query is all right!");
    }
  };

  useEffect(() => {
    db.collection("Queries")
      .doc(router.query.queryID)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setQueryData({
            queryType: snapshot.data().queryType,
            query: snapshot.data().query,
            by: snapshot.data().by,
            timestamp: snapshot.data().timestamp,
            upVotes: snapshot.data().upVotes,
          });
          db.collection("Users")
            .doc(snapshot.data().by)
            .get()
            .then((data) =>
              setUserData({
                id: data?.id,
                name: data.data()?.name,
              })
            );
        }
      });
    loadSolutions();
  }, []);

  return (
    <motion.div
      className={queryStyles.queryPage}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <title>{`GPAForum | Query - ${queryData?.query}`}</title>
        <meta
          name="description"
          content={`${queryData?.query} - ${queryData?.queryType}`}
        />
      </Head>
      <Snackbar
        open={openQueryCopy}
        autoHideDuration={6000}
        onClose={handleCloseQueryCopy}
      >
        <Alert onClose={handleCloseQueryCopy} severity="success">
          Blog URL copied!
        </Alert>
      </Snackbar>
      <div className={queryStyles.queryCard}>
        <Link
          href={
            userData?.id === user?.id ? `/profile` : `/profile/${userData?.id}`
          }
        >
          <motion.a
            className={queryStyles.owner}
            variants={fadeAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: 1.2,
            }}
          >
            {userData?.name}
          </motion.a>
        </Link>
        <motion.p
          className={queryStyles.timestamp}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.3,
          }}
        >
          {queryData?.timestamp?.toDate().toLocaleString()}
        </motion.p>
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <motion.pre
            className={queryStyles.query}
            variants={fadeAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: 1.4,
            }}
          >
            {queryData?.query}
          </motion.pre>
        </ReactLinkify>
        <p className={queryStyles.queryType}>{queryData?.queryType}</p>
        <motion.div
          className={queryStyles.buttons}
          variants={fadeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1.5,
          }}
        >
          <BootstrapTooltip
            title={
              !queryData.upVotes?.includes(user?.id) ? "UpVote" : "DownVote"
            }
          >
            <IconButton
              style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
              className={queryStyles.button}
              onClick={likePost}
            >
              <StyledBadge
                badgeContent={queryData.upVotes?.length}
                color="secondary"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                {queryData.upVotes?.includes(user?.id) ? (
                  <ThumbUp style={{ marginLeft: 4 }} color="primary" />
                ) : (
                  <ThumbUpOutlined style={{ marginLeft: 4 }} />
                )}
              </StyledBadge>
            </IconButton>
          </BootstrapTooltip>
          <BootstrapTooltip title="Share">
            <IconButton
              style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
              className={queryStyles.button}
              onClick={sharePost}
            >
              <ShareIcon style={{ marginLeft: 4 }} />
            </IconButton>
          </BootstrapTooltip>
          {user?.id === queryData?.by ? (
            <BootstrapTooltip title="Delete Query">
              <IconButton
                style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
                className={queryStyles.button}
                onClick={async () => {
                  if (confirm("Are you sure to delete this Query?")) {
                    const queryRef = await db
                      .collection("Queries")
                      .doc(router.query.queryID);
                    deletePost(queryRef);
                  }
                }}
              >
                <DeleteOutlined style={{ marginLeft: 4 }} />
              </IconButton>
            </BootstrapTooltip>
          ) : (
            <BootstrapTooltip title="Report">
              <IconButton
                style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
                className={queryStyles.button}
                onClick={reportPost}
              >
                <ReportOutlined style={{ marginLeft: 4 }} />
              </IconButton>
            </BootstrapTooltip>
          )}
        </motion.div>
        <Divider />
        {solutions.length > 0 && (
          <>
            <div className={queryStyles.comments} id="solutions">
              <p
                onClick={() => setSortByUpVotes(!sortByUpVotes)}
                className={queryStyles.sortButton}
              >
                {sortByUpVotes ? "Sort by Timestamp" : "Sort by UpVotes"}
              </p>
              {solutions
                .sort((a, b) =>
                  sortByUpVotes
                    ? b.upVotes.length - a.upVotes.length
                    : b.timestamp - a.timestamp
                )
                .map((solution) => (
                  <Solution
                    postID={router.query.queryID}
                    key={solution?.id}
                    id={solution?.id}
                    queryBy={queryData.by}
                    by={solution?.by}
                    query={solution?.solution}
                    solution={solution?.solution}
                    timestamp={solution?.timestamp?.toDate().toLocaleString()}
                    upVotes={solution?.upVotes}
                  />
                ))}
            </div>
            <Divider />
          </>
        )}
        <div className={queryStyles.commentInputDiv}>
          <ModeCommentOutlined
            fontSize="small"
            style={{ marginLeft: 4, color: "grey" }}
          />
          <TextareaAutosize
            placeholder={`Leave a Solution`}
            type="text"
            className={queryStyles.commentInput}
            onChange={(e) => setSolution(e.target.value)}
            value={solution}
          />
          {uploadingSolutions ? (
            <div className="progress-div">
              <CircularProgress size={21} style={{ color: "black" }} />
            </div>
          ) : (
            <IconButton onClick={addSolution}>
              <SendRounded fontSize="small" style={{ marginRight: 4 }} />
            </IconButton>
          )}
        </div>
        <Divider />
      </div>
    </motion.div>
  );
};

export default Query;
