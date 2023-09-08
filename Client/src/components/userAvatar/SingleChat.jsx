import React, { useEffect, useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import newRequest from "../../utils/newRequest";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8800";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat } = useChatState();
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await newRequest.get(`/message/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("Error Occured");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', ()=> setTyping(true))
    socket.on('stop typing', ()=> setIsTyping(false))
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      console.log(newMessageRecieved.data.chat._id,"newMessageRecieved")
      if (
        !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.data.chat._id
      ) {
        //notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    console.log(event.target.value, "ooo");
    if (event.key === "Enter" && newMessage) {
      try {
        setMessages("");
        console.log(newMessage, "new message");
        const response = await newRequest.post("/message", {
          content: newMessage,
          chatId: selectedChat._id,
        });

        setNewMessage("");
        socket.emit("new message", response)

        setMessages([...messages, response.data]);
      } catch (error) {
        console.log("Error Occured!");
      }
    }
  };

  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            fontSize={{ xs: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ xs: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ xs: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
          >
            {loading ? (
              <CircularProgress size={70} thickness={2} />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}
          </Box>
          <FormControl isRequired mt={3} fullWidth>
            <TextField
              fullWidth
              id="standard-basic"
              label="Enter a message..."
              variant="standard"
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={sendMessage}
              value={newMessage}
            />
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Typography variant="h6" gutterBottom fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
