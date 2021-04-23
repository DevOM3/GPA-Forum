import React, { useState, useEffect } from "react";
import queryFormStyles from "../../styles/components/queries/QueryForm.module.css";
import { SchoolOutlined } from "@material-ui/icons";
import CreateIcon from "@material-ui/icons/Create";
import { db } from "../../services/firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../context/StateProvider";
import { useRouter } from "next/router";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { motion } from "framer-motion";
import { fadeWidthAnimationVariant } from "../../services/utilities";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostQuery = ({
  open,
  fetchQueries,
  handleClose,
  setUpdateOpen,
  id,
  setCurrentID,
}) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [queryType, setQueryType] = useState("");
  const [query, setQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  const options = [
    user?.branch?.title,
    "Exam Cell",
    "Library",
    "Student Section",
  ];

  const updateQuery = () => {
    if (query.trim().length < 10) {
      alert("Your query must be at least 10 characters long.");
    } else if (!queryType) {
      alert("Kindly select query type.");
    } else {
      setPosting(true);
      db.collection("Queries")
        .doc(id)
        .update({
          query,
          queryType,
        })
        .then(() => {
          fetchQueries();
          setQuery("");
          setPosting(false);
          setUpdateOpen(true);
          handleClose();
        });
    }
  };

  useEffect(() => {
    user &&
      id &&
      db
        .collection("Queries")
        .doc(id)
        .get()
        .then((data) => {
          setQuery(data.data().query);
          setQueryType(data.data().queryType);
        })
        .then(() => setLoading(false));

    () => setCurrentID("");
  }, [user, id]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={() => handleClose(true)}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
    >
      {loading ? (
        <motion.div
          className="progress-div"
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
        <>
          <DialogTitle id="form-dialog-title">Update a Query</DialogTitle>
          <DialogContent>
            <div className={queryFormStyles.queryInputDiv}>
              <CreateIcon
                fontSize="small"
                style={{ marginLeft: 4, color: "grey" }}
              />
              <TextareaAutosize
                placeholder={`Enter your Query`}
                autoFocus
                id="query-input"
                type="text"
                className={queryFormStyles.queryInput}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>

            <div className={queryFormStyles.queryInputDiv}>
              <SchoolOutlined style={{ color: "grey" }} />
              <select
                onChange={(e) => setQueryType(e.target.value)}
                value={queryType}
                required
                className={queryFormStyles.queryInput}
              >
                {options.sort().map((option, index) => (
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)} color="primary">
              Cancel
            </Button>
            {posting ? (
              <div className="progress-div">
                <CircularProgress size={24} style={{ color: "black" }} />
              </div>
            ) : (
              <Button onClick={updateQuery} color="primary">
                Update
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
export default PostQuery;
