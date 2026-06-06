const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const QuickByte = require('./models/QuickByte');
const Content = require('./models/Content');
const ForYou = require('./models/ForYou');

// Find all collections that might contain 'undefined/uploads/' strings
async function fixUndefinedUrls() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database.');

        console.log('Fixing QuickBites...');
        const qbResult = await QuickByte.find();
        let qbCount = 0;
        for (let doc of qbResult) {
            let modified = false;
            if (doc.video && doc.video.url && doc.video.url.includes('undefined/uploads')) {
                doc.video.url = doc.video.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                doc.video.secure_url = doc.video.url;
                modified = true;
            }
            if (doc.thumbnail && doc.thumbnail.url && doc.thumbnail.url.includes('undefined/uploads')) {
                doc.thumbnail.url = doc.thumbnail.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                doc.thumbnail.secure_url = doc.thumbnail.url;
                modified = true;
            }
            if (modified) {
                await doc.save();
                qbCount++;
            }
        }
        console.log(`Fixed ${qbCount} QuickBites.`);

        console.log('Fixing Content...');
        const contentResult = await Content.find();
        let contentCount = 0;
        for (let doc of contentResult) {
            let modified = false;
            if (doc.poster && doc.poster.includes('undefined/uploads')) {
                doc.poster = doc.poster.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                modified = true;
            }
            if (doc.backdrop && doc.backdrop.includes('undefined/uploads')) {
                doc.backdrop = doc.backdrop.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                modified = true;
            }
            if (doc.video && doc.video.url && doc.video.url.includes('undefined/uploads')) {
                doc.video.url = doc.video.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                doc.video.secure_url = doc.video.url;
                modified = true;
            }
            
            // Check episodes for web series
            if (doc.seasons && doc.seasons.length > 0) {
                for (let season of doc.seasons) {
                    if (season.episodes && season.episodes.length > 0) {
                        for (let ep of season.episodes) {
                            if (ep.video && ep.video.url && ep.video.url.includes('undefined/uploads')) {
                                ep.video.url = ep.video.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                                ep.video.secure_url = ep.video.url;
                                modified = true;
                            }
                        }
                    }
                }
            }

            if (modified) {
                await doc.save();
                contentCount++;
            }
        }
        console.log(`Fixed ${contentCount} Content items.`);

        console.log('Fixing ForYou...');
        const fyResult = await ForYou.find();
        let fyCount = 0;
        for (let doc of fyResult) {
            let modified = false;
            if (doc.image && doc.image.includes('undefined/uploads')) {
                doc.image = doc.image.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                modified = true;
            }
            if (doc.video && doc.video.url && doc.video.url.includes('undefined/uploads')) {
                doc.video.url = doc.video.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                doc.video.secure_url = doc.video.url;
                modified = true;
            }
            
            if (doc.seasons && doc.seasons.length > 0) {
                for (let season of doc.seasons) {
                    if (season.episodes && season.episodes.length > 0) {
                        for (let ep of season.episodes) {
                            if (ep.video && ep.video.url && ep.video.url.includes('undefined/uploads')) {
                                ep.video.url = ep.video.url.replace('undefined/uploads', 'https://api.inplays.in/uploads');
                                ep.video.secure_url = ep.video.url;
                                modified = true;
                            }
                        }
                    }
                }
            }
            if (modified) {
                await doc.save();
                fyCount++;
            }
        }
        console.log(`Fixed ${fyCount} ForYou items.`);

        console.log('All Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixUndefinedUrls();
