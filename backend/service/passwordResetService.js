const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userModel = require("../model/user-model");
const ResetToken = require("../model/passwordResetTokenModel");
const ApiError = require("../exceptions/ApiError");
const { sendResetMail } = require("./mailService");

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

class PasswordResetService {
  async requestReset(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const ttlMin = Number(process.env.RESET_TOKEN_TTL_MIN || 60);
    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    await ResetToken.updateMany(
      { user: user._id, used: false },
      { $set: { used: true } }
    );

    await ResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
      used: false,
    });

    const link = `${process.env.CLIENT_URL}/new-password?token=${rawToken}`;
    await sendResetMail(user.email, link);
  }

  async resetPassword(rawToken, newPassword) {
    if (!rawToken || !newPassword) throw ApiError.BadRequest("Invalid payload");
    const tokenHash = sha256(rawToken);
    const record = await ResetToken.findOne({ tokenHash });
    if (!record) throw ApiError.BadRequest("Invalid or expired token");
    if (record.used) throw ApiError.BadRequest("Token already used");
    if (record.expiresAt.getTime() < Date.now())
      throw ApiError.BadRequest("Token expired");

    const user = await userModel.findById(record.user);
    if (!user) throw ApiError.BadRequest("Invalid token");

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    record.used = true;
    await record.save();
  }
}

module.exports = new PasswordResetService();
