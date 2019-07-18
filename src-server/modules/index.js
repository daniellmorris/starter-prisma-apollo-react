const normalizedPath = require('path').join(__dirname, './');

const modules = [];
const protect = {};
require('fs').readdirSync(normalizedPath).forEach((file) => {
  console.log('Require:', file);
  const req = require(`./${file}`);
  if (req.module) {
    modules.push(req.module);
  }
  if (req.resolverProtection) {
    const keys = Object.keys(req.resolverProtection);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (protect[key]) {
        throw new Error(`Modules: Protect key already exists: ${key}`);
      } else {
        protect[key] = req.resolverProtection[key];
      }
    }
  }
});

module.exports.modules = modules;
module.exports.resolverProtection = protect;
