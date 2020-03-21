import React from 'react';
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

export default ColorModeSwitcher;
