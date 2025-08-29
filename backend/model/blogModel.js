const { Schema, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    body: { type: String, required: [true, "Body is required"] },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = model("Blog", BlogSchema);
