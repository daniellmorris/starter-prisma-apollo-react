//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//
//
//const resolvers = {
//  Query: {
//    currentUser: (parent, args, { user, prisma }) => {
//      // this if statement is our authentication check
//      if (!user) {
//        throw new Error('Not Authenticated');
//      }
//      return prisma.user({ id: user.id });
//    },
//    posts: (parent, args, { user, prisma }) => {
//      // this if statement is our authentication check
//      if (!user) {
//        throw new Error('Not Authenticated');
//      }
//      return prisma.posts();
//    },
//  },
//  Mutation: {
//    createPost: async (parent, { title, body }, ctx /* , info */) => {
//      if (!ctx.user) {
//        throw new Error('Not Authenticated');
//      }
//      return ctx.prisma.createPost({
//        title,
//        body,
//      });
//    },
//    register: async (parent, { email, name, password }, ctx /* , info */) => {
//      const passwordHash = await bcrypt.hash(password, 10);
//      const user = await ctx.prisma.createUser({
//        email,
//        name,
//        passwordHash,
//      });
//      return user;
//    },
//    login: async (parent, { email, password }, ctx /* ,info */) => {
//      const user = await ctx.prisma.user({ email });
//
//      if (!user) {
//        throw new Error('Invalid Login');
//      }
//
//      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
//
//      if (!passwordMatch) {
//        throw new Error('Invalid Login');
//      }
//
//      const token = jwt.sign(
//        {
//          id: user.id,
//        },
//        'my-secret-from-env-file-in-prod',
//        {
//          expiresIn: '30d', // token will expire in 30days
//        },
//      );
//      return {
//        token,
//        user,
//      };
//    },
//  },
//};
//
//module.exports = resolvers;
