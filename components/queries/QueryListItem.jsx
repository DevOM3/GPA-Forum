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

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

const QueryListItem = ({ index, id, query, queryType, by, timestamp }) => {
  const [byData, setByData] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
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
            {timestamp.toDate().toLocaleString()}
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
            style={{ padding: 4 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            id="long-menu"
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
                onClick={handleClose}
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
          <IconButton style={{ padding: 4 }}>
            <ReportOutlined fontSize="small" />
          </IconButton>
        </div>
      )}
    </motion.div>
  );
};

export default QueryListItem;
