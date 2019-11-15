/* global AlphaPoint, $, window, alert, document, AWS */

import React, { Component } from 'react';
// import Dropzone from 'react-dropzone';
import uuidv1 from 'uuid';
import { PropTypes } from 'prop-types';

class FileDrop extends Component {
  state = {
    acceptedFiles: [],
    rejectedFiles: [],
    encodedFiles: [],
  };

  renderFileList = (files) => {
    if (files && files.length) {
      return files.map(file => (
        <li key={file.name}>{`${file.name} - file type: ${file.type}`}</li>
      ));
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.readyToUpload !== prevProps.readyToUpload
      && this.props.readyToUpload
    ) {
      AWS.config.update({
        region: AlphaPoint.config.aws.bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: AlphaPoint.config.aws.identityPoolId,
        }),
      });

      AWS.config.credentials.get((err) => {
        const files = this.state.acceptedFiles;

        if (!err) {
          const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            Bucket: AlphaPoint.config.aws.bucketName,
          });

          // Gets file keys
          const fileExtensionRegEx = /(?:\.([^.]+))?$/;
          const fileKeys = files.map((file) => {
            const timestamp = +new Date();
            const fileExtension = fileExtensionRegEx.exec(file.name)[0];
            return `${AlphaPoint.config.siteName}/${
              AlphaPoint.userData.value.UserId
            }-${timestamp}-${uuidv1()}${fileExtension}`;
          });

          // Manual counter to check that all async calls are complete
          let numberOfAsyncCallsRemaining = files.length;

          files.forEach((file, index) => {
            s3.upload(
              {
                Key: fileKeys[index],
                Body: file,
                Bucket: AlphaPoint.config.aws.bucketName,
                ACL: 'public-read-write',
              },
              (err, data) => {
                if (!err) {
                  --numberOfAsyncCallsRemaining;
                  if (numberOfAsyncCallsRemaining <= 0) {
                    this.props.onUploadComplete(fileKeys);
                  }
                } else {
                  console.error(err);
                }
              },
            );
          });
        }
      });
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.props.onDrop && this.props.onDrop(acceptedFiles, rejectedFiles);
    this.setState({ acceptedFiles, rejectedFiles });
    if (this.props.encode && acceptedFiles) {
      const reader = new FileReader();
      reader.onload = e => this.props.onEncodeComplete(e.target.result);
      reader.readAsDataURL(acceptedFiles[0]);
    }
  };

  render() {
    return (
      <div className="dropzone">
        {this.props.dropErrors && this.props.dropErrors.length ? (
          <div>
            <p>
              {AlphaPoint.translation('FILE_DROP.ERRORS_HEADING')
                || 'One or more files could not be uploaded because'}
            </p>
            <ul>
              {this.props.dropErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <Dropzone
          onDrop={this.onDrop}
          onDropAccepted={this.props.onDropAccepted}
          onDropRejected={this.props.onDropRejected}
          multiple={this.props.multiple}
          accept={this.props.acceptedFileTypes.join(', ')}
          className={this.props.className || 'file-drop'}
          activeClassName="file-drop-active"
          rejectClassName="file-drop-reject"
          maxSize={this.props.maxSize * 1000000}
        >
          {this.props.children}
        </Dropzone>
        <div className="uploadMessages">
          <div>
            {this.props.acceptedFiles && this.props.acceptedFiles.length ? (
              <div>
                <p>
                  {AlphaPoint.translation('FILE_DROP.UPLOAD_MESSAGES_READY')
                    || 'These files are ready to be uploaded:'}
                </p>
                <ul>{this.renderFileList(this.props.acceptedFiles)}</ul>
              </div>
            ) : null}
            {this.props.rejectedFiles && this.props.rejectedFiles.length ? (
              <div>
                <p>
                  {AlphaPoint.translation(
                    'FILE_DROP.UPLOAD_MESSAGES_REJECTED',
                  ) || 'These files cannot be uploaded:'}
                </p>
                <ul>{this.renderFileList(this.props.rejectedFiles)}</ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

FileDrop.defaultProps = {
  className: '',
  placeholder: '',
  value: '',
  maxSize: 3,
  acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};

FileDrop.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  maxSize: PropTypes.number,
};

export default FileDrop;
