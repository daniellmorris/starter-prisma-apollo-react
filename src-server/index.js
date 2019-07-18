const { ApolloServer } = require('apollo-server');
const { GraphQLModule } = require('@graphql-modules/core');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { modules, resolverProtection } = require('./modules');
// const { schemaDirectives: schemaDirectiveRules } = require('./directives');

// const {
//  rule, shield, and, or, not,
// } = require('graphql-shield');

// const authenticated = next => (root, args, context, info) => {
//  if (!context.user) {
//    throw new Error('Not Authenticated');
//  }
//
//  return next(root, args, context, info);
// };
//
// const validateRole = role => next => (root, args, context, info) => {
//  if (context.currentUser.role !== role) {
//    throw new Error('Unauthorized!');
//  }
//
//  return next(root, args, context, info);
// };
//
// const resolversComposition = {
//  'Query.me': [authenticated],
//  // 'Mutation.publishArticle': [authenticated, validateRole],
// };

const app = new GraphQLModule({
  name: 'app',
  imports: modules,
  resolversComposition: resolverProtection,
});

const { schema, context, schemaDirectives } = app;
SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);


const server = new ApolloServer({
  schema,
  context,
});

server
  .listen({
    port: 8383,
  })
  .then(info => console.log(`
    --------------------------
    Server started on http://localhost:${info.port}
    --------------------------`));
