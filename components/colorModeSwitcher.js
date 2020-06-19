import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@chakra-ui/core';
import { ColorModeContext } from '../pages/index';

function ColorModeSwitcher({ toggleNigthMode }) {
  return (
    <ColorModeContext.Consumer>
      {({ colorMode }) => (
        <IconButton
          icon={colorMode === 'light' ? 'moon' : 'sun'}
          onClick={() => {
            toggleNigthMode(colorMode === 'dark');
          }}
        />
      )}
    </ColorModeContext.Consumer>
  );
}

ColorModeSwitcher.propTypes = {
  toggleNigthMode: PropTypes.function
};

export default ColorModeSwitcher;
