import React, { useState, useEffect } from "react";
import queryFormStyles from "../../styles/components/queries/QueryForm.module.css";
import { SchoolOutlined } from "@material-ui/icons";
import CreateIcon from "@material-ui/icons/Create";
import { db, firebase } from "../../services/firebase";
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

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostQuery = ({ open, fetchQueries, handleClose }) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [queryType, setQueryType] = useState("");
  const [query, setQuery] = useState("");
  const [posting, setPosting] = useState(false);

  const options = [
    user?.branch?.title,
    "Exam Cell",
    "Library",
    "Student Section",
  ];

  const StoreQuery = () => {
    if (query.trim().length < 10) {
      alert("Your query must be at least 10 characters long.");
    } else if (!queryType) {
      alert("Kindly select query type.");
    } else {
      setPosting(true);
      db.collection("Queries")
        .add({
          query,
          queryType,
          by: user?.id,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          fetchQueries();
          setQuery("");
          setPosting(false);
          handleClose();
        });
    }
  };

  useEffect(() => {
    user && setQueryType(user?.branch?.title);
  }, [user]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Post a Query</DialogTitle>
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
            maxLength={271}
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
              <option key={index} value={option} style={{ borderRadius: 4 }}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* <Autocomplete
          clearOnBlur={false}
          disableClearable
          onChange={(e, v) => setQueryType(v)}
          options={branchData}
          getOptionLabel={(option) => option}
          defaultValue={branch}
          renderInput={(params) => (
            <div
              className={queryFormStyles.queryInputDiv}
              ref={params.InputProps.ref}
            >
              <SchoolOutlined style={{ color: "grey" }} />
              <input
                value={branch}
                required
                {...params.inputProps}
                type="text"
                className={queryFormStyles.queryInput}
                placeholder="Select your branch"
              />
            </div>
          )}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {posting ? (
          <div className="progress-div">
            <CircularProgress size={24} style={{ color: "black" }} />
          </div>
        ) : (
          <Button onClick={StoreQuery} color="primary">
            Post
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default PostQuery;
