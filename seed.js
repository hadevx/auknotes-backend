const dotenv = require("dotenv");
const users = require("./data/users.js"); //dummy data
const products = require("./data/products.js"); //dummy data
const categories = require("./data/categories.js");

const User = require("./models/userModel.js");
const Product = require("./models/productModel.js");
const Delivery = require("./models/deliveryModel.js");
const Discount = require("./models/discountModel.js");
const Store = require("./models/storeModel.js");
const Category = require("./models/categoryModel.js");

const dbConnect = require("./config/db.js");

dotenv.config();
dbConnect();

const seedData = async () => {
  await User.create(users[0]);
  await Category.insertMany(categories);
  await Delivery.create({ timeToDeliver: "today", shippingFee: 0, minDeliveryCost: 0 });
  await Store.create({ status: "active" });

  console.log("Data seeded");
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
