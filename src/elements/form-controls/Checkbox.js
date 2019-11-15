import React, {Fragment, PureComponent} from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

// Helpers
import { toDashCase } from '../../util/helpers';

class Checkbox extends PureComponent {
  renderLinks(links) {
    return (
      links.length
        ? links.map((link, index) =>
          <Fragment key={link.translation + index}>
            <span className="margin-right5" />
            <Link target="_blank" to={link.path} className="signup-agree-link">
              { _t(link.text, link.translation) }
            </Link>
            { index !== links.length - 1 && <span>, </span> }
          </Fragment>)
        : null
    );
  }

  render() {
    const {
      checkboxWithLinks,
      className,
      name,
      translation,
      textTranslation,
      links,
      value,
      onSubmit,
      onChange,
      onFocus,
      onBlur,
    } = this.props;
    return (
      <label className={`checkbox-input ${checkboxWithLinks && 'agree-checkbox-holder'} form-field ${className}`}>
        <div className="checkbox">
          <input
            type="checkbox"
            name={toDashCase(name)}
            value={value}
            onSubmit={onSubmit}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div className="checkbox-text">
          { !checkboxWithLinks && _t(
            name,
            translation
          )}

          {
            checkboxWithLinks
              && <Fragment>
                { _t(textTranslation.text, textTranslation.translation) }
                { this.renderLinks(links) }
              </Fragment>
          }
        </div>
      </label>
    );
  }
}

Checkbox.defaultProps = {
  className: '',
  value: 'true',
  links: [],
};

Checkbox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  translation: PropTypes.string,
};

export default Checkbox;
