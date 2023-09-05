import React, { useEffect, useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import newRequest from "../../utils/newRequest";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import AddIcon from "@mui/icons-material/Add";


const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { setSelectedChat, user, selectedChat, chats, setChats } =
    useChatState();

  const fetchChats = async () => {
    try {
      const { data } = await newRequest.get(`/chat`);
      setChats(data);
      console.log(data, "dataaaaas");

      //   onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("currentUser")));
    fetchChats();
  }, []);

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
          <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ xs: "17px", md: "10px", lg: "17px" }}
            endIcon={<AddIcon/>}
          >
            New Group Chat
          </Button>
          </GroupChatModal>
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
    </>
  );
};

export default MyChats;
