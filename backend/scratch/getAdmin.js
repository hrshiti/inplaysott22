const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const getAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const admin = await db.collection('admins').findOne({});
        if (admin) {
            console.log('--- ADMIN DETAILS ---');
            console.log('Email:', admin.email);
            console.log('Name:', admin.name);
        } else {
            console.log('No admin found in DB.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

getAdmin();
