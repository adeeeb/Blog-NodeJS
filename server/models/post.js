const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// define the Schema (the structure of the article)
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  articaleImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on that schema and
//export the model
module.exports = mongoose.model("Post", PostSchema);
