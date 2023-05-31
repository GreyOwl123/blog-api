const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
   first_name: String,
   last_name: String,
   username: String,
   password: String,
});

// Virtual for author's URL.
AuthorSchema.virtual("url").get(function () {
   return `/api/author/${this.id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
