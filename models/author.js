const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
   first_name: { type: String, required: true, maxLength: 100 },
   last_name: { type: String, required: true, maxLength: 100 },
   username: { type: String, required: true, maxLength: 20 },
   password: { type: String, required: true },
});

// Virtual for Author's full name
AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.last_name) {
    fullname = "";
  }
  return fullname;
});


// Virtual for author's URL.
AuthorSchema.virtual("url").get(function () {
   return `/api/author/${this.id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
