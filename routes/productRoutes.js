
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const validateProduct = require("../middleware/validateProduct");


// CREATE PRODUCT API
router.post("/", validateProduct, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
});


// GET ALL PRODUCTS WITH FILTERING, SORTING & PAGINATION
router.get("/", async (req, res, next) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        // FILTER BY CATEGORY
        if (category) {
            filter.category = category;
        }

        // FILTER BY PRICE
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // PAGINATION
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));

        // SORTING
        const sortOption = sort || "createdAt";

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: products
        });

    } catch (error) {
        next(error);
    }
});


// LOW STOCK REPORT API
router.get("/low-stock", async (req, res, next) => {
    try {
        const lowStockItems = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json({
            success: true,
            count: lowStockItems.length,
            lowStockItems
        });

    } catch (error) {
        next(error);
    }
});


// CATEGORY-WISE INVENTORY SUMMARY API
router.get("/summary", async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalItems: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalStockValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    },
                    avgPrice: { $avg: "$price" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            categories: summary.length,
            summary
        });

    } catch (error) {
        next(error);
    }
});


// GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error);
    }
});


// UPDATE PRODUCT API
router.put("/:id", validateProduct, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
});


// STOCK ADJUSTMENT API
router.patch("/:id/stock", async (req, res, next) => {
    try {
        const change = Number(req.body.change);

        if (!Number.isFinite(change) || change === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid stock change"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                $expr: {
                    $gte: ["$quantity", -change]
                }
            },
            {
                $inc: { quantity: change }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            const exists = await Product.exists({
                _id: req.params.id
            });

            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product
        });

    } catch (error) {
        next(error);
    }
});


// DELETE PRODUCT API
router.delete("/:id", async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;
