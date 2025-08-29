const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  rateBlog,
  getBlogRatingSummary,
  getMyRating,
} = require("../controllers/ratingController");

router.post("/:blogId", auth, rateBlog);
router.get("/:blogId/summary", getBlogRatingSummary);
router.get("/:blogId/me", auth, getMyRating);

module.exports = router;
