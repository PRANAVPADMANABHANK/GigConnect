import React from "react";
import { Box } from "@mui/material"; // Import MUI Box
import { useChatState } from "../../context/ChatProvider";
import SingleChat from "../userAvatar/SingleChat";
// import "./styles.css";
// import SingleChat from "./SingleChat";
 // Adjust the import based on your context setup

const Chatbox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } = useChatState(); // Use the correct hook to access the context data

  return (
    <Box
      display={{ xs: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      bgcolor="white"
      width={{ xs: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      backgroundColor="#f5f5f5"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
