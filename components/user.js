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
import { rolesEnum } from '../utils/gameset';

const avatarDeterminer = role => {
  const url = img => `${window.location.href}static/${img}`;
  switch (role) {
    case rolesEnum.MAFIA:
      return url('maf.svg');
    case rolesEnum.SHERIFF:
      return url('sh.png');
    case rolesEnum.PROSTITUTE:
      return url('pr.png');
    case rolesEnum.DOCTOR:
      return url('doc.png');
    case rolesEnum.CIVILIAN:
      return url('civ.svg');
  }
};

const User = ({ user, remove }) => (
  <Flex margin="0 8px">
    <Avatar
      showBorder={user.role !== rolesEnum.MAFIA ? true : false}
      borderColor={user.role !== rolesEnum.MAFIA ? 'gray.800' : false}
      bg={user.role ? 'white' : 'gray.800'}
      name={user.name}
      src={avatarDeterminer(user.role)}
    >
      <AvatarBadge
        size="1.25em"
        bg={user.isConnected ? 'green.500' : 'tomato'}
      />
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
