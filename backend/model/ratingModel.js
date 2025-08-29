const { Schema, model } = require("mongoose");

const RatingSchema = new Schema(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    value: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RatingSchema.index({ blog: 1, user: 1 }, { unique: true });

module.exports = model("Rating", RatingSchema);
