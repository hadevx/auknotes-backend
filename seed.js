const dotenv = require("dotenv");
const users = require("./data/users.js");
const categories = require("./data/categories.js");
const topics = require("./data/topics.js");

const User = require("./models/userModel.js");
const Topic = require("./models/topicModel.js");
const Delivery = require("./models/deliveryModel.js");
const Store = require("./models/storeModel.js");
const Category = require("./models/categoryModel.js");

const dbConnect = require("./config/db.js");

dotenv.config();
dbConnect();

// Hard-coded colors
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const seedData = async () => {
  let createdUsers;
  try {
    createdUsers = await User.insertMany(users);
    console.log(`${GREEN}👤 Users seeded${RESET}`);
  } catch (err) {
    console.log(`${RED}❌ Failed to seed users: ${err.message}${RESET}`);
  }

  try {
    await Category.insertMany(categories);
    console.log(`${GREEN}📚 Courses seeded${RESET}`);
  } catch (err) {
    console.log(`${RED}❌ Failed to seed categories: ${err.message}${RESET}`);
  }

  try {
    await Delivery.create({ timeToDeliver: "today", shippingFee: 0, minDeliveryCost: 0 });
    await Store.create({ status: "active" });
    console.log(`${GREEN}🚚 Delivery and Store seeded${RESET}`);
  } catch (err) {
    console.log(`${RED}❌ Failed to seed delivery/store: ${err.message}${RESET}`);
  }

  try {
    const x = topics.map((topic, i) => ({
      ...topic,
      author: createdUsers[(i % (createdUsers.length - 1)) + 1]._id,
    }));

    await Topic.insertMany(x);
    console.log(`${GREEN}📝 Topics seeded${RESET}`);
  } catch (err) {
    console.log(`${RED}❌ Failed to seed topics: ${err.message}${RESET}`);
  }

  console.log(`${GREEN}✅ Seeding process finished${RESET}`);
  process.exit();
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Topic.deleteMany();
    console.log(`${GREEN}🗑️ Data Destroyed${RESET}`);
    process.exit();
  } catch (err) {
    console.log(`${RED}❌ Error destroying data: ${err.message}${RESET}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
