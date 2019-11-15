import React from 'react';
import { PropTypes } from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Tooltip from './ToolTip';

import '../../scss/elements/copy-text.scss';

/**
 * Component that displays text and copy it by click.
 *
 */
class CopyToClipboard extends React.Component {
  constructor(props) {
    super(props);
  }

  hideTooltip = () => this.setState({ displayTooltip: false });

  copyText = () => {
    const el = document.createElement('textarea');
    el.value = this.props.text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  render() {
    const { text, length } = this.props;

    const formmated = length !== null && text.length > length
      ? `${text.substring(0, length)}...`
      : text;

    return (
      <span className="copy-text">
        <span
          onClick={this.copyText}
          className="element-copy-text"
          data-tip={_t('Click to copy', 'ELEMENT.COPY_TEXT')}
          data-html
        >
          {formmated}
        </span>
        <ReactTooltip />
      </span>
    );
  }
}

Tooltip.defaultProps = {
  text: '',
  length: null,
};

Tooltip.propTypes = {
  /**
   * The text to be displayed.
   */
  text: PropTypes.string.isRequired,
  /**
   * The length of text what we should display.
   */
  length: PropTypes.number,
};

export default CopyToClipboard;
