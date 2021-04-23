import React, { useEffect, useState } from "react";
import queryListItemStyles from "../../styles/components/queries/QueryListItem.module.css";
import Linkify from "react-linkify";
import { db } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { fadeWidthAnimationVariant } from "../../services/utilities";
import { motion } from "framer-motion";
import { ReportOutlined } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

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
}) => {
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

  const editPost = async () => {
    setCurrentID(id);
    setOpenEdit(true);
  };

  const deletePost = async () => {
    if (confirm("Are you sure to delete this post?")) {
      setDeleting(true);
      const queryRef = await db.collection("Queries").doc(id);
      const queryComments = (await queryRef.collection("Comments").get()).docs;

      for (let index = 0; index < queryComments.length; index++) {
        await db
          .collection("Queries")
          .doc(id)
          .collection("Comments")
          .doc(queryComments[index].id)
          .delete();
      }

      await queryRef.delete();
      setDeleteOpen(true);
      fetchQueries();
      setDeleting(false);
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
            <Linkify>{query}</Linkify>
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
            by: {byData?.name}
          </motion.p>
        </a>
      </Link>

      {user?.id === by ? (
        <div className={queryListItemStyles.menu}>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
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
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={() => {
                  option === "Edit" ? editPost() : deletePost();
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
                  <EditRoundedIcon fontSize="small" style={{ color: "grey" }} />
                ) : (
                  <DeleteRoundedIcon
                    fontSize="small"
                    style={{ color: "grey" }}
                  />
                )}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ) : (
        <div className={queryListItemStyles.menu}>
          <IconButton>
            <ReportOutlined />
          </IconButton>
        </div>
      )}
    </motion.div>
  );
};

export default QueryListItem;
