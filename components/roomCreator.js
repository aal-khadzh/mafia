import { Input, Checkbox, Button } from '@chakra-ui/core';
import { Component } from 'react';

const RoomCreator = ({
  roomSettings,
  handleChangePlayersQnt,
  handleChangeMafiaQnt,
  handleChangeDocFlag,
  handleChangeHoeFlag,
  createRoom
}) => (
  <>
    <Input
      placeholder="Citizens"
      type="number"
      onChange={handleChangePlayersQnt}
      value={roomSettings.playersQnt}
    />
    <Input
      placeholder="Mafiozi"
      type="number"
      onChange={handleChangeMafiaQnt}
      value={roomSettings.mafiaQnt}
    />
    <Checkbox onChange={handleChangeDocFlag} isChecked={roomSettings.docFlag}>
      Doctor
    </Checkbox>
    <Checkbox onChange={handleChangeHoeFlag} isChecked={roomSettings.hoeFlag}>
      Slut
    </Checkbox>
    <Button onClick={createRoom}>Create</Button>
  </>
);

export default RoomCreator;
