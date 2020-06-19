import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '@chakra-ui/core';

const UserLogin = ({ username, onChangeUserName, onUserLogIn }) => (
  <>
    <Input value={username} onChange={onChangeUserName} />
    <Button onClick={onUserLogIn}>Log in</Button>
  </>
);

UserLogin.propTypes = {
  username: PropTypes.string,
  onChangeUserName: PropTypes.function,
  onUserLogIn: PropTypes.function
};

export default UserLogin;
