const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/github-analytics';
  let retries = 5;

  while (retries) {
    try {
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected:', uri.replace(/\/\/.*@/, '//***@'));
      break;
    } catch (err) {
      console.error(`❌ MongoDB connection failed (${retries} retries left):`, err.message);
      retries -= 1;
      if (!retries) {
        console.error('MongoDB connection failed after all retries. Running without DB.');
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
