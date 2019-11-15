import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import { selectFile } from '../../../reducers';

// TODO: update styling
// TODO: add icon
class DocumentDownload extends Component {
  download = () => {
    FileSaver.saveAs(this.props.file.value);
  };

  render() {
    return (
      <Fragment>
        <div className="document-download-label">
          {_t('Document', 'DOCUMENT_DOWNLOAD.DOCUMENT')}
        </div>
        <div className="document-download">
          <div className="file-name">{this.props.fileName}</div>
          <div className="download-button" onClick={this.download}>
            <div className="icon-container">
              <i className="fa fa-download" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  file: selectFile(state),
});

export default connect(mapStateToProps)(DocumentDownload);
