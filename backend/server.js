const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
