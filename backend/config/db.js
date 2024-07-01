const mongoose = require('mongoose');

const conenctDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB connected ${conn.connection.host}`.yellow.bold);
  }catch(er) {
    console.log(`Can't connect ${er.message}`.red.bold);
    process.exit();
  }
}

module.exports = conenctDB;