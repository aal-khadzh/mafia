import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
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

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
