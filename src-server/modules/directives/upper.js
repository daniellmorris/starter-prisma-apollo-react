const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
// const { context } = require('../context');

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.resolve = field.resolve || defaultFieldResolver;
    const { resolve } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === 'string') {
        return result.toUpperCase();
      }
      return result;
    };
  }
}

module.exports.directive = new GraphQLModule({
  name: 'upper_directives',
  typeDefs: gql`
    directive @upper on FIELD_DEFINITION
  `,
  // imports: [context],
  schemaDirectives: {
    upper: UpperCaseDirective,
  },
});
