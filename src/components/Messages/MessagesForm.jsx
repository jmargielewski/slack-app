import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase.config';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessagesForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message.image = fileUrl;
    } else {
      message.content = this.state.message;
    }

    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, errors } = this.state;

    if (message) {
      this.setState({ loading: true });

      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: errors.concat(err),
          });
        });
    } else {
      this.setState({ errors: errors.concat({ message: 'Add a meassage' }) });
    }
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    }
    return 'chat/public';
  };

  uploadFile = (file, metadata) => {
    const { getMessagesRef } = this.props;
    const { channel, storageRef, errors } = this.state;
    const pathToUpdate = channel.id;
    const ref = getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100,
            );
            this.props.isProgressBarVisible(percentUploaded);
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);

            this.setState({
              errors: errors.concat(err),
              uploadState: 'error',
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpdate);
              })
              .catch((err) => {
                console.error(err);

                this.setState({
                  errors: errors.concat(err),
                  uploadState: 'error',
                  uploadTask: null,
                });
              });
          },
        );
      },
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({
          uploadState: 'done',
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          // prettier-ignore
          errors: this.state.errors.concat(err),
        });
      });
  };

  render() {
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
    return (
      <Segment className="messages__form">
        <Input
          fluid
          name="message"
          className={
            errors.some((error) => error.message.includes('message')) ? 'error' : ''
          }
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: '.7em' }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            disabled={loading}
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            onClick={this.openModal}
            disabled={uploadState === 'uploading'}
            color="teal"
            content="Upload media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal
          uploadFile={this.uploadFile}
          closeModal={this.closeModal}
          modal={modal}
        />
        <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />
      </Segment>
    );
  }
}

export default MessagesForm;
