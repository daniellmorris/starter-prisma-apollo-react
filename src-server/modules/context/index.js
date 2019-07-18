const { GraphQLModule } = require('@graphql-modules/core');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../generated/prisma-client/index');

const getUser = async (token) => {
  try {
    if (token) {
      const t = jwt.verify(token, 'my-secret-from-env-file-in-prod');
      let user = await prisma.user({ id: t.id }).$fragment(`
        fragment UsersWithRolesPermissions on User {
          id
          name
          email
          roles {
            id
            name
            code
            permissions {
              id
              name
              code
            }
          }
        }
      `);
      let permissionCodes = [];
      let roleCodes = [];
      for (let r of ((user || {}).roles || [])) {
        roleCodes.push(r.code)
        for (let p of (r.permissions||[])) {
          permissionCodes.push(p.code);
        }
      }
      result = {user, permissionCodes, roleCodes};
      return result;
    }
    return {user: null, permissionCodes: null, roleCodes: null};
  } catch (err) {
    return {user: null, permissionCodes: null, roleCodes: null};
  }
};

module.exports.context = new GraphQLModule({
  name: 'global_ctx',
  context: async ({ req }) => {
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];
    const {user, permissionCodes, roleCodes} = await getUser(token);
    
    return {
      user,
      permissionCodes,
      roleCodes,
      prisma, // the generated prisma client if you are using it
    };
  },
});
