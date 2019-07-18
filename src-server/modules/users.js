const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');
const { context } = require('./context');
const { directives } = require('./directives');

module.exports.module = new GraphQLModule({
  name: 'users',
  typeDefs: gql`
    type Query {
      me: User @auth
    }

    type User {
      id: ID!
      name: String!
      email: String! @upper
      roles: [Role!]
    }

    type Role {
      id: ID!
      name: String!
      permissions: [Permission!]
    }

    type Permission {
      id: ID!
      name: String!
      code: String!
    }
  `,
  imports: [context, directives],
  resolvers: {
    Query: {
      me: (parent, args, ctx) => ctx.user,
    },
  },
});
