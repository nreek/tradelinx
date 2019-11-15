import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Components
import Swipe from 'react-easy-swipe';
import ErrorBoundary from '../../elements/ErrorBoundary';
import { toAllCaps, toDashCase } from '../../util/helpers';
import MaintenanceMessage from '../MaintenanceMessage';
import { setDisplayMobile } from '../../actions';
import { mobileSetting } from '../../reducers/displayMobile';

import StandardUiNav from './StandardUiNav';
import StandardUiMobileNav from './StandardUiMobileNav';
import StandardUiHeader from './StandardUiHeader';
import StandardUiSidebar from './StandardUiSidebar';

const propTypes = {
  title: PropTypes.string.isRequired,
  translation: PropTypes.string,
};

export class StandardUiWrapper extends Component {
  state = {
    counter: 0,
  };

  componentDidMount = () => {
    this.senseMobileWidth();
    window.addEventListener('resize', this.senseMobileWidth);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.senseMobileWidth);
  };

  senseMobileWidth = () => {
    const windowWidthOuter = window.outerWidth;
    const windowWidthInner = window.innerWidth;

    if (windowWidthInner < 768 || windowWidthOuter < 768) {
      this.props.setDisplayMobile(true);
    } else {
      this.props.setDisplayMobile(false);
    }
  };

  renderChildren = () => {
    const { counter } = this.state;
    return (
      <Swipe
        onSwipeStart={this.onSwipeStart}
        onSwipeMove={this.onSwipeMove}
        onSwipeEnd={this.onSwipeEnd}
      >
        {this.props.children[counter]}
      </Swipe>
    );
  };

  onDotClick = (index) => {
    const arrLength = this.props.children.length - 1;
    const { counter } = this.state;
    if(index === 'left'){
      if (arrLength >= counter && counter > 0) {
      this.setState({
        counter: this.state.counter - 1,
      });
      }
    }
    else if(index === 'right'){
      if (arrLength > counter) {
      this.setState({
        counter: this.state.counter + 1,
      });
      }
    } else {
      this.setState({
        counter: index,
      });
    }
  }

  onSwipeMove = (position, event) => {
    const arrLength = this.props.children.length - 1;
    const { counter } = this.state;

    if (position.x > 100) {
      if (arrLength >= counter && counter > 0) {
        this.setState({
          counter: this.state.counter - 1,
        });
      }
    } else if (position.x < -100) {
      if (arrLength > counter) {
        this.setState({
          counter: this.state.counter + 1,
        });
      }
    }
  };

  render() {
    const isMaintenanceMessageEnabled = this.props.maintenanceMode
      ? this.props.maintenanceMode.enabledMessage
      : false;
    if (!this.props.displayMobile) {
      return (
        <div className="ui-container standard-ui-container">
          {isMaintenanceMessageEnabled && <MaintenanceMessage pageType="standard-ui" />}
          <div className="standard-ui">
            <ErrorBoundary>
              <StandardUiNav />
            </ErrorBoundary>
            <ErrorBoundary>
              <StandardUiHeader />
            </ErrorBoundary>
            <ErrorBoundary>
              <StandardUiSidebar />
            </ErrorBoundary>
            <main className={`standard-ui-content ${this.props.title.toLowerCase()}`}>
              <ErrorBoundary>{this.props.children}</ErrorBoundary>
            </main>
          </div>
        </div>
      );
    }
    return (
      <div className="ui-container standard-ui-container">
        {isMaintenanceMessageEnabled && <MaintenanceMessage pageType="standard-ui" />}
        <div className="standard-ui">
          <ErrorBoundary>
            <StandardUiSidebar />
          </ErrorBoundary>
          <main className={`standard-ui-content ${this.props.title.toLowerCase()}`}>
            <ErrorBoundary>{this.renderChildren()}</ErrorBoundary>
          </main>
          <ErrorBoundary>
            <StandardUiMobileNav onDotClick={this.onDotClick} position={this.state.counter} totalTabs={this.props.children} />
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

StandardUiWrapper.propTypes = propTypes;

const mapStateToProps = state => ({
  displayMobile: mobileSetting(state),
});

const mapDispatchToProps = dispatch => ({
  setDisplayMobile: payload => dispatch(setDisplayMobile(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StandardUiWrapper);
