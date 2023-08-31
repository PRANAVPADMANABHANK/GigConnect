// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonIcon from "@mui/icons-material/Person";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// const Dashboard = () => <h2>Dashboard</h2>;
// const Profile = () => <h2>Profile</h2>;

// const App = () => {
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState("dashboard");
//   const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

//   const handleListItemClick = (item) => {
//     setSelected(item);
//     setOpen(false);
//   };

//   const handleSidebarToggle = () => {
//     setOpen(!open);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setProfileMenuAnchor(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setProfileMenuAnchor(null);
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
//         <List>
//           <ListItem
//             button
//             component={Link}
//             to="/admin/dashboard"
//             onClick={() => handleListItemClick("dashboard")}
//             selected={selected === "dashboard"}
//           >
//             <ListItemIcon style={{
//                 color: selected === "dashboard" ? "blue" : "inherit",
//               }}>
//               <DashboardIcon />
//             </ListItemIcon>
//             <ListItemText primary="Dashboard"
//               style={{
//                 color: selected === "dashboard" ? "blue" : "inherit",
//               }} />
//           </ListItem>
//           <ListItem
//             button
//             component={Link}
//             to="/admin/users"
//             onClick={() => handleListItemClick("profile")}
//             selected={selected === "profile"}
//           >
//             <ListItemIcon style={{
//                 color: selected === "profile" ? "blue" : "inherit",
//               }}>
//               <PersonIcon />
//             </ListItemIcon>
//             <ListItemText primary="Users"
//               style={{
//                 color: selected === "profile" ? "blue" : "inherit",
//               }} />
//           </ListItem>
//         </List>
//       </Drawer>
//       <div style={{ flexGrow: 1, padding: "20px" }}>
//         <AppBar position="static">
//           <Toolbar>
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={handleSidebarToggle}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" style={{ flexGrow: 1 }}>
//               GigConnect Admin
//             </Typography>
//             <IconButton
//               color="inherit"
//               aria-controls="profile-menu"
//               aria-haspopup="true"
//             >
//               <NotificationsIcon />
//             </IconButton>
//             <IconButton color="inherit" onClick={handleProfileMenuOpen}>
//               <AccountCircleIcon />
//             </IconButton>
//             <Menu
//               id="profile-menu"
//               anchorEl={profileMenuAnchor}
//               open={Boolean(profileMenuAnchor)}
//               onClose={handleProfileMenuClose}
//             >
//               <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
//               <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
//             </Menu>
//           </Toolbar>
//         </AppBar>
//         <div style={{ marginTop: "20px" }}>
//           {/* Add your routes here */}
//           {/* <Route path="/" exact component={Dashboard} />
//           <Route path="/profile" component={Profile} /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
