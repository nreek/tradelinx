import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import ErrorBoundary from '../../elements/ErrorBoundary';
import { toAllCaps } from '../../util/helpers';
import MaintenanceMessage from '../MaintenanceMessage';
import { toDashCase } from '../../util/helpers';
import Sidebar from './Sidebar';
import SimpleUiHeader from './SimpleUiHeader';

import { isMaintenanceMessageEnabled } from '../../reducers';

import '../../../scss/simple-ui.scss';

const propTypes = {
  description: PropTypes.string,
  pageHeader: PropTypes.string,
  translation: PropTypes.string,
  isMaintenanceModeEnabled: PropTypes.bool,
  pageClass: PropTypes.string.isRequired,
};

const defaultProps = {
  isMaintenanceModeEnabled: false,
  pageClass: '',
};

export class SimpleUiWrapper extends Component {
  state = {
    showSidebar: false,
  };

  toggleSidebar = () => this.setState({ showSidebar: !this.state.showSidebar });

  render() {
    const { pageClass, title, translation } = this.props;

    return (
      <div className="simple-ui-container">
        {this.props.isMaintenanceMessageEnabled && <MaintenanceMessage pageType="simple-ui" />}
        <div className="simple-ui">
          <div className={`sidebar-container ${this.state.showSidebar ? 'open' : ''}`}>
            <ErrorBoundary>
              <Sidebar toggleSidebar={this.toggleSidebar} />
            </ErrorBoundary>
          </div>
          <div
            className={`main-container ${pageClass? toDashCase(pageClass) : null}`}
          >
            <ErrorBoundary>
              <SimpleUiHeader
                toggleSidebar={this.toggleSidebar}
                showSidebar={this.state.showSidebar}
              />
            </ErrorBoundary>
            <div className="content-container">
              <div className="page-heading">
                <h2>
                  <strong className="text-lightblue">{_t(this.props.pageHeader, `${translation || toAllCaps(title)}.PAGE_HEADER`)}</strong>
                </h2>
              </div>
              <div className="description">
                <p>
                  {_t(this.props.description, `${translation || toAllCaps(title)}.DESCRIPTION`)}
                </p>
              </div>
              <div className="content">
                <ErrorBoundary>{this.props.children}</ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SimpleUiWrapper.propTypes = propTypes;
SimpleUiWrapper.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isMaintenanceMessageEnabled: isMaintenanceMessageEnabled(state),
});

export default connect(
  mapStateToProps,
  null,
)(SimpleUiWrapper);

// export default SimpleUiWrapper;
