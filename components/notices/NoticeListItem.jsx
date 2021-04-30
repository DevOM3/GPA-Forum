import React, { useEffect, useState } from "react";
import noticeListItemStyles from "../../styles/components/notices/NoticeListItem.module.css";
import Linkify from "react-linkify";
import { db } from "../../services/firebase";
import { fadeWidthAnimationVariant } from "../../services/utilities";
import { motion } from "framer-motion";
import { IconButton } from "@material-ui/core";
import { Share } from "@material-ui/icons";
import { BootstrapTooltip } from "../../services/utilities";

const NoticeListItem = ({
  index,
  id,
  notice,
  department,
  timestamp,
  setCopyOpen,
}) => {
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
      id={id}
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
      <BootstrapTooltip title="Share">
        <IconButton
          onClick={() =>
            navigator.clipboard
              .writeText(
                `${
                  location.href.includes("#")
                    ? location.href.split("#")[0]
                    : location
                }#${id}`
              )
              .then(() => setCopyOpen(true))
          }
          className={noticeListItemStyles.shareButton}
        >
          <Share />
        </IconButton>
      </BootstrapTooltip>
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
      <motion.pre
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
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          {noticeText}
        </Linkify>
      </motion.pre>
      <p className={noticeListItemStyles.department}>{department}</p>
    </motion.div>
  );
};

export default NoticeListItem;
