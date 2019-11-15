import React from 'react';
import { PropTypes } from 'prop-types';

/**
 * Component that displays a tooltip to the user.
 *
 * @example
 * <Tooltip
 *   message={'This is the tooltip message displayed to the user.'}
 *   // Position to display the tooltip: top (default), bottom, right or left.
 *   position={'right'}
 * >
 *   <p>{'This is the paragraph that triggers the tooltip.'}</p>
 * </Tooltip>
 *
 */
class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayTooltip: false,
    };
  }

  hideTooltip = () => this.setState({ displayTooltip: false });

  showTooltip = () => this.setState({ displayTooltip: true });

  render() {
    const { message } = this.props;
    const { position } = this.props;
    return (
      <span className="tooltip-container" onMouseLeave={this.hideTooltip}>
        {this.state.displayTooltip && (
          <div className={`tooltip-bubble tooltip-${position}`}>
            <div className="tooltip-message">{message}</div>
          </div>
        )}
        <span className="tooltip-trigger" onMouseOver={this.showTooltip}>
          {this.props.children}
        </span>
      </span>
    );
  }
}

Tooltip.defaultProps = {
  message: '',
  position: 'top',
  children: null,
};

Tooltip.propTypes = {
  /**
   * The message to be displayed as a tooltip.
   */
  message: PropTypes.string.isRequired,
  /**
   * The position where the tooltip will be displayed.
   */
  position: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
  /**
   * The node that will trigger the tooltip display.
   * A node is anything that can be rendered: numbers, strings, elements
   * or an array (or fragment) containing these types.
   */
  children: PropTypes.node.isRequired,
};

export default Tooltip;
