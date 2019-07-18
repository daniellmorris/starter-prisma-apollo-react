const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    currentUser: User!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
  }

  type Mutation {
    register(email: String!, name: String!, password: String!): User!
    login(email: String!, password: String!): LoginResponse!
    createPost(title: String!, body: String!): Post!
  }

  type LoginResponse {
    token: String
    user: User
  }
`;

module.exports = typeDefs;
