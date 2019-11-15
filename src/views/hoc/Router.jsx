import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { selectRoutesWithComponents } from '../../reducers';

const propTypes = {
  routes: PropTypes.array.isRequired,
  components: PropTypes.object.isRequired,
  requiresAuth: PropTypes.func.isRequired,
};

const Router = (props) => {
  const { routes } = props;
  return (
    <BrowserRouter>
      <Switch>
        { routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        )) }
      </Switch>
    </BrowserRouter>
  );
};

Router.propTypes = propTypes;

const mapStateToProps = (state, ownProps) => ({
  routes: selectRoutesWithComponents(state, ownProps),
});

export default connect(
  mapStateToProps,
  null,
)(Router);
