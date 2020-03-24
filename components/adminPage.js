import React from 'react';
import ColorModeSwitcher from './colorModeSwitcher';
import User from './user';
import { Button, Flex } from '@chakra-ui/core';
import PropTypes from 'prop-types';

const AdminPage = ({
  usersList,
  handleRolesAssignment,
  toggleNigthMode,
  handleUserRemoval,
  gameSet,
  reset
}) => {
  return (
    <>
      <Flex
        style={{ position: 'absolute', bottom: 8 }}
        className="adminButtons"
      >
        <Button onClick={reset}>Reset</Button>
        {!gameSet.gameFinished ? (
          <>
            {gameSet.rolesAssigned ? (
              <ColorModeSwitcher toggleNigthMode={toggleNigthMode} />
            ) : (
              <Button onClick={handleRolesAssignment}>Assign</Button>
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
        {!gameSet.gameFinished
          ? usersList.map(user => (
              <User
                key={user.name}
                user={user}
                remove={() => handleUserRemoval(user.name)}
              />
            ))
          : null}
      </Flex>
    </>
  );
};

AdminPage.propTypes = {
  usersList: PropTypes.array,
  handleRolesAssignment: PropTypes.function,
  toggleNigthMode: PropTypes.function,
  handleUserRemoval: PropTypes.function,
  gameSet: PropTypes.object,
  reset: PropTypes.function
};

export default AdminPage;
