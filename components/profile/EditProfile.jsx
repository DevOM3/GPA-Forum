import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import SendIcon from "@material-ui/icons/Send";
import formStyles from "../../styles/components/queries/QueryForm.module.css";
import {
  Create,
  LockOutlined,
  PhoneIphoneOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  PermPhoneMsgOutlined,
} from "@material-ui/icons";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { AnimatePresence, motion } from "framer-motion";
import { db, firebase, storage } from "../../services/firebase";
import { useStateValue } from "../../context/StateProvider";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "sticky",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    flexGrow: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const options = ["Name", "Password", "Mobile Number"];

const EditProfile = ({ openEditProfile, setOpenEditProfile }) => {
  const classes = useStyles();
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phno, setPhno] = useState("");
  const [toUpdate, setToUpdate] = useState("Name");
  const [{ user }, dispatch] = useStateValue();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const update = async () => {
    if (toUpdate === "Name") {
      if (name.trim().length < 2) {
        alert("Your name must be at last 2 characters long.");
      } else {
        setUpdating(true);
        await db.collection("Users").doc(user?.id).update({
          name,
        });
        setUpdating(false);
        setOpenEditProfile(false);
      }
    } else if (toUpdate === "Password") {
      if (password.length < 8) {
        alert("Password must be at last 8 characters long!");
      } else {
        setUpdating(true);
        await db.collection("Users").doc(user?.id).update({
          password,
        });
        setUpdating(false);
        setOpenEditProfile(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setPassword(user?.password);
      setPhno(user?.phno);
    }
  }, [user]);

  return (
    <Dialog
      open={openEditProfile}
      onClose={() => setOpenEditProfile(false)}
      TransitionComponent={Transition}
      fullWidth
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"Update "}
        <select
          onChange={(e) => setToUpdate(e.target.value)}
          value={toUpdate}
          required
          className={formStyles.queryInput}
          style={{ fontSize: 18, paddingLeft: 0 }}
        >
          {options.sort().map((option, index) => (
            <option
              key={index}
              value={option}
              style={{ borderRadius: 4, fontSize: 14 }}
            >
              {option}
            </option>
          ))}
        </select>
      </DialogTitle>
      <DialogContent>
        {toUpdate === "Name" ? (
          <div className={formStyles.queryInputDiv}>
            <Create fontSize="small" style={{ marginLeft: 4, color: "grey" }} />
            <input
              placeholder={`Enter your Name`}
              autoFocus
              type="text"
              className={formStyles.queryInput}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        ) : toUpdate === "Password" ? (
          <div className={formStyles.queryInputDiv}>
            <LockOutlined style={{ color: "grey" }} />
            <input
              required
              minLength={8}
              maxLength={51}
              type={passwordVisible ? "text" : "password"}
              className={formStyles.queryInput}
              placeholder="Choose a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconButton
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              {passwordVisible ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </div>
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEditProfile(false)} color="primary">
          Close
        </Button>
        {updating ? (
          <div className="progress-div">
            <CircularProgress size={24} style={{ color: "black" }} />
          </div>
        ) : (
          <Button onClick={update} color="primary">
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
