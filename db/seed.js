const { prisma } = require('../src-server/generated/prisma-client');
const bcrypt = require('bcryptjs');

// Permissions
const permissions = [
  { name: 'Create Post', code: 'posts.create' },
  { name: 'Update Post', code: 'posts.update' },
];

// Roles
const roles = [
  {
    name: "Admin", code: "admin", 
    permissions: {
      connect: [
        {code: 'posts.update'},
        {code: 'posts.create'},
      ]
    }
  }, {
    name: "Editor", code: "editor",
    permissions: {
      connect: [
        {code: 'posts.update'},
      ]
    }
  },
];

// users
const users = [
  {name: "Admin User", email: "admin@example.com", password: "testpass", roles: {connect: {code: "admin"}}}
];
(async () => {
  
  for (let p of permissions) {
    await prisma.upsertPermission({where: {code: p.code}, create: p, update: p});
  }

  for (let r of roles) {
    await prisma.upsertRole({where: {code: r.code}, create: r, update: r});
  }


  for (let u of users) {
    u.passwordHash = await bcrypt.hash(u.password, 10);
    delete u.password;
    await prisma.upsertUser({where: {email: u.email}, create: u, update: u});
  }
})()
