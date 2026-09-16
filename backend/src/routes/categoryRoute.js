const express = require("express");

const categoryMiddleware = require("../middleware/CategoryMiddleware");
const categoryController = require("../controllers/CategoryController");

const router = express.Router();

router.get(
  "/allcategory",
  categoryMiddleware,
  categoryController.getCategories
);
router.get("/:id", categoryMiddleware, categoryController.getCategoryById);
router.put("/edit/:id", categoryMiddleware, categoryController.updateCategory);
router.post(
  "/postcategory",
  categoryMiddleware,
  categoryController.createCategory
);

module.exports = router;
