const mongoose = require('mongoose');
const Website = require('./models/website.model.js');

async function checkSite() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai-website-builder');
    const site = await Website.findById('69d3462fc0a761ddfd8ea630');
    if (!site) {
      console.log('Site not found');
      process.exit(1);
    }
    console.log('--- TITLE ---');
    console.log(site.title);
    console.log('--- CODE START ---');
    console.log(site.latestCode.substring(0, 2000));
    console.log('--- CODE END ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSite();
