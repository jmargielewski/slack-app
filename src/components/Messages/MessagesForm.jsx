import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input } from 'semantic-ui-react';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import firebase from '../../firebase.config';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessagesForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
    emojiPicker: false,
  };

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      this.sendMessage();
    }
    const { message, typingRef, channel, user } = this.state;

    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  };

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = (emoji) => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(`${oldMessage} ${emoji.colons}`);

    this.setState({ message: newMessage, emojiPicker: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  colonToUnicode = (message) => message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, '');
      const emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        const unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }
      x = `:${x}:`;
      return x;
    });

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
    const { message, channel, errors, user, typingRef } = this.state;

    if (message) {
      this.setState({ loading: true });

      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove();
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
      return `chat/private/${this.state.channel.id}`;
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
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded,
      emojiPicker,
    } = this.state;
    return (
      <Segment className="messages__form">
        {emojiPicker && (
          <Picker
            set="apple"
            onSelect={this.handleAddEmoji}
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
        <Input
          fluid
          name="message"
          className={
            errors.some((error) => error.message.includes('message')) ? 'error' : ''
          }
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={message}
          ref={(node) => (this.messageInputRef = node)}
          style={{ marginBottom: '.7em' }}
          label={(
<Button
              icon={emojiPicker ? 'close' : 'add'}
              content={emojiPicker ? 'Close' : null}
              onClick={this.handleTogglePicker}
            />
)}
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
