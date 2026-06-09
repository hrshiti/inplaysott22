const mongoose = require('mongoose');
require('dotenv').config();
const AppSetting = require('../models/AppSetting');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://mohammadrehan00121_db_user:D5xgqxW22lG81WGT@ac-teeexgs-shard-00-00.sjuqc5l.mongodb.net:27017,ac-teeexgs-shard-00-01.sjuqc5l.mongodb.net:27017,ac-teeexgs-shard-00-02.sjuqc5l.mongodb.net:27017/inplay?ssl=true&replicaSet=atlas-zj48md-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        let settings = await AppSetting.findOne();
        if (!settings) {
            settings = new AppSetting();
        }

        settings.helpCenter = {
            chatSupportText: 'Need assistance? Our support team is here to help you 24/7.',
            faqs: [
                {
                    question: 'Can I watch movies offline?',
                    answer: 'No, offline viewing is currently not supported. You need an active internet connection to stream movies and TV shows on InPlay.'
                },
                {
                    question: 'What devices are supported?',
                    answer: 'InPlay is supported on all major platforms including Android, iOS, Apple TV, Amazon Fire TV, Smart TVs, and standard Web Browsers.'
                },
                {
                    question: 'How do I change my streaming quality?',
                    answer: 'While watching a video, tap on the settings (gear) icon on the player and select your preferred resolution (Auto, 720p, 1080p, 4K). "Auto" will dynamically adjust based on your network speed.'
                }
            ]
        };

        settings.privacyPolicy = {
            content: `# Privacy Policy\nLast updated: June 2026\n\n## 1. Information We Collect\nWe collect information to provide better services to all our users. This includes:\n* **Account Data**: Name, email address, phone number, and password.\n* **Usage Data**: Your interaction with our platform, viewing history, and search queries.\n* **Device Information**: IP address, browser type, and operating system.\n\n## 2. How We Use Your Information\nWe use the collected information for the following purposes:\n* To personalize your content recommendations.\n* To process your subscription payments securely.\n* To communicate with you regarding updates, offers, and account alerts.\n\n## 3. Data Security\nInPlay implements robust security measures to protect your personal information. We utilize industry-standard encryption protocols for all payment transactions and data storage.\n\n## 4. Contact Us\nIf you have any questions about this Privacy Policy, please contact our Data Protection Officer at privacy@inplay.com.`,
            lastUpdated: new Date()
        };

        settings.aboutInPlay = {
            description: `# Welcome to InPlay\nInPlay is a premier, next-generation OTT streaming platform designed to deliver high-quality entertainment directly to your screens.\n\n## Our Mission\nOur mission is to redefine digital entertainment by providing an expansive library of blockbuster movies, critically acclaimed original series, and immersive documentaries from around the globe.\n\n### Unmatched Quality\n* **4K Ultra HD Streaming**: Experience movies in breathtaking detail.\n* **Dolby Atmos Audio**: Immersive, cinema-quality sound.\n* **Seamless Playback**: Optimized adaptive bitrate streaming for zero buffering.\n\nJoin us on a journey to explore limitless entertainment.`,
            version: '2.4.0 (Stable Build)',
            website: 'www.inplay.com',
            twitter: '@InPlayHQ',
            instagram: '@inplay_official'
        };

        await settings.save();
        console.log('Successfully seeded professional Support & Legal data!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
