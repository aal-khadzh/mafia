import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, useColorMode } from '@chakra-ui/core';

function ColorModeSwitcher({ toggleNigthMode }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === 'light' ? 'moon' : 'sun'}
      onClick={() => {
        toggleColorMode();
        toggleNigthMode(colorMode === 'dark');
      }}
    />
  );
}

ColorModeSwitcher.propTypes = {
  toggleNigthMode: PropTypes.function
};

export default ColorModeSwitcher;
