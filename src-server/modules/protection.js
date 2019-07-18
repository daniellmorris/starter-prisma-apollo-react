//
//
// const authenticated = next => (root, args, context, info) => {
//  if (!context.user) {
//    throw new Error('Not Authenticated');
//  }
//
//  return next(root, args, context, info);
// };
//
// module.exports.resolverProtection = {
//  'Query.me': authenticated,
// };
