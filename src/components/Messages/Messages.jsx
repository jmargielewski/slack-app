import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import firebase from '../../firebase.config';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    const { messagesRef } = this.state;
    const loadedMessages = [];

    messagesRef.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
    });
  };

  renderMessages = (messages) => messages.length > 0
    && messages.map((message) => (
      <Message key={message.timestamp} message={message} user={this.state.user} />
    ));

  render() {
    const { messagesRef, messages, channel, user } = this.state;
    return (
      <>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.renderMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </>
    );
  }
}

export default Messages;
