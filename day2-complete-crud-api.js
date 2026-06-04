// ============================================
// COMPLETE PRODUCTION-STYLE CRUD API
// This is what you write in real projects
// ============================================

const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

// Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name required"], trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  category: {
    type: String,
    required: true,
    enum: ["electronics", "clothing", "books", "other"]
  },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

// asyncHandler — wraps async functions to catch errors automatically
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

// GET all products with filters, search, pagination, sort
router.get("/", asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query

  // Build filter object dynamically
  const filter = { isActive: true }

  if (category) filter.category = category
  if (search) filter.name = { $regex: search, $options: "i" }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  // Sort
  const sortOptions = {
    "price_asc": { price: 1 },
    "price_desc": { price: -1 },
    "newest": { createdAt: -1 },
    "oldest": { createdAt: 1 }
  }
  const sortBy = sortOptions[sort] || { createdAt: -1 }

  // Pagination
  const pageNum = Number(page)
  const limitNum = Number(limit)
  const skip = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(filter)
  ])

  res.status(200).json({
    success: true,
    count: products.length,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    },
    products
  })
}))

// GET single product
router.get("/:id", asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product || !product.isActive) {
    return next(new AppError("Product not found", 404))
  }

  res.status(200).json({ success: true, product })
}))

// POST create product
router.post("/", protect, authorize("admin"), asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body

  if (!name || !description || !price || !category) {
    return next(new AppError("name, description, price, category required", 400))
  }

  const product = await Product.create({ name, description, price, category, stock })

  res.status(201).json({ success: true, product })
}))

// PUT update product
router.put("/:id", protect, authorize("admin"), asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  if (!product) {
    return next(new AppError("Product not found", 404))
  }

  res.status(200).json({ success: true, product })
}))

// DELETE product (soft delete)
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  )

  if (!product) {
    return next(new AppError("Product not found", 404))
  }

  res.status(200).json({ success: true, message: "Product deleted" })
}))