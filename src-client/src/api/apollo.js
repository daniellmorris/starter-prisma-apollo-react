import ApolloClient from "apollo-boost";
import { AUTH_TOKEN_KEY } from '../constants'


const client = new ApolloClient({
  uri:  "http://localhost:8383",
  request: async operation => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
});

export default client;
