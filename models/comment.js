const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: "User" },
   content: { type: String, required: true },
   createdAt: { type: Number, default: Date.now },
   updatedAt: { type: Number, default: Date.now },
});

// Virtual for comment's URL.
CommentSchema.virtual("url").get(function () {
   return `/api/comment/${this.id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);
