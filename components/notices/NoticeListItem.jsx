import React, { useEffect, useState } from "react";
import noticeListItemStyles from "../../styles/components/notices/NoticeListItem.module.css";
import Linkify from "react-linkify";
import { db } from "../../services/firebase";
import { fadeWidthAnimationVariant } from "../../services/utilities";
import { motion } from "framer-motion";
import { Badge, withStyles } from "@material-ui/core";

const optionsSelf = ["Edit", "Delete", "Share"];
const optionsAll = ["Share", "Report"];

const ITEM_HEIGHT = 48;

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const NoticeListItem = ({ index, id, notice, department, timestamp }) => {
  const [noticeText, setNoticeText] = useState(notice);
  useEffect(() => {
    db.collection("Notices")
      .doc(id)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setNoticeText(snapshot.data()?.notice);
        }
      });
  }, []);

  return (
    <motion.div
      className={noticeListItemStyles.noticeListItem}
      variants={fadeWidthAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.5,
        delay: index - 0.2,
      }}
    >
      <motion.p
        className={noticeListItemStyles.date}
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
        className={noticeListItemStyles.notice}
        variants={fadeWidthAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.5,
          delay: index,
        }}
      >
        <Linkify>{noticeText}</Linkify>
      </motion.p>
      <p className={noticeListItemStyles.department}>{department}</p>
    </motion.div>
  );
};

export default NoticeListItem;
