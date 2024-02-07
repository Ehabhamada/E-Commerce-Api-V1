const mongoose = require('mongoose');

const dbConnect = async() => {
  try {
    mongoose.set('strictQuery',true)
    const connected = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Database Connected: ${connected.connection.host}`)
  } 
     catch(err){
    console.log(`Database Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;

