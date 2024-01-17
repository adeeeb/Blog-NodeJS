const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// define the Schema (the structure of the article)
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model based on that schema and
//export the model
module.exports = mongoose.model("User", UserSchema);
