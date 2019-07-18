const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');
const { context } = require('./context');
const { directives } = require('./directives');
const { module: usersModule } = require('./users');

module.exports.module = new GraphQLModule({
  name: 'posts',
  typeDefs: gql`
    type Query {
      posts: [Post]
      searchPosts(id: ID): [Post]
    }
    
    type Mutation {
      createPost(title: String!, body: String!): Post!  @auth (permissions: ["posts.create"])
      updatePost(id: ID!, title: String!, body: String!): Post!  @auth (permissions: ["posts.update"])
      deletePost(id: ID!): Post!  @auth (permissions: ["posts.update"])
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      author: User!
    }
  `,
  imports: [usersModule, context, directives],
  resolvers: {
    Post: {
      author: ({ id }, args, { user, prisma }, info) => {    
        return prisma.post({id: id}).author();
      }
    },
    Query: {
      posts: (parent, args, { user, prisma }, info) => {
        return prisma.posts();
      },
      searchPosts: (parent, {id}, { user, prisma }, info) => {
        return prisma.posts({where: { id }});
      },
    },
    Mutation: {
      createPost: async (parent, { title, body }, ctx /* , info */) => {
        return ctx.prisma.createPost({
          title,
          body,
          author: {
            connect: { email: ctx.user.email },
          },
        });
      },
      updatePost: async (parent, { id, title, body }, ctx /* , info */) => {
        return ctx.prisma.updatePost({
          where: { id },
          data: { title, body },
        });
      },
      deletePost: (parent, {id}, { user, prisma }, info) => {
        return prisma.deletePost({ id });
      }
    },
  },
});
