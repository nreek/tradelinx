import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import Accordion from '../../../elements/Accordion';
import { loadAccounts } from '../../../actions';
import { selectBalances, selectProducts } from '../../../reducers';
import { floor } from "../../../util";

export class Balances extends PureComponent {
  componentDidMount() {
    this.props.loadData();
  }

  render() {
    const values = Object.keys(this.props.products);
    const currentBalances = this.props.balances || {};
    return (
      <Accordion
        className={this.props.className}
        accordionButton={(
          <Fragment>
            <i className="fas fa-wallet" />
            {_t('Balances', 'SIDEBAR.BALANCES')}
          </Fragment>
        )}
      >
        <ul>
          {values.map((currency, i) => {
            const { total } = currentBalances[currency] || {};
            const { decimals } = this.props.products[currency];
            return (
              <li key={i}>
                {currency}
                <span>{total ? floor(+total, decimals) : 0}</span>
              </li>
            );
          })}
        </ul>
      </Accordion>
    );
  }
}

const mapStateToProps = state => ({
  balances: selectBalances(state),
  products: selectProducts(state),
});

const mapDispatchToProps = dispatch => ({
  loadData: () => dispatch(loadAccounts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Balances);
