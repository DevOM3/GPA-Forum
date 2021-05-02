import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { db, firebase } from "../../services/firebase";
import solutionStyles from "../../styles/components/blogs/Comment.module.css";
import moment from "moment";
import { useStateValue } from "../../context/StateProvider";
import { Badge, withStyles, IconButton } from "@material-ui/core";
import { MoreVertOutlined, ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import ReactLinkify from "react-linkify";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CreateIcon from "@material-ui/icons/Create";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryFormStyles from "../../styles/components/queries/QueryForm.module.css";
import Button from "@material-ui/core/Button";

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const Solution = ({
  postID,
  id,
  queryBy,
  by,
  query,
  solution,
  timestamp,
  upVotes,
}) => {
  const [{ user }, dispatch] = useStateValue();
  const [openMoreVertOutlined, setOpenMoreVertOutlined] = useState(false);
  const [userData, setUserData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedSolution, setEditedSolution] = useState(solution);
  const [posting, setPosting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((data) => {
        if (data.exists) {
          setUserData({ id: data.id, name: data.data().name });
        } else {
          db.collection("Queries")
            .doc(router.query.queryID)
            .collection("Solutions")
            .doc(id)
            .delete();
        }
      });
  }, []);

  const upVote = () => {
    db.collection("Queries")
      .doc(postID)
      .collection("Solutions")
      .doc(id)
      .update({
        upVotes: upVotes?.includes(user?.id)
          ? firebase.firestore.FieldValue.arrayRemove(user?.id)
          : firebase.firestore.FieldValue.arrayUnion(user?.id),
      });
  };
  const editComment = () => {
    setEditDialogOpen(true);
    setPosting(true);
    db.collection("Queries")
      .doc(postID)
      .collection("Solutions")
      .doc(id)
      .update({
        solution: editedSolution,
      })
      .then(() => {
        setPosting(false);
        setEditDialogOpen(false);
        handleClose();
      });
  };
  const deleteSolution = () => {
    if (confirm("Are you sure to delete this Solution?")) {
      db.collection("Queries")
        .doc(postID)
        .collection("Solutions")
        .doc(id)
        .delete();
    }
  };
  return (
    <div
      className={solutionStyles.comment}
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <div style={{ flex: 1 }}>
        <Link href={`/profile/${userData?.id}`}>
          <a className={solutionStyles.by}>{userData?.name}</a>
        </Link>
        <p className={solutionStyles.timestamp}>
          {moment(timestamp).fromNow() === "3 months ago" ||
          moment(timestamp).fromNow() === "Invalid date"
            ? timestamp
            : moment(timestamp).fromNow()}
        </p>
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <pre className={solutionStyles.commentText}>{solution}</pre>
        </ReactLinkify>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {user?.id === by && (
          <>
            <IconButton onClick={handleClick} style={{ padding: 4 }}>
              <MoreVertOutlined />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MenuItem
                onClick={() => setEditDialogOpen(true)}
                style={{
                  color: "grey",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Edit
                <EditIcon style={{ marginLeft: 21 }} />
              </MenuItem>
              <MenuItem
                onClick={deleteSolution}
                style={{
                  color: "grey",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Delete
                <DeleteIcon style={{ marginLeft: 21 }} />
              </MenuItem>
            </Menu>
          </>
        )}
        {user?.id !== by && user?.id === queryBy && (
          <IconButton onClick={deleteSolution} style={{ padding: 4 }}>
            <DeleteIcon />
          </IconButton>
        )}
        <Dialog
          // TransitionComponent={Transition}
          open={editDialogOpen}
          onClose={() => handleClose(false)}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Edit Comment</DialogTitle>
          <DialogContent>
            <div className={queryFormStyles.queryInputDiv}>
              <CreateIcon
                fontSize="small"
                style={{ marginLeft: 4, color: "grey" }}
              />
              <TextareaAutosize
                autoFocus
                id="query-input"
                type="text"
                className={queryFormStyles.queryInput}
                onChange={(e) => setEditedSolution(e.target.value)}
                value={editedSolution}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            {posting ? (
              <div className="progress-div">
                <CircularProgress size={24} style={{ color: "black" }} />
              </div>
            ) : (
              <Button onClick={editComment} color="primary">
                Update
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <IconButton style={{ padding: 4 }} onClick={upVote}></IconButton>
        <IconButton style={{ padding: 4 }} onClick={upVote}>
          <StyledBadge
            badgeContent={upVotes?.length}
            color="secondary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {upVotes?.includes(user?.id) ? (
              <ThumbUp style={{ marginLeft: 4 }} color="primary" />
            ) : (
              <ThumbUpOutlined style={{ marginLeft: 4 }} />
            )}
          </StyledBadge>
        </IconButton>
      </div>
    </div>
  );
};

export default Solution;
