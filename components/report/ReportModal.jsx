import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { useState } from "react";
import { Rating } from "@material-ui/lab";
import pageStyles from "../../styles/components/report/Report.module.css";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ReportModal({
  reportModalOpen,
  handleReportModalClose,
  id,
  reports,
}) {
  const [views, setViews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [blogLikes, setBlogLikes] = useState(0);
  const [blogViews, setBlogViews] = useState(0);
  const [queryCount, setQueriesCount] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    db.collection("Blogs")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((user) => {
          if (user.data()?.by === id) {
            setBlogCount((prev) => prev + 1);
            setBlogLikes((prev) => prev + user.data()?.likes?.length);
            setBlogViews((prev) => prev + user.data()?.views?.length);
          }
        });
      })
      .catch((err) => console.log(err));
    db.collection("Queries")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((user) => {
          if (user.data()?.by === id) {
            setQueriesCount((prev) => prev + 1);
            setUpvoteCount((prev) => prev + user.data()?.upVotes?.length);
          }
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={handleReportModalClose}
      aria-labelledby="customized-dialog-title"
      open={reportModalOpen}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleReportModalClose}
      >
        Profile Report
      </DialogTitle>
      <DialogContent dividers>
        <div className={pageStyles.main}>
          <div className={pageStyles.left}>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Blogs Posted</span>
              <span>{blogCount}</span>
            </Typography>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Blogs Views</span>
              <span>{blogViews}</span>
            </Typography>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Blogs Likes</span>
              <span>{blogLikes}</span>
            </Typography>
          </div>
          <div className={pageStyles.divider}></div>
          <div className={pageStyles.right}>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Queries Asked</span>
              <span>{queryCount}</span>
            </Typography>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Queries UpVotes</span>
              <span>{upvoteCount}</span>
            </Typography>
            <Typography
              gutterBottom
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Reported</span>
              <span>{reports} times</span>
            </Typography>
          </div>
        </div>
        <Typography
          gutterBottom
          style={{ marginTop: 11, display: "flex", alignItems: "center" }}
        >
          Rating: <Rating name="read-only" value={5 - reports / 4} readOnly />
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
