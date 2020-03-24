import React from 'react';
import PropTypes from 'prop-types';

const AnimatedText = ({ string }) => (
  <>
    <div className="container">
      <p className="line-1 anim-typewriter">{string}</p>
    </div>
    <style jsx>
      {`
        @import url(https://fonts.googleapis.com/css?family=Anonymous+Pro);

        .container {
          font-family: 'Anonymous Pro', monospace;
        }
        .line-1 {
          width: ${(24 / 44) * string.length}em;
          margin: 0 auto;
          border-right: 2px solid transparent;
          font-size: ${string.length > 15 ? (180 / 44) * string.length : 180}%;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
        }

        /* Animation */
        .anim-typewriter {
          animation: typewriter ${(4 / 44) * string.length}s
              steps(${string.length}) 1s 1 normal both,
            blinkTextCursor 500ms steps(${string.length})
              ${(24 / 44) * string.length} normal;
        }
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: ${(24 / 44) * string.length}em;
          }
        }
        @keyframes blinkTextCursor {
          from {
            border-right-color: transparent;
          }
          to {
            border-right-color: rgb(25, 25, 25);
          }
        }
      `}
    </style>
  </>
);

AnimatedText.propTypes = {
  string: PropTypes.string
};

export default AnimatedText;
