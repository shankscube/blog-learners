const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const postRoutes = require("./routes/postRoute");
const logger = require("./utils/logger");
const app = express();

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.postLogger);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blogs API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);

module.exports = app;
