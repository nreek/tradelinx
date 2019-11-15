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

class Privacy extends Component {
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
              <h1 className="policy-title">Privacy Policy</h1>
            </div>
            <div className="policy-content">
              <h4>Scope</h4>
              <p>The Privacy policy of Retail applies for the information collected from the users of our website our email recipients or any other interaction with us. The policy explains the collection, organization, usage, protection &amp; sharing of data.</p>

              <h4>Collection and usage of data</h4>

              <p>Data provided by you</p>

              <p>
The information provided by the client is collected as follows:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address.</li>
                <li>Mobile no.</li>
                <li>TIN (such as U.S. social security number) or other government-issued ID number.</li>
                <li>DOB</li>
                <li>Physical address.</li>
                <li>Currency preference.</li>
                <li>Profile completion.</li>
                <li>Account creation history.</li>
                <li>Support request.</li>
                <li>Contact's phone no &amp; emails.</li>
                <li>Invitation to friend (reference)</li>
                <li>Unsubscription to commercial messages from Retail.</li>
                <li>Transaction completion history &amp; funding history about bitcoin transaction.</li>
                <li>Other related information.</li>
                <li>For mobile apps, collection of a unique mobile id (in case of a iphone, collection of Apple-recommended CFUUID (the Core Foundation Universally Unique Identifier)</li>
              </ul>
              <p />
              <h4>Collection of other data</h4>

              <p>We may also automatically collect the following data:</p>
              <p>
                <span>Cookies:</span>
                {' '}
Collection of data from your visit, so as to avoid re-login each time. it counts visits and collect information regarding the most visited areas i.e. the popular ones. Cookies helps in knowing your browsing preferences to us and to third party also and helps in giving you desired results.
              </p>
              <p>
                <span>Analytics:</span>
                {' '}
The collection of data about your computer and internet connections. This tool helps in improving our performance by knowing the customer's usage of our website. The ip address and isp address is being shown on our computer. Third party tools are also used by us to know your usage of mobile apps. All this information internally helps us in improving and knowing your usage of our mobile app.
              </p>
              <p>
                <span>Action Tags:</span>
                {' '}
(also called pixel tags, clear GIF, or beacons) Helps us in knowing different pages you visit and the content used by you. These are also used in Emails to know that Emails were opened or forwarded. Same is also used on websites on Mobile apps to know the content used.
              </p>
              <p>
                <span>Site Management:</span>
                {' '}
Aggregating the collected data for the maintenance, and improvement of our website &amp; to know the preferences of our visitors, to identify server problems &amp; to improve our Marketing &amp; research.
              </p>
              <p>
                <span>Do Not Track:</span>
                {' '}
No response to DO NOT TRACK SIGNALS &amp; might be used in future and thereafter will be explained in privacy policy.
              </p>

              <p>As u provide us personal data, its consent to its usage as per our privacy policy that means u agree to movement of data to our servers and third party as explained in our privacy policy.</p>

              <h4>Protection and security of data</h4>
              <p>Physical, Electronic &amp; Procedural safeguards are being used for protection of data so as to avoid its loss, misuse, unauthorized access, disclosure, alteration, and destruction. Its being provided that we are not responsible for any data loss or misuse, which is being represented on a third party site or during transmission. No transmission is 100 % secure. For detailed questions about security contact us at.</p>

              <h4>Data Retention</h4>

              <p>For closure of Retail account, visit support@retail.com. We will keep your information in our database till the time your account is active so as to meet legal obligations. The data may be kept with us even after closure of account only if its necessary to have sufficient information to respond to any later issues. For example, we may need or be required to retain certain information to prevent fraudulent activity, protect ourselves against liability, permit us to pursue available remedies or limit any damages that we may sustain, or if we believe in good faith that a law, regulation, rule or guideline requires it.</p>

              <h4>Information access</h4>

              <p>We will provide access to information within reasonable time as required by law.</p>


              <h4>Data Sharing</h4>

              <p>
Your information may be shared as follows:
              </p>
              <ul>
                <li>You have agreed upon sharing of info.</li>
                <li>Information has been aggregated or de-identified so that u cant be identified.</li>
                <li>In case of related third parties service providers including certain advertising, referral, operations, financial services and technology services (such as hosting providers, identity verification, support, payment, and email service providers.</li>
                <li>As if law demands.</li>
                <li>For protection of rights, properties and safety of Retail, our users and the public, including, for example, in connection with court proceedings, or to detect or prevent criminal activity, fraud, material misrepresentation, or to establish our rights or defend against legal claim.</li>
                <li>In case of Amalgamation or demerger of business.</li>
              </ul>
              <p />
              <p>Other websites links and online services in case links of other sites are available on our site. we are not concerned with their privacy policies and we are no more responsible for safety of you info provided by you.</p>

              <h4>Policy changes</h4>
              <p>Privacy policy might be changed &amp; in case of changes, it will be notified on top of policy with date and in case of material changes it will be notified by a notice on website and mobile apps, prior to such changes becoming effective. so we encourage you to review page periodically for latest updates &amp; privacy policy.</p>
            </div>
          </div>
        </section>
        <Footer />
        {this.state.modal === 'blacklist' ? <BlacklistModal /> : null}
      </div>
    );
  }
}

export default Privacy;
