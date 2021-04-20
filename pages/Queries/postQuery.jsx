import React, { useState,Component } from 'react';
import writeQueries from '../../styles/pages/Queries/WriteQuery.module.css'
import {SchoolOutlined  } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import CreateIcon from '@material-ui/icons/Create';
import { auth, db, firebase } from "../../services/firebase";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
const postQuery = () => {
    const [branch, setBranch] = useState("");
    const[query,setQuery] = useState("");
    const [open, setDialogOpen] = React.useState(false);
    const [posting, setPosting] = useState(false);
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

    const branchData = [
        {
          acronym: "CO",
          title: "Computer Engineering",
        },
        {
          acronym: "IT",
          title: "Information Technology",
        },
        {
          acronym: "CE",
          title: "Civil Engineering",
        },
        {
          acronym: "E&TC",
          title: "Electronics and Telecommunication",
        },
        {
          acronym: "ME",
          title: "Mechanical Engineering",
        },
        {
          acronym: "EE",
          title: "Electrical Engineering",
        },
        {
          acronym: "AE",
          title: "Automobile Engineering",
        },
        {
          acronym: "DDGM",
          title: "Dress Designing and Garments Management",
        },
        {
          acronym: "",
          title: "Student Section",
        },
        {
          acronym: "",
          title: "Library",
        },
        {
          acronym: "",
          title: "Exam Cell",
        }
      ];
      const storeQuery = () => {
        if (query.trim().length < 10) {
           alert("Your query must be at least 10 characters long");
       } else {
            setPosting(true);
            db.collection("Forum").add({
                  query,
                  branch,
                  by: user?.id
            }).then(() => {
                  setPosting(false);
           });
       }
  }
    return(
        <div>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Ask Query
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = 'true'>
        <DialogTitle id="form-dialog-title">Post a Query</DialogTitle>
        <DialogContent>
            
            <div className={writeQueries.input}>
            <CreateIcon style={{ color: "grey" }}/>
            
             
            <TextField
          id="outlined-textarea"
          label="Write a Query."
          placeholder="Be specific and imagine you’re asking a question to another person"
          multiline
          required
          variant="outlined"
          onChange={(e) => setQuery(e.target.value)}
          className={ writeQueries.input }
        />
            </div>
            
            <Autocomplete
                onChange={(e, v) => setBranch(v)}
                options={branchData}
                getOptionLabel={(option) =>
                  `${option.acronym} (${option.title})`
                }
                renderInput={(params) => (
                  <div
                  className={ writeQueries.input }
                    ref={params.InputProps.ref}
                  >
                    <SchoolOutlined style={{ color: "grey" }} />
                    <TextField
                    label="Choose field"
                      required
                      value={branch}
                      required
                      {...params.inputProps}
                      type="text"
                      className={writeQueries.input}
                    
                      variant="outlined"
                    />
                  </div>
                )}
              />

            </DialogContent>
            <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickOpen} color="primary">
            Post
          </Button>
        </DialogActions>
        </Dialog>
          
        </div>

    
    );

}
export default postQuery