const asyncHandler = require("express-async-handler");
const blogService = require("../service/blogService");
const ApiError = require("../exceptions/ApiError");

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getBlogs();
  res.status(200).json(blogs);
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogWithRating(req.params.id);
  if (!blog) throw ApiError.NotFound();
  res.status(200).json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
  if (!req.body.text && !req.body.title) {
    throw ApiError.BadRequest();
  }
  const title = req.body.title;
  const body = req.body.body;
  const id = req.user.id;
  const blog = await blogService.createBlog(title, body, id);
  return res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const updated = await blogService.updateBlog(
    req.params.id,
    req.body,
    req.user.id
  );
  if (!updated) throw ApiError.NotFound();
  if (updated === "forbidden") throw ApiError.Forbidden();
  res.status(200).json(updated);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await blogService.deleteBlog(req.params.id, req.user.id);
  if (!deleted) throw ApiError.NotFound();
  if (deleted === "forbidden") throw ApiError.Forbidden();
  res.status(200).json(deleted);
});

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getBlogsWithRatings({
    search: req.query.search,
    from: req.query.from,
    to: req.query.to,
    sort: req.query.sort,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.status(200).json(blogs);
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
