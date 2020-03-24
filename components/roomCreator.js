import React from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Button } from '@chakra-ui/core';

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

RoomCreator.propTypes = {
  roomSettings: PropTypes.object,
  handleChangePlayersQnt: PropTypes.function,
  handleChangeMafiaQnt: PropTypes.function,
  handleChangeDocFlag: PropTypes.function,
  handleChangeHoeFlag: PropTypes.function,
  createRoom: PropTypes.function
};

export default RoomCreator;
