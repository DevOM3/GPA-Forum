import React, { useEffect, useState } from "react";
import noticeStyles from "../../styles/pages/notices/Notice.module.css";
import IconButton from "@material-ui/core/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import {
  pageAnimationVariant,
  sizeAnimationVariant,
} from "../../services/utilities";
import { db } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import { SortRounded, TuneRounded } from "@material-ui/icons";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Slide from "@material-ui/core/Slide";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import NoticeListItem from "../../components/notices/NoticeListItem";
import Head from "next/head";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Notices = () => {
  const [{ user, searchString }, dispatch] = useStateValue();
  const [optionOpen, setOptionOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("Date DESC");
  const [notices, setNotices] = useState([]);

  const filterOptions = [
    user?.branch?.title,
    "Exam Cell",
    "Library",
    "Student Section",
    "None",
  ];
  const sortOptions = ["Date ASC", "Date DESC"];

  const fetchNotices = () => {
    db.collection("Notices")
      .where("department", "in", [
        user?.branch?.title,
        "Student Section",
        "Library",
        "Exam Cell",
      ])
      .get()
      .then((snapshot) => {
        setNotices(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            department: doc.data().department,
            notice: doc.data().notice,
            timestamp: doc.data().time,
          }))
        );
        if (location.href.includes("#")) {
          scrollTo(
            0,
            document.getElementById(location.href.split("#")[1]).offsetTop - 171
          );
        }
      });
  };

  useEffect(() => {
    if (user) {
      fetchNotices();
    }
  }, [user]);

  return (
    <motion.div
      className={noticeStyles.notice}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Head>
        <title>GPAForum | Notices</title>
        {/* <meta
          property="og:title"
          content="GPAForum | Notices"
          key="title"
          key="title"
        />
        <meta
          name="description"
          content="See latest Notices from GPA faculties."
        />
        <meta
          property="og:description"
          content="See latest Notices from GPA faculties."
        /> */}
      </Head>
      <Snackbar
        open={copyOpen}
        autoHideDuration={6000}
        onClose={() => setCopyOpen(false)}
      >
        <Alert onClose={() => setCopyOpen(false)} severity="info">
          Notice link copied!
        </Alert>
      </Snackbar>
      <Dialog
        onClose={() => setOptionOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={optionOpen}
        style={{ padding: 7 }}
        TransitionComponent={Transition}
      >
        <DialogTitle id="simple-dialog-title">Filter/Sort</DialogTitle>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Filter */}
          <div className={noticeStyles.optionModal}>
            <FormLabel component="legend">Filter by</FormLabel>
            <RadioGroup
              aria-label="filter"
              name="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  style={{ fontSize: 14 }}
                />
              ))}
            </RadioGroup>
          </div>
          {/* Sort */}
          <div className={noticeStyles.optionModal}>
            <FormLabel component="legend">Sort by</FormLabel>
            <RadioGroup
              aria-label="sort"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  style={{ fontSize: 14 }}
                />
              ))}
            </RadioGroup>
          </div>
        </div>
      </Dialog>

      <div className={noticeStyles.notices}>
        <motion.div
          className={noticeStyles.option}
          variants={sizeAnimationVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.5,
            delay: 1,
          }}
        >
          <IconButton
            className={noticeStyles.optionButton}
            onClick={() => setOptionOpen(true)}
          >
            <TuneRounded
              fontSize="small"
              style={{ color: "grey", marginRight: 7 }}
            />
            Filter / Sort
            <SortRounded
              fontSize="small"
              style={{ color: "grey", marginLeft: 7 }}
            />
          </IconButton>
        </motion.div>
        <AnimatePresence>
          {notices
            .filter((notice) =>
              filter === user?.branch?.title
                ? notice?.department === user?.branch?.title
                : filter === "Library"
                ? notice?.department === "Library"
                : filter === "Exam Cell"
                ? notice?.department === "Exam Cell"
                : filter === "Student Section"
                ? notice?.department === "Student Section"
                : notice
            )
            .sort((a, b) =>
              sort === "Date ASC"
                ? a.timestamp > b.timestamp
                  ? 1
                  : b.timestamp > a.timestamp
                  ? -1
                  : 0
                : a.timestamp < b.timestamp
                ? 1
                : b.timestamp < a.timestamp
                ? -1
                : 0
            )
            .filter(
              (notice) =>
                notice?.notice
                  .toLowerCase()
                  .includes(searchString.toLowerCase()) ||
                notice?.department
                  .toLowerCase()
                  .includes(searchString.toLowerCase())
            )
            .map((notice, index) => (
              <NoticeListItem
                index={index > 0 ? index / 7 : index}
                key={notice?.id}
                id={notice?.id}
                notice={notice?.notice}
                department={notice?.department}
                timestamp={notice?.timestamp}
                setCopyOpen={setCopyOpen}
              />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Notices;
