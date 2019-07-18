const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');

module.exports.module = new GraphQLModule({
  name: 'common',
  typeDefs: gql`
    type Query {
      serverTime: String
    }
  `,
  resolvers: {
    Query: {
      serverTime: () => new Date(),
    },
  },
});
