import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import newRequest from "../../../utils/newRequest";

const Dashboard = () => <h2>Dashboard</h2>;
const Profile = () => <h2>Profile</h2>;

const App = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const currentAdmin = JSON.parse(localStorage.getItem("currentAdmin"));

  const handleListItemClick = (item) => {
    setSelected(item);
    setOpen(false);
  };

  const handleSidebarToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = async () => {
    setProfileMenuAnchor(null);
    try {
      await newRequest.post("admin/logout");
      localStorage.setItem("currentAdmin", null);
      navigate("/admin/register"); // clearing the cookie and localStorage
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
        {currentAdmin && (
          <List>
            <ListItem
              button
              component={Link}
              to="/admin/orders"
              onClick={() => handleListItemClick("dashboard")}
              selected={selected === "dashboard"}
            >
              <ListItemIcon
                style={{
                  color: selected === "dashboard" ? "blue" : "inherit",
                }}
              >
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Orders"
                style={{
                  color: selected === "dashboard" ? "blue" : "inherit",
                }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/admin/users"
              onClick={() => handleListItemClick("profile")}
              selected={selected === "profile"}
            >
              <ListItemIcon
                style={{
                  color: selected === "profile" ? "blue" : "inherit",
                }}
              >
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                style={{
                  color: selected === "profile" ? "blue" : "inherit",
                }}
              />
            </ListItem>
          </List>
        )}
      </Drawer>
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              GigConnect Admin
            </Typography>
            {/* <IconButton
              color="inherit"
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <NotificationsIcon />
            </IconButton> */}
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircleIcon />
            </IconButton>
            {currentAdmin ? currentAdmin?.username : ""}
            <Menu
              id="profile-menu"
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              {/* <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem> */}
              {currentAdmin ? (
                <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
              ) : (
                <MenuItem to="/admin/register">Login</MenuItem>
              )}
            </Menu>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: "20px" }}>
          {/* Add your routes here */}
          {/* <Route path="/" exact component={Dashboard} />
          <Route path="/profile" component={Profile} /> */}
        </div>
      </div>
    </div>
  );
};

export default App;
