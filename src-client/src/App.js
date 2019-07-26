import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from "react-apollo";

// import logo from './logo.svg';
//import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './components/auth/sign-in';
import SignUp from './components/auth/sign-up';
import Header from './components/header';
import Posts from './components/posts';

import client from './api/apollo.js';
// import { createStore } from './store';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <p className="App-intro">
            To get started, edit
            {' '}
            <code>
              src/App.jsx
            </code>
            {' '}
            and save to reload.
          </p>
          <div className="container">
            <div>
              <Route exact path="/" component={Posts} />
              <Route path="/sign_in" component={SignIn} />
              <Route path="/sign_up" component={SignUp} />
            </div>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
