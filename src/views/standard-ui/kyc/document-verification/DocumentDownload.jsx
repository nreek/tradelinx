import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import { selectFile } from '../../../../reducers';

class DocumentDownload extends Component {
  download = () => {
    FileSaver.saveAs(this.props.file.value);
  };

  render() {
    return (
      <Fragment>
        <div className="document-download">
          <div className="file-name">{this.props.fileName}</div>
          <a className="download-button" onClick={this.download}>
            <div className="icon-container">
              <i className="fas fa-download" aria-hidden="true" />
            </div>
          </a>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  file: selectFile(state),
});

export default connect(mapStateToProps)(DocumentDownload);
