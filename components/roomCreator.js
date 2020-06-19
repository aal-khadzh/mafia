import React from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Button } from '@chakra-ui/core';

const RoomCreator = ({
  roomSettings,
  onChangePlayersQnt,
  onChangeMafiaQnt,
  onChangeDocFlag,
  onChangeHoeFlag,
  createRoom
}) => (
  <>
    <Input
      placeholder="Citizens"
      type="number"
      onChange={onChangePlayersQnt}
      value={roomSettings.playersQuantity || ''}
    />
    <Input
      placeholder="Mafiozi"
      type="number"
      onChange={onChangeMafiaQnt}
      value={roomSettings.mafiaQuantity || ''}
    />
    <Checkbox onChange={onChangeDocFlag} isChecked={roomSettings.doctorFlag}>
      Doctor
    </Checkbox>
    <Checkbox
      onChange={onChangeHoeFlag}
      isChecked={roomSettings.prostituteFlag}
    >
      Prostitute
    </Checkbox>
    <Button onClick={createRoom}>Create</Button>
  </>
);

RoomCreator.propTypes = {
  roomSettings: PropTypes.object,
  onChangePlayersQnt: PropTypes.function,
  onChangeMafiaQnt: PropTypes.function,
  onChangeDocFlag: PropTypes.function,
  onChangeHoeFlag: PropTypes.function,
  createRoom: PropTypes.function
};

export default RoomCreator;
