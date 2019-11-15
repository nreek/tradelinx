import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import FileInput from './FileInput';

import Button from '../../elements/Button';

// Helpers
import { toAllCaps, translate } from '../../util/helpers';

const propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  details: PropTypes.string,
};

const defaultProps = {
  className: '',
  placeholder: '',
  value: '',
  onChange: () => {},
};

class FileUploadButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptedFiles: [],
      rejectedFiles: [],
    };

    this.translatedName = _t(
      this.props.name,
      `${this.props.translation}.${toAllCaps(this.props.name)}`,
    );
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({ acceptedFiles, rejectedFiles }, () => {
      // if (acceptedFiles.length) {
      //   this.props.onFileAccepted({ target: { value: acceptedFiles[0] } });
      // }
    });
  };

  onReset = () => {
    this.setState({ acceptedFiles: [], rejectedFiles: [] }, () => {
      // this.props.onFileAccepted({ target: { value: false } });
    });
  };

  render() {
    const { acceptedFiles } = this.state;
    return (
      // NOTE: Library for file upload has a bug when wrapped in <label> tag
      <div className={`form-field file-upload-button ${this.props.className}`}>
        <div className="field-label">
          {this.translatedName}
          {this.props.required ? <span className="form-required">*</span> : ''}
          {this.props.details && (
            <div className="field-details">{this.props.details}</div>
          )}
        </div>
        {this.state.acceptedFiles.length ? (
          <div className="file-ready">
            {_t('File ready.', 'FILE_UPLOAD_BUTTON.READY')}
            {'  '}
            <span className='file-upload-cancel-button' onClick={this.onReset}>
              <i className="fas fa-times-circle" />
            </span>
            <Button 
              className='file-upload-update-button' 
              onClick={() => this.props.onFileAccepted({ target: { value: acceptedFiles[0] } })}
            >
              {_t('Update', 'FILE_UPLOAD_BUTTON.UPDATE')}
            </Button>
          </div>
        ) : (
          <FileInput
            onDrop={this.onDrop}
            onUploadComplete={this.props.onUploadComplete}
            onEncodeComplete={this.props.onEncodeComplete}
            multiple={false}
            acceptedFileTypes={this.props.acceptedFileTypes}
            maxSize={this.props.maxSize}
          />
        )}
      </div>
    );
  }
}

FileUploadButton.propTypes = propTypes;
FileUploadButton.defaultProps = defaultProps;

export default FileUploadButton;
