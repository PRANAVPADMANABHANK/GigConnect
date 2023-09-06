import React, { useEffect, useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import newRequest from "../../utils/newRequest";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import AddIcon from "@mui/icons-material/Add";
import UserListItem from "../userAvatar/UserListItem";
import CancelIcon from "@mui/icons-material/Cancel";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setSelectedChat, user, selectedChat, chats, setChats } =
    useChatState();

  const fetchChats = async () => {
    try {
      const { data } = await newRequest.get(`/chat`);
      setChats(data);

      //   onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("currentUser")));
    fetchChats();
  }, [fetchAgain]);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    console.log(search, "query");
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
  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
      alert("Please fill all the fields")
      return;
    }

    try {
      const {data} = await newRequest.post("/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u)=>u._id))
      })
      setChats([data, ...chats])
      closeModal(); // Close the modal
      alert("New Group Chat Created")
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== delUser._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      // alert("user Already added")
      return; // Early return if user is already added
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <Box
        display={{ xs: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        padding={3}
        bgcolor="white"
        width={{ xs: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          paddingBottom={3}
          paddingRight={3}
          fontSize={{ xs: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <Button
            display="flex"
            fontSize={{ xs: "17px", md: "10px", lg: "17px" }}
            endIcon={<AddIcon />}
            onClick={openModal} // Open the modal when this button is clicked
          >
            New Group Chat
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          padding={3}
          bgcolor="#F8F8F8"
          width="100%"
          height="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <List sx={{ overflowY: "scroll" }}>
              {chats.map((chat) => (
                <ListItem
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  button
                  sx={{
                    backgroundColor:
                      selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                    color: selectedChat === chat ? "black" : "black",
                    px: 3,
                    py: 2,
                    borderRadius: "lg",
                    cursor: "pointer",
                  }}
                >
                  <Typography variant="body1">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          Create Group Chat
        </DialogTitle>
        <DialogContent d="flex" flexDirection="column" alignItems="center">
          {/* Input field 1 */}
          <TextField
            label="Chat Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          {/* Input field 2 */}
          <TextField
            label="Add Users"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </DialogContent>

        {/* selected users */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selectedUsers.map((user) => (
            <Chip
              key={user._id} // Add a unique key for each user
              label={user.username}
              onDelete={() => handleDelete(user)} // Call handleDelete function with the user as an argument
              variant="outlined"
              style={{
                margin: "4px", // Adjust the margin as needed
                backgroundColor: "purple", // Add background color
                color: "white",
                maxWidth: "100px", // Reduce the width as needed
              }}
              deleteIcon={<CancelIcon style={{ color: "white" }} />} // Add a delete icon
            />
          ))}
        </div>
        {/* render searched users */}
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
                handleFunction={() => handleGroup(user)}
              />
            ))
        )}

        <DialogActions>
          {/* <Button onClick={closeModal} color="primary">
            Cancel
          </Button> */}
          <Button onClick={handleSubmit} color="primary">
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyChats;
