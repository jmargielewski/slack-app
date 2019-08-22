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
    progressBar: false,
    numUniqueUsers: '',
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
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;

    this.setState({ numUniqueUsers });
  };

  isProgressBarVisible = (percent) => {
    if (percent > 0) {
      this.setState({ progressBar: true });
    }
  };

  renderMessages = (messages) => messages.length > 0
    && messages.map((message) => (
      <Message key={message.timestamp} message={message} user={this.state.user} />
    ));

  renderChannelName = (channel) => (channel ? `#${channel.name}` : '');

  render() {
    const {
      messagesRef,
      messages,
      channel,
      user,
      progressBar,
      numUniqueUsers,
    } = this.state;
    return (
      <>
        <MessagesHeader
          channelName={this.renderChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
        />

        <Segment>
          <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
            {this.renderMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isProgressBarVisible={this.isProgressBarVisible}
        />
      </>
    );
  }
}

export default Messages;
