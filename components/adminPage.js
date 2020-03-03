import React, { Component } from "react";
import ColorModeSwitcher from "./colorModeSwitcher";
import User from "./user";
import { Button, Flex, Grid } from "@chakra-ui/core";

const AdminPage = ({
  usersList,
  handleRolesAssignment,
  toggleNigthMode,
  handleUserRemoval,
  gameSet: { rolesAssigned, gameFinished },
  reset
}) => {
  return (
    <>
      <Flex
        style={{ position: "absolute", bottom: 8 }}
        className="adminButtons"
      >
        <Button onClick={reset}>Reset</Button>
        {!gameFinished ? (
          <>
            {rolesAssigned ? (
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
        {!gameFinished
          ? usersList.map(user => (
              <User user={user} remove={() => handleUserRemoval(user.name)} />
            ))
          : null}
      </Flex>
    </>
  );
};

export default AdminPage;
