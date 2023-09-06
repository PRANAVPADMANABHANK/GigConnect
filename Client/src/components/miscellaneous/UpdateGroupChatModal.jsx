import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ViewIcon from "@mui/icons-material/Visibility"; // Import the ViewIcon
import { useChatState } from "../../context/ChatProvider";
import CancelIcon from "@mui/icons-material/Cancel";
import newRequest from "../../utils/newRequest";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = useChatState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      console.log("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await newRequest.put(`/chat/groupadd`, {
        chatId: selectedChat._id,
        userId: user1._id,
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log("Error Occured!");
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      console.log("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await newRequest.put(
        `/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log("Error Occured!")
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const { data } = await newRequest.put("/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await newRequest.get(`/users?search=${search}`);
      console.log(data, "data");
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <ViewIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        centered
      >
        <DialogTitle>
          <Typography variant="h4" align="center">
            {selectedChat.chatName.toUpperCase()}
          </Typography>
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {/* Replace with your modal content */}
          <Typography variant="body1">
            {selectedChat.users.map((u) => (
              <Chip
                key={u._id} // Add a unique key for each user
                label={u.username} // Assuming each user is a string, you can adjust this based on your data structure
                onDelete={() => handleRemove(u)} // Call handleDelete function with the user as an argument
                variant="outlined"
                style={{
                  margin: "4px", // Adjust the margin as needed
                  backgroundColor: "purple", // Add background color
                  color: "white",
                  maxWidth: "100px", // Reduce the width as needed
                }}
                deleteIcon={<CancelIcon style={{ color: "white" }} />}
              />
            ))}
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Chat Name"
              variant="outlined"
              margin="dense"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "8px" }}
              disabled={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </Box>
          <TextField
            fullWidth
            label="Add User to group"
            variant="outlined"
            margin="dense"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
              }}
            >
              loading...
            </div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRemove(user)} color="error">
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
