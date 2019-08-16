import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase.config';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
  };

  componentDidMount() {
    this.addListeners();
  }

  addListeners = () => {
    const loadedChannels = [];
    const { channelsRef } = this.state;

    channelsRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      this.setState({
        channels: loadedChannels,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  addChannel = () => {
    const { user, channelsRef, channelName, channelDetails } = this.state;
    const { key } = channelsRef.push();
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' });
        this.closeModal();
        console.log('channel added');
      })
      .catch((err) => console.error(err));
  };

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  renderChannels = (channels) => channels.length > 0
    && channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => {}}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        <span style={{ paddingRight: 5 }}>#</span>
        {channel.name}
      </Menu.Item>
    ));

  render() {
    const { channels, modal, channelName, channelDetails } = this.state;
    return (
      <>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span style={{ paddingRight: '.2em' }}>
              <Icon name="exchange" />
              CHANNELS
            </span>
            {channels.length}
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.renderChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  value={channelName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  value={channelDetails}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default Channels;
