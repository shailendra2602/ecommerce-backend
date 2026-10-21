
import Product from "../models/Product.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE one product or multiple products
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = (product) =>
      product.name &&
      product.price != null &&
      product.image &&
      product.category;

    if (Array.isArray(data)) {
      if (data.length === 0 || !data.every(requiredFields)) {
        return res.status(400).json({
          success: false,
          message:
            "Every product must have name, price, image and category",
        });
      }

      const products = await Product.insertMany(data);

      return res.status(201).json({
        success: true,
        message: `${products.length} products created successfully`,
        products,
      });
    }

    if (!requiredFields(data)) {
      return res.status(400).json({
        success: false,
        message: "Name, price, image and category are required",
      });
    }

    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
