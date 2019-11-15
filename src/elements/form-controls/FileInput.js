import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid';
import Dropzone from 'react-dropzone';
import Button from '../Button';

const propTypes = {
  className: PropTypes.string,
  encode: PropTypes.bool,
  maxSize: PropTypes.number,
  name: PropTypes.string,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onUploadComplete: PropTypes.func,
  onEncodeComplete: PropTypes.func,
  onUploadError: PropTypes.func,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  readyToUpload: PropTypes.bool,
};

const defaultProps = {
  className: '',
  placeholder: '',
  value: '',
  maxSize: 3,
  acceptedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ],
  onUploadError: null,
};

class FileInput extends PureComponent {
  renderFileList = (files) => {
    if (files && files.length) {
      return files.map(file => (
        <li key={file.name}>{`${file.name} - file type: ${file.type}`}</li>
      ));
    }
  };

  render() {
    // TODO: accepted file types and max size for file
    return (
      <Dropzone
        onDrop={this.props.onDrop}
        multiple={this.props.multiple}
        className={this.props.className || 'file-drop'}
        activeClassName="file-drop-active"
        rejectClassName="file-drop-reject"
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={this.props.className || 'file-drop'}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>{_t('Drop files here...', 'FILE_INPUT.DROP_FILES_HERE')}</p>
            ) : (
              <Button className="file-upload">
                {_t('Upload', 'FILE_INPUT.UPLOAD')}
              </Button>
            )}
          </div>
        )}
      </Dropzone>
    );
  }
}

FileInput.propTypes = propTypes;
FileInput.defaultTypes = defaultProps;

export default FileInput;
