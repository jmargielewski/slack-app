import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from './FileModal';
import firebase from '../../firebase.config';

class MessagesForm extends Component {
  state = {
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

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: this.state.message,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };

    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel, errors } = this.state;

    if (message) {
      this.setState({ loading: true });

      messagesRef
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

  uploadFile = (file, metadata) => {
    console.log(file, metadata);
  };

  render() {
    const { errors, message, loading, modal } = this.state;
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
            color="teal"
            content="Upload media"
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal
            uploadFile={this.uploadFile}
            closeModal={this.closeModal}
            modal={modal}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessagesForm;
