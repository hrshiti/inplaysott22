const mongoose = require('mongoose');
require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Content = require('../models/Content');
    const User = require('../models/User');
    const user = await User.findById('6a005e8a40be359f19abe50f')
      .populate('myList')
      .populate('likedContent');

    if (user) {
      console.log(`--- USER PROFILE ---`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`My List Count: ${user.myList?.length || 0}`);
      user.myList?.forEach(c => console.log(`  - ${c.title}`));
      console.log(`Liked Content Count: ${user.likedContent?.length || 0}`);
      user.likedContent?.forEach(c => console.log(`  - ${c.title}`));
      console.log(`History Count: ${user.history?.length || 0}`);
      console.log(`History:`, user.history);
      console.log(`Continue Watching Count: ${user.continueWatching?.length || 0}`);
      console.log(`Continue Watching:`, user.continueWatching);
    } else {
      console.log('User not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUser();
