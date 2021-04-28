import React, { useState, useEffect } from "react";
import styles from "../../styles/components/admin/Notice.module.css";
import HeaderStyles from "../../styles/components/admin/DashboardHeader.module.css";
import NoticeLayout from "./NoticeLayout";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import { SchoolOutlined } from "@material-ui/icons";
import { db, firebase } from "../../services/firebase";

// imports for modal
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress } from "@material-ui/core";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [searchString, setSearchString] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [noticeText, setNoticeText] = useState("");
  const [noticeDepartment, setNoticeDepartment] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    db.collection("Notices").onSnapshot((snapshot) =>
      setNotices(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          department: doc.data().department,
          notice: doc.data().notice,
          time: doc.data().time,
        }))
      )
    );
  }, []);

  // More Icon

  // Notice Modal
  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
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

  // Save Notice
  const saveNotice = (e) => {
    e.preventDefault();
    if (noticeText.trim().length < 5) {
      alert("Notice must be at least 5 characters long.");
    } else {
      setUploading(true);
      db.collection("Notices")
        .add({
          notice: noticeText,
          department: noticeDepartment,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => setUploading(false));
    }
    setOpenModal(false);
  };

  return (
    <div>
      <div className={HeaderStyles.path}>
        <i className={`fas fa-user-shield ${HeaderStyles.admin_icon}`}></i>
        Admin/
        <span className={HeaderStyles.path_link}>Notice</span>
      </div>

      <div className={HeaderStyles.search}>
        <div className={HeaderStyles.search_group}>
          <input
            type="text"
            placeholder="Search..."
            className={HeaderStyles.search_box}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <span className={HeaderStyles.icon}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
      </div>

      {/* Notice */}
      <div className={styles.notices}>
        {notices
          .filter((notice) =>
            notice.notice.toLowerCase().includes(searchString.toLowerCase())
          )
          .map((notice) => (
            <NoticeLayout
              key={notice.id}
              id={notice.id}
              department={notice.department}
              notice={notice.notice}
              time={notice.time}
            />
          ))}
      </div>

      {/* Notice Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">NOTICE FORM</DialogTitle>
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

            {uploading ? (
              <CircularProgress size={21} style={{ color: "black" }} />
            ) : (
              <button className={styles.notice_submit} onClick={saveNotice}>
                Add notice
              </button>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Icon */}
      <AddCircleIcon
        className={styles.add_notice_icon}
        onClick={handleClickOpen}
      />
    </div>
  );
};

export default Notice;
