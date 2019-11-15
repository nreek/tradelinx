import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import ErrorBoundary from './ErrorBoundary';

const propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

const defaultProps = {
  className: '',
  onClose: () => {},
};

export const Modal = props => (
  <CSSTransition
    in={props.modal !== 'none'}
    appear
    timeout={500}
    classNames="fade"
  >
    <div
      className={`modal-wrapper ${props.className}`}
      onClick={props.onClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-close-button" onClick={() => {}}>
          <i className="far fa-times" onClick={props.onClose} />
        </div>
        <ErrorBoundary>
          {props.children}
        </ErrorBoundary>
      </div>
    </div>
  </CSSTransition>
);

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

// const mapStateToProps = state => {
//   const { modal } = state.app;
//   return {
//     modal
//   };
// };

export default connect()(Modal);
// mapStateToProps,
// null
