import React, { useState } from "react";
import Box from "@mui/material/Box";
import SideDrawer from "../../components/miscellaneous/SideDrawer";
import { useChatState } from "../../context/ChatProvider";
import MyChats from "../../components/miscellaneous/MyChats";
import ChatBox from "../../components/miscellaneous/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChatState(); // Use the custom hook useChatState
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        height="91.5vh"
        padding="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
      </Box>
    </div>
  );
};

export default Chatpage;
