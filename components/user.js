import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarBadge,
  Box,
  CloseButton,
  Flex,
  Text
} from '@chakra-ui/core';

const avatarDeterminer = role => {
  const url = img => `${window.location.href}static/${img}`;
  switch (role) {
    case 'm':
      return url('maf.svg');
    case 's':
      return url('sh.png');
    case 'h':
      return url('sl.png');
    case 'd':
      return url('doc.png');
    case 'c':
      return url('civ.svg');
  }
};

const User = ({ user, remove }) => (
  <Flex margin="0 8px">
    <Avatar
      showBorder={user.role !== 'm' ? true : false}
      borderColor={user.role !== 'm' ? 'gray.800' : false}
      bg={user.role ? 'white' : 'gray.800'}
      name={user.name}
      src={avatarDeterminer(user.role)}
    >
      <AvatarBadge size="1.25em" bg={user.connected ? 'green.500' : 'tomato'} />
    </Avatar>
    <Box ml="3">
      <CloseButton size="sm" onClick={remove} />
      <Text marginLeft="8px" fontWight="bold">
        {user.name}
      </Text>
    </Box>
  </Flex>
);

User.propTypes = {
  user: PropTypes.object,
  remove: PropTypes.function
};

export default User;
