import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from '../../firebase.config';

class Starred extends Component {
  /* eslint-disable react/destructuring-assignment */
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    activeChannel: '',
    starredChannels: [],
  };
  /* eslint-disable react/destructuring-assignment */

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = (userId) => {
    const { usersRef } = this.state;

    usersRef
      .child(userId)
      .child('starred')
      .on('child_added', (snap) => {
        const starredChannel = { id: snap.key, ...snap.val() };

        this.setState((prevState) => ({
          starredChannels: [...prevState.starredChannels, starredChannel],
        }));
      });

    usersRef
      .child(userId)
      .child('starred')
      .on('child_removed', (snap) => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        /* eslint-disable react/no-access-state-in-setstate */
        const filteredChannels = this.state.starredChannels.filter(
          (channel) => channel.id !== channelToRemove.id,
        );
        /* eslint-disable react/no-access-state-in-setstate */

        this.setState({ starredChannels: filteredChannels });
      });
  };

  setActiveChannel = (channel) => {
    this.setState({
      activeChannel: channel.id,
    });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  renderChannels = (starredChannels) => starredChannels.length > 0
    && starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span style={{ paddingRight: '.4em' }}>
            <Icon name="star" />
            STARRED
          </span>
          {starredChannels.length}
        </Menu.Item>
        {this.renderChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel },
)(Starred);
