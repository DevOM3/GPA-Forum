import React, { useEffect, useState } from "react";
import queryListItemStyles from "../../styles/components/queries/QueryListItem.module.css";
import Linkify from "react-linkify";
import { db, firebase } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { ShareRounded, ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import { fadeWidthAnimationVariant } from "../../services/utilities";
import { motion } from "framer-motion";
import { ReportOutlined } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Badge, withStyles } from "@material-ui/core";
import { report, REPORT_THRESHOLD, suspendUser } from "../../services/report";
import { BootstrapTooltip } from "../../services/utilities";

const optionsSelf = ["Edit", "Delete", "Share"];
const optionsAll = ["Share", "Report"];

const ITEM_HEIGHT = 48;

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const QueryListItem = ({
  index,
  id,
  query,
  queryType,
  by,
  timestamp,
  setDeleteOpen,
  fetchQueries,
  setOpenEdit,
  setCurrentID,
  setCopyOpen,
}) => {
  const [queryText, setQueryText] = useState(query);
  const [queryUpVotes, setQueryUpVotes] = useState([]);
  const [solutionCount, setSolutionCount] = useState(0);
  const [byData, setByData] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleting, setDeleting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sharePost = () => {
    const path = `${location}/${id}`;
    navigator.clipboard.writeText(path);

    setCopyOpen(true);
  };

  const reportPost = async () => {
    if (report(queryText)) {
      const queryRef = await db.collection("Queries").doc(id);
      if ((await queryRef.get()).data().reports >= REPORT_THRESHOLD) {
        setDeleting(true);
        await suspendUser((await queryRef.get()).data().by);
        setDeleting(false);
      } else {
        deleteQuery(queryRef);
      }
    } else {
      alert("This query is all right!");
    }
  };

  const editPost = async () => {
    setCurrentID(id);
    setOpenEdit(true);
  };

  const deleteQuery = async (queryRef) => {
    setDeleting(true);
    const querySolutions = (await queryRef.collection("Solutions").get()).docs;

    for (let index = 0; index < querySolutions.length; index++) {
      await db
        .collection("Queries")
        .doc(id)
        .collection("Solutions")
        .doc(querySolutions[index].id)
        .delete();
    }

    await queryRef.delete();
    await db
      .collection("Users")
      .doc((await queryRef.get()).data().by)
      .update({
        reports: firebase.firestore.FieldValue.increment(),
      });
    setDeleteOpen(true);
    fetchQueries();
    setDeleting(false);
  };

  const deletePost = async () => {
    if (confirm("Are you sure to delete this post?")) {
      deleteQuery();
    }
  };

  useEffect(() => {
    if (by) {
      if (by === user?.id) {
        setByData({
          id: user?.id,
          name: "You",
        });
      } else {
        db.collection("Users")
          .doc(by)
          .get()
          .then((data) =>
            setByData({
              id: data?.id,
              name: data.data()?.name,
            })
          );
      }
    }
  }, [by]);

  useEffect(() => {
    db.collection("Queries")
      .doc(id)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setQueryText(snapshot.data()?.query);
          setQueryUpVotes(snapshot.data()?.upVotes);
        }
      });
    db.collection("Queries")
      .doc(id)
      .collection("Solutions")
      .onSnapshot((snapshot) => setSolutionCount(snapshot.docs.length));
  }, []);

  const upVoteQuery = () => {
    db.collection("Queries")
      .doc(id)
      .update({
        upVotes: queryUpVotes?.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };

  return deleting ? (
    <motion.div
      className={`${queryListItemStyles.queryListItem} progress-div`}
      style={{ height: 100 }}
      variants={fadeWidthAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
      }}
    >
      <CircularProgress size={24} style={{ color: "black" }} />
    </motion.div>
  ) : (
    <motion.div
      className={queryListItemStyles.queryListItem}
      variants={fadeWidthAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
        delay: index - 0.2,
      }}
    >
      <Link href={`/queries/${id}`}>
        <a>
          <motion.p
            className={queryListItemStyles.date}
            variants={fadeWidthAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: index - 0.1,
            }}
          >
            {timestamp?.toDate().toLocaleString()}
          </motion.p>
          <motion.p
            className={queryListItemStyles.query}
            variants={fadeWidthAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: index,
            }}
          >
            <Linkify>{queryText}</Linkify>
          </motion.p>
          {/* <p className={queryListItemStyles.queryType}>{queryType}</p> */}
          <motion.p
            className={queryListItemStyles.by}
            variants={fadeWidthAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.5,
              delay: index + 0.1,
            }}
          >
            by {byData?.name}
          </motion.p>
        </a>
      </Link>

      <div className={queryListItemStyles.bottom}>
        <div className={queryListItemStyles.bottomLeft}>
          <Link href={`/queries/${id}#solutions`}>
            <a className={queryListItemStyles.solutions}>
              Solutions: {solutionCount}
            </a>
          </Link>
        </div>
        <BootstrapTooltip
          title={!queryUpVotes?.includes(user?.id) ? "UpVote" : "DownVote"}
        >
          <IconButton
            style={{ paddingLeft: 7, paddingTop: 11, paddingRight: 11 }}
            onClick={upVoteQuery}
          >
            <StyledBadge
              badgeContent={queryUpVotes?.length}
              color="secondary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {queryUpVotes?.includes(user?.id) ? (
                <ThumbUp style={{ marginLeft: 4 }} color="primary" />
              ) : (
                <ThumbUpOutlined style={{ marginLeft: 4 }} />
              )}
            </StyledBadge>
          </IconButton>
        </BootstrapTooltip>
      </div>

      <div className={queryListItemStyles.menu}>
        <BootstrapTooltip title="Options">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        </BootstrapTooltip>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          {user?.id === by
            ? optionsSelf.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={() => {
                    option === "Edit"
                      ? editPost()
                      : option === "Delete"
                      ? deletePost()
                      : sharePost();
                    handleClose();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {option}
                  {option === "Edit" ? (
                    <EditRoundedIcon
                      fontSize="small"
                      style={{ color: "grey" }}
                    />
                  ) : option === "Share" ? (
                    <ShareRounded fontSize="small" style={{ color: "grey" }} />
                  ) : (
                    <DeleteRoundedIcon
                      fontSize="small"
                      style={{ color: "grey" }}
                    />
                  )}
                </MenuItem>
              ))
            : optionsAll.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={() => {
                    option === "Share" ? sharePost() : reportPost();
                    handleClose();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {option}
                  {option === "Share" ? (
                    <ShareRounded fontSize="small" style={{ color: "grey" }} />
                  ) : (
                    <ReportOutlined
                      fontSize="small"
                      style={{ color: "grey" }}
                    />
                  )}
                </MenuItem>
              ))}
        </Menu>
      </div>
    </motion.div>
  );
};

export default QueryListItem;
