import React from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  CloseButton,
  Flex,
  Text
} from "@chakra-ui/core";

const avatarDeterminer = role => {
  const url = img => `${window.location.href}static/${img}`;
  switch (role) {
    case "m":
      return url("maf.svg");
    case "s":
      return url("sh.png");
    case "h":
      return url("sl.png");
    case "d":
      return url("doc.png");
    case "c":
      return url("civ.svg");
  }
};

const User = ({ user: { name, role, connected }, remove }) => (
  <Flex margin="0 8px">
    <Avatar
      showBorder={role !== "m" ? true : false}
      borderColor={role !== "m" ? "gray.800" : false}
      bg={role ? "white" : "gray.800"}
      name={name}
      src={avatarDeterminer(role)}
    >
      <AvatarBadge size="1.25em" bg={connected ? "green.500" : "tomato"} />
    </Avatar>
    <Box ml="3">
      <CloseButton size="sm" onClick={remove} />
      <Text marginLeft="8px" fontWight="bold">
        {name}
      </Text>
    </Box>
  </Flex>
);

export default User;
