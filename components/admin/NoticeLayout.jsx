import styles from "../../styles/components/admin/Notice.module.css";
import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress } from "@material-ui/core";
import { SchoolOutlined } from "@material-ui/icons";

const options = ["Edit", "Delete"];
const ITEM_HEIGHT = 48;

const NoticeLayout = ({ id, department, notice, time }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [noticeText, setNoticeText] = useState("");
  const [noticeDepartment, setNoticeDepartment] = useState("");

  const dropDownOptions = [
    "Computer Engineering",
    "Information Technology",
    "Civil Engineering",
    "Electronics and Telecommunication",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Automobile Engineering",
    "Dress Designing and Garments Management",
    "Exam Cell",
    "Library",
    "Student Section",
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const editNotice = () => {
    setOpenModalEdit(true);
    setNoticeText(notice);
    setNoticeDepartment(department);
  };
  const deleteNotice = () => {
    db.collection("Notices").doc(id).delete();
  };

  const updateNotice = (e) => {
    e.preventDefault();
    if (noticeText.trim().length < 5) {
      alert("Notice must be at least 5 characters long.");
    } else {
      if (confirm("Are you sure to update this notice?")) {
        db.collection("Notices")
          .doc(id)
          .update({
            notice: noticeText,
            department: noticeDepartment,
          })
          .then(() => {
            setOpenModalEdit(false);
            alert("Notice updated.");
          });
      }
    }
  };

  return (
    <>
      <div className={styles.notice} key={notice.id}>
        <div className={styles.notice_date}>
          <p className={styles.date}>{time?.toDate().toLocaleString()}</p>
          {/* More Icon */}
          <div className={styles.more_icon}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
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
                  onClick={() => {
                    option === "Edit" ? editNotice() : deleteNotice();
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
        </div>
        <p className={styles.notice_text}>{notice}</p>
        <p className={styles.department}>{department}</p>
      </div>

      {/* Edit */}
      <Dialog
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">EDIT NOTICE FORM</DialogTitle>
        <DialogContent>
          <form action="" className={styles.notice_form}>
            <div className={styles.notice_input_grp}>
              <input
                type="text"
                placeholder="Type notice here..."
                className={styles.notice_input}
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
              />
            </div>

            <div className={styles.dropdown_div}>
              <SchoolOutlined style={{ color: "grey" }} />
              <select
                value={noticeDepartment}
                onChange={(e) => setNoticeDepartment(e.target.value)}
                required
                className={styles.dropdown_input}
              >
                {dropDownOptions.sort().map((option, index) => (
                  <option
                    key={index}
                    value={option}
                    style={{ borderRadius: 4 }}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button className={styles.notice_submit} onClick={updateNotice}>
              Update
            </button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalEdit(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoticeLayout;
