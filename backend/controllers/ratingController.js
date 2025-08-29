const asyncHandler = require("express-async-handler");
const ratingService = require("../service/ratingService");

const rateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { value } = req.body;
  const rating = await ratingService.rate(blogId, req.user.id, Number(value));
  res.status(200).json(rating);
});

const getBlogRatingSummary = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const summary = await ratingService.getBlogAverage(blogId);
  res.status(200).json(summary);
});

const getMyRating = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const my = await ratingService.getMyRating(blogId, req.user.id);
  res.status(200).json(my || null);
});

module.exports = { rateBlog, getBlogRatingSummary, getMyRating };
