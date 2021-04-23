import React, { useEffect, useState } from "react";
import queryStyles from "../../styles/pages/queries/Query.module.css";
import IconButton from "@material-ui/core/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import {
  pageAnimationVariant,
  sizeAnimationVariant,
} from "../../services/utilities";
import QueryEditForm from "../../components/queries/QueryEditForm";
import { db } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import QueryListItem from "../../components/queries/QueryListItem";
import { SortRounded, TuneRounded } from "@material-ui/icons";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ProfileQuery = ({ userID, branch }) => {
  const [{ user }, dispatch] = useStateValue();
  const [currentID, setCurrentID] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("Date DESC");
  const [queries, setQueries] = useState([]);

  const filterOptions = [
    branch,
    "Exam Cell",
    "Library",
    "Student Section",
    "None",
  ];
  const sortOptions = ["Date ASC", "Date DESC"];

  const fetchQueries = () => {
    db.collection("Queries")
      .where("by", "==", userID)
      .get()
      .then((snapshot) =>
        setQueries(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            query: doc.data().query,
            queryType: doc.data().queryType,
            by: doc.data().by,
            timestamp: doc.data().timestamp,
          }))
        )
      );
  };

  useEffect(() => {
    if (user) {
      fetchQueries();
    }
  }, [user]);

  return (
    <motion.div
      className={queryStyles.query}
      variants={pageAnimationVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Snackbar
        open={deleteOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteOpen(false)}
      >
        <Alert onClose={() => setDeleteOpen(false)} severity="warning">
          Query deleted!
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateOpen}
        autoHideDuration={6000}
        onClose={() => setUpdateOpen(false)}
      >
        <Alert onClose={() => setUpdateOpen(false)} severity="info">
          Query updated!
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
          <div className={queryStyles.optionModal}>
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
          <div className={queryStyles.optionModal}>
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
      <QueryEditForm
        open={openEdit}
        handleClose={setOpenEdit}
        fetchQueries={fetchQueries}
        setUpdateOpen={setUpdateOpen}
        id={currentID}
        setCurrentID={setCurrentID}
      />

      <div className={queryStyles.queries}>
        <motion.div
          className={queryStyles.optionProfile}
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
            className={queryStyles.optionButton}
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
          {queries
            .filter((query) =>
              filter === user?.branch?.title
                ? query?.queryType === user?.branch?.title
                : filter === "Library"
                ? query?.queryType === "Library"
                : filter === "Exam Cell"
                ? query?.queryType === "Exam Cell"
                : filter === "Student Section"
                ? query?.queryType === "Student Section"
                : query
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
            .map((query, index) => (
              <QueryListItem
                index={index > 0 ? index / 7 : index}
                key={query.id}
                id={query.id}
                query={query.query}
                queryType={query.queryType}
                by={query.by}
                timestamp={query.timestamp}
                setDeleteOpen={setDeleteOpen}
                fetchQueries={fetchQueries}
                setOpenEdit={setOpenEdit}
                setCurrentID={setCurrentID}
              />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileQuery;
