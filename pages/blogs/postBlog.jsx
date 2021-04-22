import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TitleIcon from '@material-ui/icons/Title';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import SendIcon from '@material-ui/icons/Send';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const[title,setTitle] = React.useState("");
  const[blogtext,setBlogText] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Post Blog
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Post a Blog
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Publish          
            </Button><SendIcon/>
          </Toolbar>
        </AppBar>
        <div  style = {{paddingTop : '10px'}}>
        <OutlinedInput
            style = {{width: '100%'}}
            id="outlined-adornment-amount"
            placeholder = "Title"
            onChange={(e) => setTitle(e.target.value)}
            startAdornment={<InputAdornment position="start">T</InputAdornment>}
            labelWidth={60}
          />
          </div>
          <div style = {{paddingTop : '10px'}}>
          <OutlinedInput
          style = {{width: '100%'}}
            id="outlined-adornment-amount"
            placeholder = "Write blog"
            multiline = 'true'
            rows = '20'
            onChange={(e) => setBlogText(e.target.value)}
            startAdornment={<SubtitlesIcon position="start"/>}
            labelWidth={60}
          />
          </div>
      </Dialog>
    </div>
  );
}
