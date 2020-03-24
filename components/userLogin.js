import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '@chakra-ui/core';

const UserLogin = ({ userName, handleChangeUserName, logUser }) => (
  <>
    <Input value={userName} onChange={handleChangeUserName} />
    <Button onClick={logUser}>Log in</Button>
  </>
);

UserLogin.propTypes = {
  userName: PropTypes.string,
  handleChangeUserName: PropTypes.function,
  logUser: PropTypes.function
};

export default UserLogin;
