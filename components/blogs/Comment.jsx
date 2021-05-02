import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import commentStyles from "../../styles/components/blogs/Comment.module.css";
import moment from "moment";
import { useRouter } from "next/router";
import ReactLinkify from "react-linkify";
import { MoreVertOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
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
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useStateValue } from "../../context/StateProvider";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Comment = ({ id, by, comment, timestamp, blogBy }) => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  //const [user, setUser] = useState({});
  const [openMoreVertOutlined, setOpenMoreVertOutlined] = useState(false);
  const [userData, setUserData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [posting, setPosting] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const editComment = () => {
    if (editedComment.trim().length < 3) {
      alert("Your comment must be at least 3 characters long.");
    } else {
      setEditDialogOpen(true);
      setPosting(true);
      db.collection("Blogs")
        .doc(router.query.blogID)
        .collection("Comments")
        .doc(id)
        .update({
          comment: editedComment,
        })
        .then(() => {
          setPosting(false);
          setEditDialogOpen(false);
          handleClose();
        });
    }
  };

  const deleteComment = () => {
    if (confirm("Are you sure to delete this comment?")) {
      db.collection("Blogs")
        .doc(router.query.blogID)
        .collection("Comments")
        .doc(id)
        .delete();
    }
  };

  useEffect(() => {
    db.collection("Users")
      .doc(by)
      .get()
      .then((data) => {
        if (data.exists) {
          setUserData({ id: data?.id, name: data.data()?.name });
        } else {
          db.collection("Blogs")
            .doc(router.query.blogID)
            .collection("Comments")
            .doc(id)
            .delete();
        }
      });
  }, []);

  return (
    <div className={commentStyles.comment}>
      <div className={commentStyles.left}>
        <Link href={`/profile/${userData.id}`}>
          <a className={commentStyles.by}>{userData?.name}</a>
        </Link>
        <p className={commentStyles.timestamp}>
          {moment(timestamp).from(moment.now())}
        </p>
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <pre className={commentStyles.commentText}>{comment}</pre>
        </ReactLinkify>
      </div>
      {user?.id === by && (
        <>
          <IconButton onClick={handleClick}>
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
              <EditIcon fontSize="small" style={{ marginLeft: 21 }} />
            </MenuItem>
            <MenuItem
              onClick={deleteComment}
              style={{
                color: "grey",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Delete
              <DeleteIcon fontSize="small" style={{ marginLeft: 21 }} />
            </MenuItem>
          </Menu>
        </>
      )}
      {user?.id !== by && user?.id === blogBy && (
        <IconButton onClick={deleteComment}>
          <DeleteIcon />
        </IconButton>
      )}
      <Dialog
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
              placeholder={`Enter your Query`}
              autoFocus
              id="query-input"
              type="text"
              className={queryFormStyles.queryInput}
              onChange={(e) => setEditedComment(e.target.value)}
              value={editedComment}
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
    </div>
  );
};

export default Comment;

// import React from "react";
// import Link from "next/link";
// import { useState } from "react";
// import { useEffect } from "react";
// import { db } from "../../services/firebase";
// import commentStyles from "../../styles/components/blogs/Comment.module.css";
// import moment from "moment";
// import { useRouter } from "next/router";
// import ReactLinkify from "react-linkify";
// import { MoreVertOutlined } from "@material-ui/icons";
// import { IconButton } from "@material-ui/core";

// const Comment = ({ id, by, comment, timestamp }) => {
//   const router = useRouter();
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     db.collection("Users")
//       .doc(by)
//       .get()
//       .then((data) => {
//         if (data.exists) {
//           setUser({ id: data?.id, name: data.data()?.name });
//         } else {
//           db.collection("Blogs")
//             .doc(router.query.blogID)
//             .collection("Comments")
//             .doc(id)
//             .delete();
//         }
//       });
//   }, []);

//   return (
//     <div className={commentStyles.comment}>
//       <div className={commentStyles.left}>
//         <Link href={`/profile/${user.id}`}>
//           <a className={commentStyles.by}>{user?.name}</a>
//         </Link>
//         <p className={commentStyles.timestamp}>{moment(timestamp).fromNow()}</p>
//         <ReactLinkify
//           componentDecorator={(decoratedHref, decoratedText, key) => (
//             <a target="blank" href={decoratedHref} key={key}>
//               {decoratedText}
//             </a>
//           )}
//         >
//           <p className={commentStyles.commentText}>{comment}</p>
//         </ReactLinkify>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column" }}>
//         <IconButton>
//           <MoreVertOutlined />
//         </IconButton>
//       </div>
//     </div>
//   );
// };

// export default Comment;
