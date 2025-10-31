const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('strictQuery', true);

const connect = async () => {
  if (!env.mongoUri) {
    throw new Error('MongoDB connection string is not configured');
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
};

const disconnect = async () => {
  await mongoose.connection.close();
};

module.exports = {
  connect,
  disconnect,
};
