import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Nav from './Nav';
import PolicyViewHeader from './PolicyViewHeader';
import Footer from './Footer';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import BlacklistModal from './BlacklistModal';
import '../../../scss/marketing.scss';
import '../../../images/CRYPTO_BG.svg';

class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: props.blacklistMode ? 'blacklist' : 'none' };
  }


  componentDidMount() {
    window.scrollTo(0, 0)
    if (this.props.location.state && this.props.location.state.modal) {
      this.setState({ modal: this.props.location.state.modal });
    }
  }

  render() {
    return (
      <div id="top">
        <PolicyViewHeader />
        <section className="policy-wrapper">
          <div className="policy-container">
            <div className="policy-header">
              <h1 className="policy-title">Terms and Conditions</h1>
            </div>
            <div className="policy-content">
              <h3>1. General Use</h3>
              <h4>1.1 Eligibility</h4>
              <p>You are only permitted to access the Services if you are an Approved User. This means you must meet all of the following criteria:</p>
              <ul>
                <li>If you are an individual, you must be aged 18 years or older.</li>
                <li>You must have the capacity and, in the case of an entity, be authorised, to enter into and to be bound by the Terms and Conditions and the Privacy Policy.</li>
                <li>You must provide all of the information required to set up a User Account under clause 2.1.</li>
                <li>CoinTrader must be satisfied with the outcome of the identity, fraud, background checks, and other money-laundering and terrorist financing checks it (or any third party) conducts in relation to you at any time.</li>
              </ul>
              <h4>1.2 Your general agreements and promises</h4>
              <p>By accessing the Services, you:</p>
              <ul>
                <li>promise that, if you are an individual, you are aged 18 years or older with the capacity to enter into and be bound by the Terms and Conditions and the Privacy Policy;</li>
                <li>promise that, if you are an entity, you have capacity, and are authorised, to enter into and be bound by the Terms and Conditions and the Privacy Policy; and the person acting on your behalf is authorised to do so;</li>
                <li>authorise CoinTrader to make any inquiries it considers necessary, from time to time, to verify your identity, undertake fraud checks, and to meet its anti-money laundering and other legal obligations;</li>
                <li>agree to being bound by the Terms and Conditions and our Privacy Policy, which is deemed to occur when you access our Site and/or use our Services, and promise to comply with them;</li>
                <li>promise to pay all fees associated with the Transactions and the Services which are set out in the Fee Schedule and any additional miner fees.</li>
                <li>promise to ensure that any personal information you provide to CoinTrader is accurate, current and complete and relates solely to you, and to update us if it changes;</li>
                <li>promise to provide us with any additional information which we request to comply with our legal responsibilities as soon as is reasonably practicable; </li>
                <li>confirm that you have sufficient knowledge of Digital Currencies to enter into Transactions, and understand that you are solely responsible for determining the nature, potential value, suitability, and appropriateness of the Services;</li>
                <li>confirm that you accept the risks of using the Services and accessing the Site, and have read and understand the “Risks of Use” set out here;</li>
                <li>agree to arbitration on the terms set out in clause 16.2 (Arbitration) of these Terms and Conditions; and</li>
                <li>acknowledge that CoinTrader has not advised you to, nor recommended to you that you should, use the Services or deal in Digital Currencies.</li>
              </ul>
              <h3>2. Your User Account</h3>
              <h4>2.1 Creating a User Account</h4>
              <p>To use the Services, you must first create your registered User Account and have it activated. </p>
              <ul>
                <li>To set up your User Account you must provide your name, an e-mail address, set a password and affirm your acceptance of these Terms and Conditions and the Privacy Policy by clicking the “Sign Up” button. We also strongly recommend that you enable the “2-factor authentication” option in the ‘Security Settings’. </li>
                <li>
To have your User Account activated, we must receive the following verified information:
                  <ul>
                    <li>for an individual, your full name, gender, date of birth and occupation, and driver’s licence or passport number</li>
                    <li>for an entity, your legal registration number and GST registration number (if applicable)</li>
                    <li>your phone number</li>
                    <li>your residential or business address and previous addresses</li>
                    <li>confirmation as to whether you are the beneficial owner of the account (that is, confirmation that are you the sole person who exercises effective control over the account and owns the account) and, if not, the equivalent information for each other beneficial owner of the account</li>
                    <li>any additional information, such as photo identification, needed to comply with laws (such as enhanced due diligence requirements under the anti-money laundering laws, or source of funds information).</li>
                  </ul>
                </li>
              </ul>
              <h4>2.2 Purpose of your User Account</h4>
              <p>Once established, you can access the Services through your User Account. Specifically, your User Account:</p>
              <ul>
                <li>is linked to your Legal Tender Account and your Digital Currency Wallet (see clauses 3 and 4 below); and</li>
                <li>contains a record of your Transactions. </li>
              </ul>
              <p>We recommend that you only log into your User Account directly through the CoinTrader Site and only access the CoinTrader Exchange through the trading site. This will minimise the risk of you inadvertently exposing your User Account or CoinTrader Wallets to unauthorised access or attacks.</p>
              <h4>2.3 Your promises in relation to your User Account</h4>
              <p>You promise:</p>
              <ul>
                <li>to create a strong password for your User Account. This means you must select a password which is different from any other password you use for any other website or online service, and which cannot be easily guessed. You must change your password at regular intervals, and immediately if you suspect your password has been compromised;</li>
                <li>to keep your User Account login and password and any forms of multi-factor authentication confidential and separate from each other, as well as separate from any other information or documents relating to your User Account or CoinTrader Wallets (and your private key(s)); </li>
                <li>not to let any person access your User Account or your CoinTrader Wallets at any time without our prior written permission; </li>
                <li>not to leave your computer, phone or other device unattended while you remain logged in to your User Account or your CoinTrader Wallets;</li>
                <li>not to open more than one User Account without our prior written permission; and</li>
                <li>to notify us immediately if you identify or suspect any unauthorised access of your User Account or your CoinTrader Wallets. </li>
              </ul>
              <h4>2.4 Your confirmations in relation to your User Account</h4>
              <p>You confirm that:</p>
              <ul>
                <li>CoinTrader may make inquiries directly or through third parties which we consider necessary to verify your identity and/or to protect against fraud, terrorism financing or money-laundering;</li>
                <li>you understand that you are responsible for maintaining the security of your User Account login and password, any forms of multi-factor authentication and your private key(s); </li>
                <li>you understand that anyone accessing your User Account will be able to enter into Transactions using your CoinTrader Wallets, and CoinTrader has no obligation to verify or take any steps to verify any instruction received from you or appearing to be sent by you; and</li>
                <li>you understand that, by using the Services, you are fully responsible for and accept all risks of unauthorised access to your User Account or to your CoinTrader Wallets which is caused by your negligence or breach of these Terms and Conditions. </li>
              </ul>
              <h3>3. Your Legal Tender Account</h3>
              <h4>3.1 Purpose of your Legal Tender Account</h4>
              <p>You can use your Legal Tender Account to fund the purchase of Digital Currencies, and to receive the proceeds of sale of your Digital Currencies, using the Services.</p>
              <h4>3.2 Activating your Legal Tender Account</h4>
              <p>To activate your Legal Tender Account, you must:</p>
              <ul>
                <li>link it to a registered bank account in your name; and</li>
                <li>transfer funds from that bank account to the CoinTrader Custodial Bank Account which will then be reflected by an update to the balance of your Legal Tender Account.</li>
              </ul>
              <h4>3.3 Currency</h4>
              <p>The only Legal Tender which can currently be held in your Legal Tender Account is South African Rand.</p>
              <h4>3.4 Fees</h4>
              <p>CoinTrader will not charge any fees in relation to deposits into or withdrawals from the CoinTrader Custodial Bank Account.</p>
              <h4>3.5 Operation of your Legal Tender Account</h4>
              <ul>
                <li>CoinTrader will maintain a separate bank account in the name of NZGT with ANZ (the CoinTrader Custodial Bank Account). </li>
                <li>The funds you transfer to the CoinTrader Custodial Bank Account will be pooled with funds transferred into it by other Approved Users.</li>
                <li>We undertake to you that the credit balance of the CoinTrader Custodial Bank Account will at all times be an amount equal to the aggregate value of the amount of Legal Tender transferred to and received in clear funds to that account by all Approved Users at that time, less the amount of any fees at that time.</li>
                <li>You will have no right to earn interest on the amount of Legal Tender reflected in your Legal Tender Account. CoinTrader will retain the amount of any interest earned on the balance of the CoinTrader Custodial Bank Account to cover costs incurred in operating the account and providing the Services.</li>
                <li>Once CoinTrader confirms receipt of Legal Tender from you in cleared funds into the CoinTrader Custodial Bank Account, the value of the transferred Legal Tender less any applicable fees will be credited to your Legal Tender Account as soon as is practicable.</li>
                <li>CoinTrader will not use, nor permit the use, of any of the funds held in the CoinTrader Custodial Bank Account for any corporate purpose, nor charge or encumber it in any manner. We will require the account bank to waive its set-off rights in respect of the CoinTrader Custodial Bank Account.</li>
                <li>Please note that Legal Tender held in the CoinTrader Custodial Bank Account is not money deposited with or lent to or owing by CoinTrader to you. Upon transferring any Legal Tender into the CoinTrader Custodial Bank Account, the legal rights to those funds will be vested in the account holder, as account holder. You will have a beneficial right to funds in the CoinTrader Custodial Bank Account equal to the face value of the credit balance of your Legal Tender Account, less any fees you owe to CoinTrader  The funds in the CoinTrader Custodial Bank Account are owed to the account holder by the account bank.</li>
                <li>When you authorise a withdrawal from your Legal Tender Account, CoinTrader will immediately debit your Legal Tender Account for the withdrawn amount. Funds will be received into your nominated bank account within three (3) business days, net of any applicable bank fees and CoinTrader fees.</li>
                <li>We will send you an email confirmation of all deposits into or withdrawals from your Legal Tender Account.</li>
                <li>Certain deposit or withdrawal requests may not be processed outside of normal banking hours. We will typically process deposits and withdrawals within one (1) business day.</li>
                <li>You are not permitted to charge or to use your entitlement to funds in the CoinTrader Custodial Asset, or your rights to your Legal Tender Account, as security for any purpose.</li>
              </ul>
              <h4>3.6 Your confirmations in relation to your Legal Tender Account</h4>
              <p>You confirm you understand that:</p>
              <ul>
                <li>you alone are permitted to access your Legal Tender Account, and to transfer funds to it and to withdraw funds from it;</li>
                <li>if you have initiated a Transaction which will involve the application of funds from your Legal Tender Account, those funds will be held and unavailable for other use from the time you initiate the Transaction until the time it has settled or been cancelled; and</li>
                <li>the credit balance of your Legal Tender Account is not guaranteed by CoinTrader nor any other person (including, for the avoidance of doubt, any South African government-backed deposit insurance scheme or any bank or insurer).</li>
              </ul>
              <h3>4. Your Digital Currency Wallet</h3>
              <h4>4.1 Purpose of your Digital Currency Wallet</h4>
              <p>Your Digital Currency Wallet allows you to send supported Digital Currencies to, and to receive and store supported Digital Currencies from, third parties on your instructions, using the Services.</p>
              <h4>4.2 Supported Digital Currencies</h4>
              <ul>
                <li>CoinTrader currently supports the list of Digital Currencies reflected on our exchange site. However, the nature of the Digital Currencies that CoinTrader supports is subject to change, and could change without notice to you if this is required as a result of law, any order of a court of governmental agency, any change to the operating rules in the underlying Digital Currency ’s network, or any technological issue outside of our reasonable control.</li>
                <li>CoinTrader does not support any other protocols such as metacoins, coloured coins, side chains, or other derivative, enhanced or forked protocols, tokens or coins which supplement or interact with a Digital Currency supported by CoinTrader </li>
              </ul>
              <h4>4.3 Fees</h4>
              <p>CoinTrader will charge the Transaction fees.</p>
              <p>In addition, all Transactions need to be confirmed by ‘miners’ which group transactions into ‘blocks’ and add those blocks to the relevant network underlying the specific Digital Currency. When making a Digital Currency Deposit, you may need to pay the applicable ‘miner fee’ (i.e. network fee) to confirm the transaction on the network. To do this, you need to make sure your transaction includes a sufficient miner fee to be confirmed. Insufficient fees will delay the processing of a Transaction. CoinTrader may charge miner fees to process a Digital Currency withdrawal on your behalf. If we do so, CoinTrader will calculate the miner fee in our discretion and notify you of the amount of the fee at or before the time you authorise the Transaction.</p>
              <h4>4.4 Operation of your Digital Currency Wallet</h4>
              <ul>
                <li>We will send you an email confirmation of all transactions relating to your Digital Currency Wallet. </li>
                <li>CoinTrader securely stores all Digital Currency private keys in our control in a combination of online and offline storage. As a result, it may be necessary for CoinTrader to retrieve certain information from offline storage in order to facilitate a Digital Currency Transaction in accordance with your instructions. This may delay the initiation or crediting of the relevant Digital Currency Transaction for up to 48 hours, or longer in some circumstances. </li>
              </ul>
              <h4>4.5 Your confirmations in relation to your Digital Currency Wallet</h4>
              <p>You confirm that you understand and accept the following:</p>
              <ul>
                <li>CoinTrader will process your Transactions in accordance with your instructions, and you should carefully verify all instructions before placing any Orders. If there is an error in those instructions, then that is your risk and CoinTrader does not accept any responsibility or liability.</li>
                <li>
When you transact with another Approved User through the Site (a Counterparty), there is a risk that the Counterparty may cancel the Transaction before the order is executed. You understand that CoinTrader cannot require a Counterparty to complete any Transaction and is not responsible for liable for any such Counterparty default. If you believe a Counterparty has behaved in a misleading or fraudulent manner, or otherwise in breach of these Terms and Conditions, please notify us immediately at
                  <a className="support-email">support@domainname.com</a>
                  {' '}
so that we can determine what action, if any, to take.
                </li>
                <li>Your Digital Currency Wallet is available only in connection with the Digital Currencies that CoinTrader supports at any time, in its discretion. As set out in clause 4.3 above, these supported Digital Currencies are subject to change. CoinTrader assumes no responsibility or liability for any attempt to use your Digital Currency Wallet for Digital Currencies that CoinTrader does not support at that time.</li>
                <li>CoinTrader does not control or own any of the underlying networks or software protocols that govern the operation of the Digital Currencies supported by CoinTrader </li>
                <li>CoinTrader does not stand behind or underwrite any Transaction you enter into using the CoinTrader exchange.</li>
                <li>A Digital Currency Withdrawal may be delayed as a result of CoinTrader retrieving information from offline storage.</li>
                <li>CoinTrader has the right to refuse to process or to cancel any pending Order or Transaction at any time if it is required to do so at law or in response to a court or government order, or to enforce transaction limits, or if any Suspension Event occurs.</li>
                <li>Digital Currencies are a risky asset class and trading in Digital Currencies increases those risks.</li>
                <li>The amount or value of the Digital Currencies in your Digital Currency Wallet is not guaranteed or underwritten by CoinTrader nor by any other person, and you could lose the Digital Currencies, or the value of the Digital Currencies, stored in your Digital Currency Wallet in a short period of time. In that case, you will have no recourse to CoinTrader or to any other person for your loss (including loss of profit), or any liability or inconvenience that results.</li>
              </ul>
              <h3>5. CoinTrader Ledger </h3>
              <p>CoinTrader maintains a private exchange ledger (the CoinTrader Ledger) to track each Approved User’s Legal Tender Account balance and the Digital Currencies reflected in his or her Digital Currency Wallet. </p>
              <p>Entries in the CoinTrader Ledger are not recorded on a blockchain or otherwise published. Only transfers of Digital Currencies into, or transfers of Digital Currencies out of, your Digital Currency Wallet will be confirmed and visible on a blockchain.</p>
              <h3>6. CoinTrader Transactions</h3>
              <h4>6.1 Transaction Services</h4>
              <p>CoinTrader offers Approved Users the ability to enter into the following Transactions in accordance with these Terms and Conditions:</p>
              <ul>
                <li>Buy Transactions</li>
                <li>Sell Transactions; and</li>
                <li>Exchange Transactions.</li>
              </ul>
              <p>CoinTrader does not currently offer any margin trading, options trading, or shorting.</p>
              <p>CoinTrader does not make any warranty or representation in relation to any Counterparty and cannot confirm that a Counterparty will perform its Transaction obligations.</p>
              <p> Please note: A Transaction is not complete while it is in a pending state. Funds associated with Transactions that are in a pending state will be designated as such and will not be available to conduct other Transactions (including withdrawals).</p>
              <h4>6.2 Access to Transaction Services</h4>
              <p>We can impose any conditions or restrictions on your access to the Transaction Services at any time without prior notice. These may include limits on the number or value of Transactions.</p>
              <h4>6.3 Transaction Limits</h4>
              <p>We may impose Transaction limits from time to time. In particular, we reserve the right to review any withdrawals and to request further information before releasing funds for regulatory and fraud prevention purposes.</p>
              <h4>6.4 Cancellation of Transactions</h4>
              <p>You cannot revoke or cancel an Order once you have placed it. However, you can submit a request to cancel the Transaction to which that Order relates by clicking on the ‘Cancel Sells’ or ‘Cancel Buys’ or ‘Cancel All’ button (as appropriate) on the CoinTrader Exchange dashboard (a Cancellation Request).</p>
              <p>The Cancellation Request will only be effective if you submit it before the Order is filled.</p>
              <p>However, CoinTrader can unilaterally cancel any Transaction if:</p>
              <ul>
                <li>it considers this necessary or prudent due to a suspicion that the Transaction involves money laundering, terrorist financing or another illegal activity;</li>
                <li>it relates to a Prohibited Use; or</li>
                <li>it is required to do so by a court order or government agency.</li>
              </ul>
              <h4>6.5 Transaction Records</h4>
              <p>CoinTrader maintains the records of these offers in our Order Book. When CoinTrader s trading engine matches buy and sell offers in our order book, we record the trade on our CoinTrader Ledger. This transfers ownership of the seller’s traded Digital Currencies to the relevant buyer.</p>
              <h3>7. Buy Transactions</h3>
              <h4>7.1 Nature of a Buy Transaction</h4>
              <p>All Buy Transactions:</p>
              <ul>
                <li>involve the purchase of supported Digital Currencies with Currency from your Currency Account at the Market Rate; and</li>
                <li>settle immediately, provided a sufficient amount of Currency has been pre-loaded to your Legal Tender Account; and</li>
                <li>are recorded on our CoinTrader Ledger.</li>
              </ul>
              <h4>7.2 Buy Transaction process</h4>
              <ul>
                <li>You can place an order to buy Digital Currency (a Buy Order) on the CoinTrader Exchange. By doing so, you authorise CoinTrader to initiate debits from the applicable CoinTrader Wallet and initiate a transfer to your Digital Currency Wallet.</li>
                <li>When you place a Buy Order, the full amount of purchase price and associated fees in Currency will be placed on hold or marked as pending in your Legal Tender Account. This means you cannot withdraw or use those funds for any other purpose until the Buy Transaction settles, expires or is cancelled.</li>
                <li>After your Buy Order has been placed, we will send you an email when it has completed, or if it has only been partially filled, as applicable.</li>
                <li>We will use all reasonable efforts to fulfil any Buy Order. However, if we cannot fulfil your Buy Order, we may notify you by email and seek your order to fulfil the Buy Order at the Market Price.</li>
                <li>CoinTrader reserves the right to unilaterally cancel any unfilled portion of any Buy Order that changes the best bid or best offer by more than twenty percent (20%) in either direction, or is otherwise clearly erroneous.</li>
              </ul>
              <h4>7.3  Buy Limits</h4>
              <p>You can enter a Stop Limit or an Order Limit for your Buy Transaction on the CoinTrader Exchange dashboard.</p>
              <h4>7.4 Partial completion</h4>
              <p>If a Buy Transaction order only partially fills, the amount of Currency required to settle the balance (including fees) will remain on hold until the remaining Buy Order is filled, expires, or is cancelled.</p>
              <h4>7.5 Your confirmations in relation to Buy Transactions</h4>
              <p>In placing any Buy Order or entering into any Buy Transaction, you confirm your understanding of, and your agreement to, the following:</p>
              <ul>
                <li>It is your responsibility to confirm the Buy Transaction details are accurate, including the number of Digital Currencies you intend to buy, the amount of any fees, the gross purchase price for your Buy Order, and the amount and nature of the Digital Currencies to be transferred into your Digital Currency Wallet after completion</li>
                <li>Once placed, a Buy Order cannot be revoked; it can only be cancelled by submitting a separate cancellation request</li>
                <li>It is solely your responsibility to cancel any Buy Order (or part of Buy Order) that you do not want filled</li>
                <li>If you place a Buy Order, there is a risk that it will be filled (in whole or part) if you have a positive balance in your Legal Tender Account before any cancellation request is received</li>
                <li>CoinTrader has no liability or responsibility to you in the above circumstances. (This does not limit the other terms in these Terms and Conditions)</li>
              </ul>
              <h3>8. Sell Transactions</h3>
              <h4>8.1 Nature of a Sell Transaction</h4>
              <p>All Market Sell Transactions:</p>
              <ul>
                <li>involve the sale of supported Digital Currencies for Currency at the Market Price;</li>
                <li>settle immediately from a pre-funded Digital Currency Wallet; and</li>
                <li>are recorded on our CoinTrader Ledger.</li>
              </ul>
              <h4>8.2 Sell Transaction process</h4>
              <ul>
                <li>You can place an order to sell Digital Currency (a Sell Order) on the CoinTrader Exchange. By doing so, you authorise CoinTrader to initiate debits from your applicable Digital Currency Wallet and initiate a transfer to the applicable CoinTrader Wallet.</li>
                <li>When you place a Sell Order, the full amount of Digital Currencies offered for sale are placed on hold in your Digital Currency Wallet. This means you cannot deal with those Digital Currencies for any other purpose until the Sell Transaction settles, expires or is cancelled. Any fees associated with the Sell Transaction will be deducted by CoinTrader from the sale proceeds before they appear in your Legal Tender Account.</li>
                <li>After you have placed your Sell Order, we will send you an email when it has completed, or if it has only been partially filled, as applicable.</li>
                <li>CoinTrader reserves the right to unilaterally cancel any unfilled portion of any Sell Order that changes the best bid or best offer by more than twenty percent (20%) in either direction, or is otherwise clearly erroneous.</li>
              </ul>
              <h4>8.3 Sell Limits</h4>
              <p>You can enter a Stop Limit or an Order Limit for your Sell Transaction on the CoinTrader Exchange dashboard.</p>
              <h4>8.4 Partial completion</h4>
              <p>Until the Sell Order fills, expires or is cancelled, the value of the Digital Currencies being offered for sale will not be available to be used for any other purpose, including other sell orders or withdrawals. For partially filled sell orders, the unfilled portion of Digital Currencies offered for sale will remain on hold until the remaining sell order is filled, expires, or is cancelled.</p>
              <h4>8.5 Your confirmations in relation to Sell Transactions</h4>
              <p>In placing any Sell Order or entering into any Buy Transaction, you confirm your understanding of, and agreement to, the following:</p>
              <ul>
                <li>It is your responsibility to confirm the Sell Transaction details are accurate, including the number of Digital Currencies you intend to sell, the amount of any fees, the gross sale price, and the net sale proceeds to be transferred to your Legal Tender Account</li>
                <li>Once placed, a sell order cannot be revoked and is only able to be cancelled by submitting a separate cancellation request</li>
                <li>It is solely your responsibility to cancel any Sell Order (or part of any Sell Order) that you do not want filled</li>
                <li>If you place a Sell Order, then there is a risk that it will be filled (in whole or part) if you have Digital Currencies in your Digital Currency Wallet before any cancellation request is received</li>
                <li>CoinTrader has no liability or responsibility to you in the above circumstances. (This does not limit the other terms in these Terms and Conditions)</li>
              </ul>
              <h3>9. CoinTrader Exchange </h3>
              <ul>
                <li>The CoinTrader Exchange operates order matching engines for each trading pair. CoinTrader  Our marketplace operates 24 hours a day, seven days a week (except for brief maintenance periods).</li>
                <li>We require that all trades be pre-funded (that is, you must have sufficient funds in your applicable CoinTrader Wallet before you can trade).</li>
              </ul>
              <h3>10. Suspension</h3>
              <h4>10.1 Suspension Events</h4>
              <p>CoinTrader may suspend the Services in any of the following cases without prior notice for any period it determines in its discretion (each a Suspension Event) if it considers it necessary or desirable to do so:</p>
              <ul>
                <li>as a result of any Prohibited Use;</li>
                <li>following a “hard fork” or other sudden change in operating rules in any underlying digital asset network</li>
                <li>following a force majeure event or a market disruption event</li>
                <li>to comply with law, whether or not following a change in applicable law or regulator guidance</li>
              </ul>
              <h4>10.2 Consequences of a Suspension Event</h4>
              <ul>
                <li>If a Suspension Event occurs, CoinTrader can suspend one or more Services to one or more (or all) Approved Users for so long as CoinTrader determines, in good faith, as is required or prudent in view of the interests of CoinTrader and its Approved Users (or affected Approved Users).</li>
                <li>CoinTrader will not be liable to any Approved User or other person for any loss (including any loss of profit), liability or inconvenience arising as a result of any Suspension Event, or the suspension of any Services or access to the Site arising from action taken following a Suspension Event.</li>
                <li>If CoinTrader considers that it is practicable and prudent for it to do so in the circumstances of the Suspension Event, and in view of the interests of CoinTrader and its Approved Users (or the affected Approved Users), it will give you the opportunity to withdraw your Digital Currencies from your Digital Currency Wallet and transfer them to another service (that is, a service which is not provided by CoinTrader .</li>
              </ul>
              <h3>11. No Prohibited Use</h3>
              <h4>11.1 Prohibited Use</h4>
              <p>It is prohibited to use the Site or to access any Service for any of the following purposes or uses (each a Prohibited Use):</p>
              <ul>
                <li>To conduct or engage in any illegal activity;</li>
                <li>To hide or disguise the proceeds of any illegal activity;</li>
                <li>To infringe our proprietary intellectual property, or the proprietary intellectual property of any other person;</li>
                <li>To engage in gambling;</li>
                <li>In relation to any Digital Currency that CoinTrader does not support at the relevant time;</li>
                <li>To engage in any deceptive, fraudulent or malicious activity, including by launching malware or viruses, or seeking to hack into any Wallets or steal any Digital Currencies or funds held by any other Approved User;</li>
                <li>To reverse-engineer, decompile, disable, or disassemble any software running on the Site;</li>
                <li>To promote any securities;</li>
                <li>To harm CoinTrader  any person associated with CoinTrader  or any third party;</li>
                <li>If you are not an Approved User;</li>
                <li>To offer, or to purport to offer, any Service to any person who is not an Approved User; or</li>
                <li>To engage in any other use or activity which breaches these Terms and Conditions.</li>
              </ul>
              <h4>11.2 Consequences of engaging in any Prohibited Use</h4>
              <p>CoinTrader may block or refuse any person (including any Approve User) from accessing the Site and/or any Services or any Transaction if it believes in good faith that such person, Service or Transaction is connected with any Prohibited Use. CoinTrader does not need to provide any prior notice or explanation if it invokes this right.</p>
              <h3>12. Our Rights and Remedies</h3>
              <h4>12.1 Additional rights</h4>
              <p>In addition to exercising our rights under clause 10 (Suspension) and/or clause 11 (No Prohibited Use), in the event we believe you have breached or are breaching any of these Terms and Conditions or any applicable law, we may do any of the following:</p>
              <ul>
                <li>limit your access to or activities on the Site;</li>
                <li>warn any Users or Approved Users of your actions;</li>
                <li>issue a warning to you;</li>
                <li>suspend or cancel your access to the Sites;</li>
                <li>advise any regulators and co-operate fully with any law enforcement authorities which may include disclosing information we hold about you about you.</li>
              </ul>
              <h4>12.2 Additional rights</h4>
              <p>This clause 12 does not limit any of our other rights and remedies at law.</p>
              <h3>13. Our fees</h3>
              <h4>13.1 You agree to pay fees</h4>
              <p>You agree to pay all fees associated with or incurred by you in connection with the Orders you place, the Transactions you complete and the other Services we provide you.</p>
              <h3>14. Taxes</h3>
              <h4>14.1 You are responsible for paying all applicable taxes</h4>
              <p>It is your responsibility to determine what, if any, taxes you must pay in relation to the Transactions and on any of the Digital Currencies you hold in your Digital Currency Wallet, or otherwise. </p>
              <h4>14.2 CoinTrader makes no representations in relation to tax liabilities</h4>
              <p>CoinTrader makes no representation as to your tax liabilities, or the tax liabilities of any other Approved User.</p>
              <h4>14.3 CoinTrader assumes no tax liability to any Approved User</h4>
              <p>CoinTrader assumes no responsibility for the tax liability of you or any other Approved User, not for collecting, reporting, withholding or remitting any taxes arising from any Transactions that you may enter into.</p>
              <h3>15. Liability and Indemnity</h3>
              <h4>15.1 Exclusion of liability</h4>
              <p>To the extent permitted by law, CoinTrader and its related companies exclude all liability and responsibility for any loss, damages, costs or expense, whether in tort (including negligence), contract or otherwise and whether direct, indirect, or consequential (including in connection with business interruption), which you or any other person may suffer or incur in connection with the Services the use or inability to use the Site, and in respect of any Digital Currency or otherwise.</p>
              <p>Where and to the extent liability for breach or any implied warranty or condition, or otherwise, cannot be excluded, CoinTrader s liability to you is limited (at your option) to:</p>
              <ul>
                <li>the total amount of the fees we have earned from you as a result of supplying the Services to you; or</li>
                <li>the supply of the Services to you again.</li>
              </ul>
              <p>CoinTrader is not liable in any way whatsoever to you or anyone else for any financial decision or action taken by you or anyone else using the Services.</p>
              <p> Important: In providing the Services, CoinTrader is required to provide certain guarantees that cannot be excluded under consumer law, if you are using the Services for personal use, including guarantees as to the acceptable quality and fitness of purpose of the Services. Nothing in these Terms will be read or applied so as to exclude, restrict or modify or have the effect of excluding, restricting or modifying any condition, warranty, guarantee, right or remedy implied by the law and which by law cannot be excluded, restricted or modified, even if any other provision of these Terms and Conditions would otherwise suggest that this might be the case.</p>
              <h4>15.2 No warranty</h4>
              <p>To the extent permitted by law we do not warrant the reliability, availability, accuracy, completeness or timeliness of information on the Site. All information is provided “as is” without warranty of any kind, express or implied. This includes (but is not limited to) implied warranties of merchantability, fitness for a particular purpose, title or non-infringement.</p>
              <h4>15.3 CoinTrader s liability is limited</h4>
              <p>Without limiting the other terms in these Terms and Conditions, you acknowledge that CoinTrader bears no liability for any damage, loss (including loss of profit), delay or inconvenience, or failure in performance or interruption of Service or Transaction, in each case caused by or resulting from (directly or indirectly):</p>
              <ul>
                <li>any computer virus, spyware, scareware, Trojan horse, worms or other malware or cyber, phishing or spoofing attack that may affect your computer or other device, or the data held by CoinTrader pan&gt; (including in respect of your CoinTrader Wallet);</li>
                <li>any cause or condition beyond our reasonable control, including but not limited to, any delay or failure due to any act of God, act of civil or military authority, act of terrorism, civil disturbances, war, strike or other labour dispute, fire, interruption in telecommunications or internet services or network provider services, failure of equipment or software, cyber-attack, or other occurrence or catastrophe;</li>
                <li>any “hard fork”, “soft fork”, or other change in the operating rules of an underlying Digital Currency network;</li>
                <li>our good faith election not to support an unsupported branch of a forked protocol, or to configure or reconfigure our systems as a result of the forked protocol or other change to the operating rules;</li>
                <li>any suspension of Services following a Suspension Event or as otherwise permitted under these Terms and Conditions;</li>
                <li>inaccurate Orders being placed; and/or</li>
                <li>you not meeting your legal obligations, including your tax obligations.</li>
              </ul>
              <h4>15.4 Indemnity</h4>
              <p>Each User and Approved User indemnifies CoinTrader and holds CoinTrader harmless for any loss, cost, liability or expense sustained or incurred by it as a result of the relevant User or Approved User breaching these Terms and Conditions, including by:</p>
              <ul>
                <li>engaging in any Prohibited Use;</li>
                <li>any other breach by you of the Terms and Conditions or of the Privacy Policy; and/or</li>
                <li>any reliance by you on any information obtained through the Site.</li>
              </ul>
              <h3>16. Complaints and Disputes</h3>
              <p>CoinTrader is committed to providing its Approved Users with a very high level of customer service, and your satisfaction is very important to us.</p>
              <p>If you would like to make a complaint, we encourage you to contact us in the first instance by email to complaints@domainname.com.</p>
              <p>We will acknowledge your complaint within 5 business days and make sure your complaint is investigated properly.</p>
              <h3>17. Amendments to these Terms and Conditions</h3>
              <p>We may amend these Terms and Conditions (including the Fee Schedule which is incorporated by reference) at any time in the following circumstances:</p>
              <ul>
                <li>to meet our legal obligations;</li>
                <li>to accommodate the reasonable requirements of our service providers or business partners;</li>
                <li>to reflect changes to our Services, the Digital Currencies, the networks underlying the Digital Currencies, or the risks presented by them; and</li>
                <li>in the case of the Fee Schedule, our costs of business.</li>
              </ul>
              <p>If we amend these Terms and Conditions, we will publish the updated Privacy Policy on our Site. Any subsequent access to or use by you of the Site will constitute an acceptance of the amended Privacy Policy.</p>
              <p>Where it is possible to do so, we will notify you of any changes to this Privacy Policy by sending an email to the email address linked to your User Account.</p>
            </div>
          </div>
        </section>
        <Footer />
        {this.state.modal === 'blacklist' ? <BlacklistModal /> : null}
      </div>
    );
  }
}

export default Terms;
