import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import md5 from 'md5';
import firebase from '../../firebase.config';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });

      const { username, email, password, errors } = this.state;

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email,
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch((err) => {
              console.error(err);
              this.setState({ errors: errors.concat(err), loading: false });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ errors: errors.concat(err), loading: false });
        });
    }
  };

  saveUser = (createdUser) => this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      photoURL: createdUser.user.photoURL,
    });

  handleInputError = (errors, inputName) => (errors.some(err => err.message.toLowerCase().includes(inputName)) ? 'error' : '');

  isFormValid = () => {
    const errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    }

    if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    }

    return true;
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => !username.length || !email.length || !password.length || !passwordConfirmation.length;

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    }
    if (password !== passwordConfirmation) {
      return false;
    }
    return true;
  };

  dispalyErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                type="text"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                type="email"
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                className={this.handleInputError(errors, 'email')}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                type="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                className={this.handleInputError(errors, 'password')}
                onChange={this.handleChange}
              />

              <Form.Input
                fluid
                type="password"
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
                onChange={this.handleChange}
              />

              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                fluid
                color="orange"
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.dispalyErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user?
            <Link to="/login"> Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
