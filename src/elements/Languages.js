import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const propTypes = {
  type: PropTypes.string,
  t: PropTypes.string,
};

const defaultProps = {
  type: 'dropdown',
  t: 'LANGUAGES',
};

export class Languages extends Component {
  state = {
    showDropdown: false,
  }

  toggleDropdown = () => this.setState({ showDropdown: !this.state.showDropdown });

  changeLanguage = (code) => {
    localStorage.setItem('currentLanguage', code);
    window.location.reload();
  }

  render() {
    const { showDropdown } = this.state;
    const { lang = {} } = this.props.config;
    const { t } = this.props;
    const code = localStorage.getItem('currentLanguage')
    || lang.default
    || 'en';

    const language = lang.items[code];
    const langRows = Object.keys(lang.items).map((langCode, index) => (
      <li key={index} className={`language-item ${code === langCode ? 'active' : ''}`}>
        <a
          onClick={() => this.changeLanguage(langCode)}
        >
          {_t(lang.items[langCode], `${t}.${lang.items[langCode].toUpperCase()}`)}
        </a>
      </li>
    ));

    return (
      <div className="languages-container">
        <a
          className="dropdown-button"
          onClick={this.toggleDropdown}
        >
          <span>{_t(language, `${t}.${language ? language.toUpperCase() : ''}`)}</span>
          {Object.keys(lang.items).length > 1
            && <i className={`fas ${!showDropdown ? 'fa-caret-down' : 'fa-caret-up'}`} />
          }
        </a>
        {showDropdown
          && (
          <div className="dropdown-list">
            <ul>
              {langRows}
            </ul>
          </div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  config: state.config,
});

Languages.propTypes = propTypes;
Languages.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  null,
)(Languages);
