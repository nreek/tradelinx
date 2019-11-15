import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  name: PropTypes.string,
  onLoad: PropTypes.func,
  allowFullScreen: PropTypes.bool,
  iframeRef: PropTypes.func,
};

const defaultProps = {
  width: '100%',
  height: '100%',
  name: '',
  allowFullScreen: false,
};

class ShiftIframe extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <iframe
        width={this.props.width}
        height={this.props.height}
        ref={this.props.iframeRef}
        frameBorder="0"
        src={this.props.src}
        id={this.props.id}
        className={this.props.className}
        allowFullScreen={this.props.allowFullScreen}
      >
        {this.props.children}
      </iframe>
    );
  }
}

ShiftIframe.propTypes = propTypes;
ShiftIframe.defaultProps = defaultProps;

export default ShiftIframe;
