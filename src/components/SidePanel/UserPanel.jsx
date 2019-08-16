import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase.config';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Sign out!'));
  };

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as
          <strong style={{ paddingLeft: 3 }}>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Change avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Sign Out</span>,
    },
  ];

  render() {
    const { user } = this.state;

    const dropdownTrigger = (
      <span>
        <Image src={user.photoURL} spaced="right" avatar />
        {user.displayName}
      </span>
    );
    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em' }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>

            <Header style={{ padding: '0.25em' }} as="h4" inverted>
              <Dropdown trigger={dropdownTrigger} options={this.dropdownOptions()} />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
