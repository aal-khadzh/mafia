import { Component } from "react";
import { Input, Button } from "@chakra-ui/core";

const UserLogin = ({ userName, handleChangeUserName, logUser }) => (
  <>
    <Input value={userName} onChange={handleChangeUserName} />
    <Button onClick={logUser}>Log in</Button>
  </>
);

export default UserLogin;
