import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  completed: PropTypes.number, // Number between 0 and 1 (percentage of whole)
};

const HEIGHT = 9;

class ProgressBar extends PureComponent {
  leftBarCap = () => (
    <div
      className="left-bar-cap"
      style={{
        background: this.props.completed === 0 ? null : 'white',
        width: HEIGHT / 2,
        borderTopLeftRadius: HEIGHT / 2,
        borderBottomLeftRadius: HEIGHT / 2,
        border: '1px solid white',
        borderRight: 'none',
      }}
    />
  );

  bar = () => {
    const progressBarSegments = [];
    for (let i = 0; i < 100; i++) {
      progressBarSegments.push(
        <div
          key={i}
          style={{
            width: 1,
            background:
              i / 100 < this.props.completed || this.props.completed >= 1
                ? 'white'
                : null,
          }}
        />,
      );
    }

    return (
      <div
        className="bar"
        style={{
          borderTop: '1px solid white',
          borderBottom: '1px solid white',
          display: 'flex',
        }}
      >
        {progressBarSegments}
      </div>
    );
  };

  rightBarCap = () => (
    <div
      className="right-bar-cap"
      style={{
        background: this.props.completed >= 1 ? 'white' : null,
        width: HEIGHT / 2,
        borderTopRightRadius: HEIGHT / 2,
        borderBottomRightRadius: HEIGHT / 2,
        border: '1px solid white',
        borderLeft: 'none',
      }}
    />
  );

  render() {
    return (
      <div className="progress-bar" style={{ display: 'flex', height: HEIGHT }}>
        {this.leftBarCap()}
        {this.bar()}
        {this.rightBarCap()}
      </div>
    );
  }
}

ProgressBar.propTypes = propTypes;

export default ProgressBar;
