const mongoose = require('mongoose');
require('dotenv').config();

const checkContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // List Collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const db = mongoose.connection.db;
    
    // Find all published contents
    const contents = await db.collection('contents').find({ status: 'published' }).toArray();
    console.log('\n--- PUBLISHED CONTENTS ---');
    contents.forEach(c => {
      console.log(`Title: ${c.title}`);
      console.log(`  Type: ${c.type}, Category: ${c.category}`);
      console.log(`  Poster Url:`, c.poster?.url || c.image);
      console.log(`  Backdrop Url:`, c.backdrop?.url || c.backdrop);
    });

    // Find all active promotions
    const promotions = await db.collection('promotions').find({}).toArray();
    console.log('\n--- PROMOTIONS ---');
    promotions.forEach(p => {
      console.log(`Title: ${p.title}`);
      console.log(`  Active: ${p.isActive}`);
      console.log(`  Poster Image Url:`, p.posterImageUrl);
      console.log(`  Promo Video Url:`, p.promoVideoUrl);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkContent();
