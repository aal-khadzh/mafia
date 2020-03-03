import React from "react";

const Layout = ({ children, adminPage }) => (
  <div className="main">
    <div className="container">{children}</div>
    <style jsx>{`
      .main {
        width: 100vw;
        height: 100vh;
        padding: 10% 0;
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

export default Layout;
