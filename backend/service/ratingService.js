const mongoose = require("mongoose");
const ratingModel = require("../model/ratingModel");
const blogModel = require("../model/blogModel");
const ApiError = require("../exceptions/ApiError");

class RatingService {
  async rate(blogId, userId, value) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw ApiError.BadRequest("Invalid blogId");
    }
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw ApiError.BadRequest("Rating value must be 1..5");
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) throw ApiError.NotFound();
    if (blog.user.toString() === userId)
      throw ApiError.Forbidden("You cannot rate your own blog");

    const rating = await ratingModel.findOneAndUpdate(
      { blog: blogId, user: userId },
      { value, $setOnInsert: { createdAt: new Date() } },
      { new: true, upsert: true }
    );
    return rating;
  }

  async getBlogAverage(blogId) {
    const rows = await ratingModel.aggregate([
      { $match: { blog: new mongoose.Types.ObjectId(blogId) } },
      { $group: { _id: "$blog", avg: { $avg: "$value" }, count: { $sum: 1 } } },
    ]);
    const { avg = 0, count = 0 } = rows[0] || {};
    return { avg, count };
  }

  async getMyRating(blogId, userId) {
    return ratingModel.findOne({ blog: blogId, user: userId });
  }
}

module.exports = new RatingService();
