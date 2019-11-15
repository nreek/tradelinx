import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';

const propTypes = {
  accordionButton: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  accordionButton: 'Open',
};

class Accordion extends Component {
  state = {
    active: false,
  };

  onClick = () => {
    this.setState({ active: !this.state.active });
  }

  render() {
    const { active } = this.state;
    return (
      <div className={`accordion ${this.state.active ? 'open' : ''} ${this.props.className}`}>
        <button className="accordion-button" onClick={() => this.onClick()}>
          {this.props.accordionButton}
        </button>
        <div className="panel">
          <Fade
            top
            cascade
            collapse
            when={active}
            duration={500}
          >
            {this.props.children}
          </Fade>
        </div>
      </div>
    );
  }
}

Accordion.propTypes = propTypes;
Accordion.defaultProps = defaultProps;

export default Accordion;
