const Category = require("../models/Category");

exports.getAllCategories = async () => {
  return await Category.findAll({
    order: [["name", "ASC"]],
  });
};

exports.getCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

exports.createCategory = async (categoryData) => {
  const { name, slug, description, parent_id } = categoryData;
  // Validate required fields
  if (!name) {
    throw new Error("Category name is required");
  }

  if (!slug) {
    throw new Error("Category slug is required");
  }

  // Check if slug already exists
  const existingCategory = await Category.findOne({
    where: {
      slug,
    },
  });

  if (existingCategory) {
    throw new Error("Category slug already exists");
  }

  // Create category
  const category = await Category.create({
    name,
    slug,
    description: description || null,
    parent_id: parent_id || null,
  });

  return category;
};

exports.updateCategory = async (id, categoryData) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error("Category not found");
  }
  const { name, slug, description, parent_id } = categoryData;
  // Check duplicate slug
  if (slug && slug !== category.slug) {
    const existingCategory = await Category.findOne({
      where: {
        slug,
      },
    });
    if (existingCategory) {
      throw new Error("Category slug already exists");
    }
  }
  // Update only fields that are provided
  if (name !== undefined) {
    category.name = name;
  }
  if (slug !== undefined) {
    category.slug = slug;
  }
  if (description !== undefined) {
    category.description = description;
  }
  if (parent_id !== undefined) {
    category.parent_id = parent_id;
  }
  await category.save();
  return category;
};
