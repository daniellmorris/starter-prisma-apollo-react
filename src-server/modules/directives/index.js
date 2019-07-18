
const { GraphQLModule } = require('@graphql-modules/core');
const normalizedPath = require('path').join(__dirname, './');

const modules = [];
require('fs').readdirSync(normalizedPath).forEach((file) => {
  if (['index.js'].includes(file)) return;
  console.log('RequireDirectives:', file);
  const req = require(`./${file}`);
  if (req.directive) {
    modules.push(req.directive);
  }
});

module.exports.directives = new GraphQLModule({
  name: 'directives',
  imports: modules,
});
