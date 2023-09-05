import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      borderRadius="lg"
      overflow="hidden"
      transition="background-color 0.3s ease, color 0.3s ease"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      mb={2}
    >
      <Box
        display="flex"
        alignItems="center"
        px={3}
        py={2}
        bg="#E8E8E8"
        color="black"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.username}
          src={user.img}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {user.username}
          </Typography>
          <Typography variant="body2">
            <b>Email:</b> {user.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserListItem;
