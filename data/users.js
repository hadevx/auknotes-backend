const bcrypt = require("bcrypt");

const users = [
  {
    username: "admin",
    name: "Admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "00000000",
    isAdmin: true,
  },
];

module.exports = users;
