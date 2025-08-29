const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.route("/").get(getBlogs);

router.post("/", authMiddleware, createBlog);

router.delete("/:id", authMiddleware, deleteBlog);
router.put("/:id", authMiddleware, updateBlog);
router.route("/:id").get(getBlog).post(updateBlog);

module.exports = router;
