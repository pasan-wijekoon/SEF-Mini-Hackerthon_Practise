const mongoose = require('mongoose');
const dns = require('dns');

// The local/OS DNS resolver in this environment fails to answer SRV queries
// (used by mongodb+srv:// connection strings). Point Node's resolver at a
// public DNS server so the Atlas SRV lookup succeeds.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
