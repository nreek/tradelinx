import { createSelector } from 'reselect';

export const config = (state = {}) => state;
export const selectMaxTableRowsBalances = (state = {}) => state.config.simpleUi.maxTableRows.currentBalances;
export const selectExcludeDeposit = (state = {}) => state.config.excludeDeposit;
export const selectExcludeWithdraw = (state = {}) => state.config.excludeWithdraw;
export const selectDefaultDecimalsCrypto = (state = {}) => state.config.defaultDecimals.crypto;
export const selectUsePassword = (state = {}) => state.config.authConfig.settings.usePassword;
export const selectConfig = state => state.config;
export const selectRoutes = state => state.config.routes;

export const selectRoutesWithComponents = createSelector(
  [selectRoutes, (_, props) => props],
  (routes, props) => routes.map((route) => {
    const routeWithComponent = {
      ...route,
      exact: !!route.exact,
      path: route.path || '*',
      component: props.components[route.component],
    };

    if (route.requiresAuth) {
      routeWithComponent.component = props.requiresAuth(routeWithComponent.component);
    }

    return routeWithComponent;
  }),
);

// Chart
export const selectChartConfig = state => state.config.chartConfig;
export const chartType = state => state.config.chartConfig.candleStickChart;
export const chartTheme = state => state.config.chartConfig.theme;
export const chartProvider = state => state.config.chartConfig.TVProvider;
export const chartLegend = state => state.config.chartConfig.hideTVLegend;