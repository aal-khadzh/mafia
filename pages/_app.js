import App from 'next/app';
import React from 'react';
import io from 'socket.io-client';
import {
  ColorModeProvider,
  theme,
  ThemeProvider,
  CSSReset
} from '@chakra-ui/core';

class MyApp extends App {
  state = {
    socket: null
  };

  componentDidMount() {
    const socket = io();
    this.setState({ socket: socket });
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset></CSSReset>
          <Component {...pageProps} socket={this.state.socket} />
        </ColorModeProvider>
      </ThemeProvider>
    );
  }
}

export default MyApp;
