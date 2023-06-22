const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, lowercase: true, },
    password: { type: String, required: true },
});

// Virtual for user's URL.
UserSchema.virtual("url").get(function () {
   return `/api/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);
