import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic';
import {
  useColorMode,
  ColorModeProvider,
  theme,
  ThemeProvider,
  CSSReset
} from '@chakra-ui/core';

export const ColorModeContext = createContext();

const AppNoSSR = dynamic(() => import('../components/app'), {
  ssr: false
});

const ColorModeContextComponent = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

class Fetcher extends Component {
  static async getInitialProps({ req }) {
    let protocol = 'http:';
    let host = req ? req.headers.host : window.location.hostname;
    if (host.indexOf('maphia') > -1) {
      protocol = 'https:';
    }
    const response = await fetch(`${protocol}//${host}/gameset`);
    const initialData = await response.json();
    return { initialData };
  }

  componentDidMount() {
    const { initialData } = this.props;
    this.storage = window.location.hostname.includes('maphia')
      ? localStorage
      : sessionStorage;
    if (!Object.keys(initialData).length && Object.keys(this.storage).length) {
      Object.keys(this.storage).forEach(key => this.storage.removeItem(key));
    }
  }

  render() {
    const { socket, initialData } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ColorModeProvider value={initialData.isNight ? 'dark' : 'light'}>
          <CSSReset></CSSReset>
          <ColorModeContextComponent>
            <AppNoSSR
              storage={this.storage}
              initialData={initialData}
              socket={socket}
            />
          </ColorModeContextComponent>
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

Fetcher.propTypes = {
  socket: PropTypes.any,
  initialData: PropTypes.object
};

ColorModeContextComponent.propTypes = {
  children: PropTypes.node
};

export default Fetcher;
