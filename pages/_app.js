import App from 'next/app';
import React from 'react';
import io from 'socket.io-client';

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
    return <Component {...pageProps} socket={this.state.socket} />;
  }
}

export default MyApp;
