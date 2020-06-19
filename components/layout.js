import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { disableBodyScroll } from 'body-scroll-lock';

export default class Layout extends Component {
  componentDidMount() {
    disableBodyScroll(document.querySelector('body'));
  }

  render() {
    const { children } = this.props;
    return (
      <div className="main">
        <div className="container">{children}</div>
        <style jsx>{`
          .main {
            width: 100vw;
            height: 100vh;
            padding: 200px 0;
          }

          .container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node
};
