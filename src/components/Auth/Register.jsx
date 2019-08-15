import React, { Component } from 'react';
import {
 Grid, Form, Segment, Button, Header, Message, Icon 
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Register extends Component {
  state = {};

  handleChange = (e) => {};

  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                type="text"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChaneg={this.handleChange}
              />

              <Form.Input
                fluid
                type="email"
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChaneg={this.handleChange}
              />

              <Form.Input
                fluid
                type="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChaneg={this.handleChange}
              />

              <Form.Input
                fluid
                type="password"
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChaneg={this.handleChange}
              />

              <Button fluid color="orange" size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user?
            <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
