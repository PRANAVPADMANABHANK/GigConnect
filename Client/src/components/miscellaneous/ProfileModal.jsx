import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton color="primary" onClick={handleOpen}>
          {/* Replace with your desired icon */}
          <Avatar alt={user.username} src={user.img} />
        </IconButton>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h4" align="center">
            {user.username}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Avatar
            src={user.img}
            alt={user.username}
            sx={{
              width: "150px",
              height: "150px",
              margin: "0 auto",
              marginBottom: "16px",
            }}
          />
          <Typography variant="body1" align="center">
            Email: {user.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
