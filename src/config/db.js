const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexão ao banco estabelecida com sucesso!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
