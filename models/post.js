const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
   title: { type: String, required: true },
   author: { type: Schema.Types.ObjectId, ref: "Author" },
   content: { type: String, required: true },
   createdAt: { type: Number, default: Date.now },
   updatedAt: { type: Number, default: Date.now },
});

// Virtual for post's URL.
PostSchema.virtual("url").get(function () {
   return `/api/post/${this.id}`;
});

module.exports = mongoose.model("Post", PostSchema);
