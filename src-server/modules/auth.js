const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { module: usersModule } = require('./users');
const { context } = require('./context');

module.exports.module = new GraphQLModule({
  name: 'auth',
  typeDefs: gql`
    type Mutation {
      register(email: String!, name: String!, password: String!): User!
      login(email: String!, password: String!): LoginResponse!
    }

    type LoginResponse {
      token: String
      user: User
    }
  `,
  imports: [context, usersModule], // For users type
  resolvers: {
    Mutation: {
      register: async (parent, { email, name, password }, ctx /* , info */) => {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await ctx.prisma.createUser({
          email,
          name,
          passwordHash,
        });
        return user;
      },
      login: async (parent, { email, password }, ctx /* ,info */) => {
        const user = await ctx.prisma.user({ email });

        if (!user) {
          throw new Error('Invalid Login');
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          throw new Error('Invalid Login');
        }

        const token = jwt.sign(
          {
            id: user.id,
          },
          'my-secret-from-env-file-in-prod',
          {
            expiresIn: '30d', // token will expire in 30days
          },
        );
        return {
          token,
          user,
        };
      },
    },
  },
});
