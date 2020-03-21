import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic';

import GameSet from '../utils/gameset';
const AppNoSSR = dynamic(() => import('./app'), {
  ssr: false
});

export default class DataFetcher extends Component {
  static async getInitialProps({ req }) {
    let protocol = 'https:';
    let host = req ? req.headers.host : window.location.hostname;
    if (host.indexOf('localhost') > -1) {
      protocol = 'http:';
    }
    const data = await fetch(`${protocol}//${host}/gameset`);
    const initialData = await data.json();
    return { initialData };
  }

  componentDidMount() {
    this.storage = window.location.hostname.includes('localhost')
      ? sessionStorage
      : localStorage;
  }

  render() {
    const { socket, initialData } = this.props;
    return (
      <AppNoSSR
        storage={this.storage}
        initialData={initialData}
        gameSet={new GameSet()}
        socket={socket}
      />
    );
  }
}
