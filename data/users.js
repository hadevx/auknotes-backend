const bcrypt = require("bcrypt");

// Predefined users
const users = [
  {
    username: "admin",
    name: "Admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "00000000",
    isAdmin: true,
    avatar: "logo.webp",
  },
  {
    username: "johnDoe",
    name: "John Doe",
    email: "hn98q8@hotmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "11111111",
    isAdmin: false,
    avatar: "1.webp",
  },
  {
    username: "janeSmith",
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "22222222",
    isAdmin: false,
    avatar: "2.webp",
  },
  {
    username: "mikeBrown",
    name: "Mike Brown",
    email: "mike@example.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "33333333",
    isAdmin: false,
    avatar: "3.webp",
  },
  {
    username: "sarahLee",
    name: "Sarah Lee",
    email: "sarah@example.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "44444444",
    isAdmin: false,
    avatar: "4.webp",
  },
];

module.exports = users;
