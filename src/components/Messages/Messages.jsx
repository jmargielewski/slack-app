import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import firebase from '../../firebase.config';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
  };

  render() {
    const { messagesRef, channel, user } = this.state;
    return (
      <>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
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
