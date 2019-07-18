import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'
import { graphql, withApollo } from 'react-apollo'
import { Link } from 'react-router-dom';
import { AUTH_TOKEN_KEY } from '../constants'
import { compose } from "recompose";

import logo from '../logo.svg';

const PROFILE_QUERY = gql`
  query MeForLayout {
    me {
      id
      name
    }
  }
`;

// Define the main app
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
  }

  handleLogout() {
    let { client } = this.props;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    client.resetStore();
  }

  render() {
    let { data: {me} } = this.props;
    console.log(this.props)
    let links;
    if (!me) {
      links = 
        <div className="d-flex justify-content-center">
          <Link to="/sign_in" className="btn btn-success mr-2">
            Sign In
          </Link>
          <Link to="/sign_up" className="btn btn-success mr-2">
            Sign Up
          </Link>
        </div>
    } else {
      links = 
        <div className="d-flex justify-content-center">
          <button type="button" onClick={this.handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to React. This demo was modified to work with Apollo.
          </h1>
          {
            me && (
              <h4>
                Logged in as {me.name}
              </h4>
            )
          }
          {links}
        </header>
      </div>
    );
  }
}

Header.propTypes = {
  client: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
export default compose(
  withApollo,
  graphql(PROFILE_QUERY)
)(Header);
