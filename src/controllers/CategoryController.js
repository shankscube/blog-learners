const categoryService = require("../services/CategoryService");
const { responseIssues, responseOk } = require("../utils/responder");
const logger = require("../utils/logger");

exports.getCategories = async (request, response, next) => {
  try {
    const categories = await categoryService.getAllCategories();

    if (!categories || categories.length === 0) {
      logger.warn("CATEGORY_NOT_FOUND");
      return responseIssues(response, "CATEGORY_NOT_FOUND");
    }
    logger.info("Categories Fetched", categories);
    return responseOk(response, "CATEGORY_FETCHED", categories);
  } catch (error) {
    logger.error("Get categories error:", error);
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.getCategoryById = async (request, response) => {
  try {
    const category = await categoryService.getCategoryById(request.params.id);
    logger.info("Category Fetched", category);
    return responseOk(response, "CATEGORY_FETCHED", category);
  } catch (error) {
    logger.error("Get category by ID error", {
      message: error.message,
      categoryId: request.params.id,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.createCategory = async (request, response) => {
  try {
    const category = await categoryService.createCategory(request.body);
    logger.info("Category created successfully", {
      categoryId: category.id,
      name: category.name,
      slug: category.slug,
    });
    return responseOk(response, "CATEGORY_CREATED", category);
  } catch (error) {
    logger.error("Create category error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.updateCategory = async (request, response) => {
  try {
    const category = await categoryService.updateCategory(
      request.params.id,
      request.body
    );
    logger.info("Category updated successfully", {
      categoryId: category.id,
      name: category.name,
      slug: category.slug,
    });
    return responseOk(response, "CATEGORY_UPDATED", category);
  } catch (error) {
    logger.error("Update category error", {
      categoryId: request.params.id,
      message: error.message,
      stack: error.stack,
    });

    if (error.message === "Category not found") {
      return response.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Category slug already exists") {
      return response.status(409).json({
        success: false,
        message: error.message,
      });
    }
    return responseIssues(response, "SERVER_ERROR");
  }
};
