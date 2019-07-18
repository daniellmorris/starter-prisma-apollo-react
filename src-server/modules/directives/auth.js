const { GraphQLModule } = require('@graphql-modules/core');
const { gql } = require('apollo-server');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
const { context } = require('../context');

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRoles = this.args.roles;
    type._requiredAuthPermissions = this.args.permissions;
    type._requiredAuth = true;
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuth = true;
    field._requiredAuthRoles = this.args.roles;
    field._requiredAuthPermissions = this.args.permissions;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        const ctx = args[2];
        const { user, roleCodes, permissionCodes } = ctx;

        if (field._requiredAuth && !user) {
          throw new Error('Not Authenticated');
        }
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRoles = field._requiredAuthRoles
          || objectType._requiredAuthRoles;
        
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredPermissions = field._requiredAuthPermissions
          || objectType._requiredAuthPermissions;


        // No permissions or roles defined
        if (!requiredRoles && !requiredPermissions) {
          return resolve.apply(this, args);
        }

        // Roles are defined
        if (requiredRoles && requiredRoles.some((rc) => roleCodes.includes(rc))) {
          return resolve.apply(this, args);
        }
        
        // Permissions are defined
        if (requiredPermissions && requiredPermissions.some((rc) => permissionCodes.includes(rc))) {
          return resolve.apply(this, args);
        }
          
        throw new Error('Not Authorized');
      };
    });
  }
}

module.exports.directive = new GraphQLModule({
  name: 'auth_directives',
  typeDefs: gql`
    directive @auth (
      roles: [String], permissions: [String]
    ) on OBJECT | FIELD_DEFINITION
  `,
  imports: [context],
  schemaDirectives: {
    auth: AuthDirective,
  },
});
