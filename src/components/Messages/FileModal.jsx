import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Input, Icon, Button } from 'semantic-ui-react';

class FileModal extends Component {
  state = {
    file: null,
    autorized: ['image/jpeg', 'image/png'],
  };

  sendFile = (e) => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        // send file
        const metadata = { contentType: mime.lookup(file.name) };

        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  isAuthorized = (filename) => this.state.autorized.includes(mime.lookup(filename));

  clearFile = () => this.setState({ file: null });

  addFile = (e) => {
    const file = e.target.files[0];

    if (file) this.setState({ file });
  };

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            name="file"
            type="file"
            label="File types: jpg, png"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="remove" />
            Send
          </Button>

          <Button color="red" inverted onClick={closeModal}>
            <Icon name="checkmark" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
