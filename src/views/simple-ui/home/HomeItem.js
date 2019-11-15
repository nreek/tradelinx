import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from './HomeIcons';

const propTypes = {
  action: PropTypes.node,
  header: PropTypes.string,
  icon: PropTypes.element,
  content: PropTypes.string,
};

class HomeItem extends PureComponent {
  render() {
    return (
      <div className="item">
        <h4 className="text-lightblue bold">{this.props.header}</h4>
        <div className="item-container">
          <div className="icon">
            <div className="icon-inner">{this.props.icon}</div>
          </div>
          <div className="item-content">
            <p className="text-lightblue">{this.props.content}</p>
            <div>{this.props.action}</div>
          </div>
          <div className="check">
            <div className="check-inner">
              <CheckIcon />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomeItem.propTypes = propTypes;

export default HomeItem;
