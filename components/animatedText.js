import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getAnimatedTextString } from '../utils/gameset';

export default class AnimatedText extends Component {
  state = {
    string: getAnimatedTextString(this.props.gameSet)
  };

  componentDidUpdate(prevProps, prevState) {
    const { gameSet } = this.props;
    if (prevState.string !== getAnimatedTextString(gameSet)) {
      this.setState({ string: getAnimatedTextString(gameSet) });
    }
  }

  render() {
    const { string } = this.state;
    return (
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
              width: 100%
              margin: 0 auto;
              border-right: ${(2 / 44) * string.length}px solid transparent;
              font-size: 100%;
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
                width: 100%
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
  }
}

AnimatedText.propTypes = {
  gameSet: PropTypes.object
};
