import React from 'react';
import gql from 'graphql-tag'
import { AUTH_TOKEN_KEY } from '../../constants'
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo'
import { compose } from "recompose";

//import PropTypes from 'prop-types';
//import { withStore } from '../../store';
//import API from '../../api/api';
//const SIGNUP_MUTATION = gql`
//  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
//    signup(email: $email, password: $password, name: $name) {
//      token
//    }
//  }
//`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class SignIn extends React.Component {
  constructor(props) {
    const defaults = { email: '', password: '' };

    super(props);
    this.state = { user: defaults, formErrors: { } };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { user, formErrors } = this.state;
    const { login } = this.props;

    Object.keys(user).forEach(field => this.validateField(field));
    const hasErrors = Object.values(formErrors).filter(e => e).length;

    if (!user || hasErrors) return;
    login({variables: user})
      .then(({ data: {login: {token} } }) => {
        console.log("Res:", token);
        this.setState({ error: null });
        //store.set('user', data.user);
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        this.props.history.push('/');
        this.props.client.resetStore();
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  handleChange(event) {
    const { user } = this.state;
    const name = event.target.id;
    const { value } = event.target;
    user[name] = value;
    this.setState({ user }, () => { this.validateField(name, value); });
  }

  validateField(fieldName) {
    const { formErrors, user } = this.state;
    const value = user[fieldName];
    let valid;

    switch (fieldName) {
      case 'email':
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrors.email = valid ? '' : 'Email is invalid';
        break;
      case 'password':
        valid = value.length >= 6;
        formErrors.password = valid ? '' : 'Password is too short';
        break;
      default:
        break;
    }
    this.setState({ formErrors });
  }

  // eslint-disable-next-line class-methods-use-this
  errorClass(error) {
    return (error ? 'is-invalid' : '');
  }

  render() {
    const { user, formErrors, error } = this.state;
    return (
      <div className="card text-left mb-3">
        <div className="card-body">
          <form onSubmit={this.handleSubmit}>
            { error && (
              <div className="alert alert-danger">
                Invalid credentials
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${this.errorClass(formErrors.email)}`}
                id="email"
                aria-describedby="email"
                placeholder="Enter email"
                onChange={this.handleChange}
                value={user.email}
              />
              {formErrors.email && (
                <div className="invalid-feedback">
                  {formErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${this.errorClass(formErrors.password)}`}
                id="password"
                placeholder="Enter password"
                onChange={this.handleChange}
                value={user.password}
              />
              {formErrors.password && (
                <div className="invalid-feedback">
                  {formErrors.password}
                </div>
              )}
            </div>
            <div className="btn-group" role="group" aria-label="">
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
SignIn.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  // store: PropTypes.object.isRequired,
};

export default compose(
  withApollo,
  graphql(LOGIN_MUTATION, {name: 'login'})
)(SignIn);
