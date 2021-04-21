import React, { useEffect, useState } from "react";
import queryStyles from "../../styles/pages/queries/Query.module.css";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import QueryForm from "../../components/queries/QueryForm";
import { motion } from "framer-motion";
import {
  fabAnimationVariant,
  pageAnimationVariant,
  sizeAnimationVariant,
} from "../../services/utilities";
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

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Queries = () => {
  const [{ user }, dispatch] = useStateValue();
  const [open, setDialogOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("Date DESC");
  const [queries, setQueries] = useState([]);

  const filterOptions = [
    user?.branch?.title,
    "Exam Cell",
    "Library",
    "Student Section",
    "None",
  ];
  const sortOptions = ["Date ASC", "Date DESC"];

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (user) {
      db.collection("Queries")
        .where("queryType", "in", [
          user?.branch?.title,
          "Student Section",
          "Library",
          "Exam Cell",
        ])
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
      <QueryForm
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
      <motion.div
        className={queryStyles.fab}
        variants={fabAnimationVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <IconButton onClick={handleClickOpen}>
          <EditIcon style={{ color: "black" }} />
        </IconButton>
      </motion.div>

      <div className={queryStyles.queries}>
        <motion.div
          className={queryStyles.option}
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
              index={index}
              key={query.id}
              id={query.id}
              query={query.query}
              queryType={query.queryType}
              by={query.by}
              timestamp={query.timestamp}
            />
          ))}
      </div>
    </motion.div>
  );
};

export default Queries;
