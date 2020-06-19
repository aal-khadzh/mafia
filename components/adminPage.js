import React from 'react';
import ColorModeSwitcher from './colorModeSwitcher';
import User from './user';
import { Button, Flex } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const AdminPage = ({
  users,
  onRolesAssignment,
  toggleNigthMode,
  onUserRemoval,
  isFinished,
  areRolesAssigned,
  onGameReset
}) => {
  return (
    <>
      <Flex style={{ position: 'absolute', bottom: 8 }}>
        <Button onClick={onGameReset}>Reset</Button>
        {!isFinished ? (
          <>
            {areRolesAssigned ? (
              <ColorModeSwitcher toggleNigthMode={toggleNigthMode} />
            ) : (
              <Button onClick={onRolesAssignment}>Assign</Button>
            )}
          </>
        ) : null}
      </Flex>
      <Flex
        align="center"
        justify="center"
        height="100%"
        padding="10%"
        wrap="wrap"
      >
        {!isFinished
          ? users.map(user => (
              <User
                key={user.name}
                user={user}
                remove={() => onUserRemoval(user.name)}
              />
            ))
          : null}
      </Flex>
    </>
  );
};

AdminPage.propTypes = {
  users: PropTypes.array,
  onRolesAssignment: PropTypes.function,
  toggleNigthMode: PropTypes.function,
  onUserRemoval: PropTypes.function,
  isFinished: PropTypes.boolean,
  areRolesAssigned: PropTypes.boolean,
  onGameReset: PropTypes.function
};

export default AdminPage;
