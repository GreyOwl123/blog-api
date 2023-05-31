const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
   username: String,
   password: String,
});

// Virtual for user's URL.
UserSchema.virtual("url").get(function () {
   return `/api/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);
