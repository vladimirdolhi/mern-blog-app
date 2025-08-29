const mongoose = require("mongoose");

const blogModel = require("../model/blogModel");
const ratingModel = require("../model/ratingModel");

class BlogService {
  async createBlog(title, body, userId) {
    const blog = await blogModel.create({
      title: title,
      body: body,
      user: userId,
    });
    return blog;
  }

  async getBlogs() {
    return await blogModel.find();
  }

  async getBlogById(id) {
    return await blogModel.findById(id);
  }

  async updateBlog(id, data, userId) {
    const blog = await blogModel.findById(id);
    if (!blog) return null;
    if (blog.user.toString() !== userId) return "forbidden";

    const updatedGoal = await blogModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return await updatedGoal;
  }

  async deleteBlog(id, userId) {
    const blog = await blogModel.findById(id);
    if (!blog) return null;
    if (blog.user.toString() !== userId) return "forbidden";

    await blog.deleteOne();
    return blog;
  }

  async getBlogsWithRatings({
    search,
    from,
    to,
    sort = "date_desc",
    page = 1,
    limit = 20,
  }) {
    const match = {};
    if (search) {
      const re = new RegExp(search, "i");
      match.$or = [{ title: re }, { body: re }];
    }
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from + "T00:00:00Z");
      if (to) match.createdAt.$lte = new Date(to + "T23:59:59Z");
    }

    const sortMap = {
      date_desc: { createdAt: -1, ratingAvg: -1 },
      date_asc: { createdAt: 1, ratingAvg: -1 },
      rating_desc: { ratingAvg: -1, createdAt: -1 },
      rating_asc: { ratingAvg: 1, createdAt: -1 },
    };
    const sortSpec = sortMap[sort] || sortMap.date_desc;

    const skip = (Number(page) - 1) * Number(limit);
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "blog",
          as: "ratings",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$ratings" },
          ratingAvg: {
            $cond: [
              { $gt: [{ $size: "$ratings" }, 0] },
              { $avg: "$ratings.value" },
              0,
            ],
          },
        },
      },
      { $project: { ratings: 0, __v: 0 } },
      { $sort: sortSpec },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];

    return blogModel.aggregate(pipeline);
  }

  async getBlogWithRating(id) {
    const blog = await blogModel.findById(id).populate("user", "name").lean();
    if (!blog) return null;

    const rows = await ratingModel.aggregate([
      { $match: { blog: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$blog", avg: { $avg: "$value" }, count: { $sum: 1 } } },
    ]);
    const { avg = 0, count = 0 } = rows[0] || {};
    return { ...blog, ratingAvg: avg, ratingCount: count };
  }
}

module.exports = new BlogService();
