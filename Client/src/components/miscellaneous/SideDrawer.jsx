import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
  Alert,
  CircularProgress, // Import the Alert component from MUI
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuItem from "@mui/material/MenuItem";
import { useChatState } from "../../context/ChatProvider";
import newRequest from "../../utils/newRequest";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useChatState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("warning");
  const [alertMessage, setAlertMessage] = useState("");

  const { setSelectedChat, chats, setChats } = useChatState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      setAlertSeverity("warning");
      setAlertMessage("Please Enter something in search");
      setShowAlert(true);
    }
    try {
      setLoading(true);
      if (search) {
        const data = await newRequest.get(`/users?search=${search}`);
        setLoading(false);
        setSearchResult(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await newRequest.post(`/chat`, { userId });

      // Initialize chats as an empty array if it's undefined
      const initialChats = chats || [];

      // Check if the data._id is not already in chats
      if (!initialChats.find((c) => c._id === data._id)) {
        // Use the spread operator to update chats with the new data
        setChats([data, ...initialChats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      //   onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        padding="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={openDrawer}>
            <i className="fas fa-search"></i>
            <Typography
              variant="body1"
              sx={{ display: { base: "none", md: "flex" }, px: 4 }}
            >
              Search User
            </Typography>
          </Button>
        </Tooltip>
        <Typography fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <NotificationsActiveIcon
              fontSize="large"
              style={{ color: "black" }}
            />
          </IconButton>
          <IconButton
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            <Avatar
              size="small"
              sx={{ cursor: "pointer", marginRight: "5px" }}
              name={user.username}
              src={user.img}
            />
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>{user.username}</MenuItem>
        </Menu>
      </Box>
      <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
        <div style={{ width: 250 }}>
          {" "}
          {/* Set a fixed width */}
          {showAlert && (
            <Alert severity={alertSeverity} onClose={closeAlert}>
              {alertMessage}
            </Alert>
          )}
          <AppBar position="static" sx={{ borderBottom: "1px solid #e0e0e0" }}>
            <Toolbar>
              <Typography variant="h6">Search Users</Typography>
            </Toolbar>
          </AppBar>
          <Box>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "200px",
                }}
              />
              <Button
                onClick={handleSearch}
                sx={{
                  color: "blue",
                  backgroundColor: "transparent",
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.data?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress
                  color="primary" // Change the color to match your theme
                  sx={{ marginRight: "8px" }} // Add custom styling here
                />
              </Box>
            )}
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default SideDrawer;
