const mongoose = require('mongoose');
require('dotenv').config();

const checkPromo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const promotions = await db.collection('promotions').find({}).toArray();
    console.log(JSON.stringify(promotions, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkPromo();
