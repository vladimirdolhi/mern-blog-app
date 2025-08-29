const { Schema, model } = require("mongoose");

const PasswordResetTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("PasswordResetToken", PasswordResetTokenSchema);
