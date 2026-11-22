
const validateProduct = (req, res, next) => {

    const {
        name,
        sku,
        category,
        price,
        quantity,
        reorderLevel,
        supplier
    } = req.body;

    const errors = [];

    // Required fields for POST
    if (req.method === "POST") {
        if (!name) errors.push("Product name is required");
        if (!sku) errors.push("SKU is required");
        if (!category) errors.push("Category is required");
        if (price === undefined) errors.push("Price is required");
    }

    // Name validation
    if (name !== undefined &&
        (typeof name !== "string" || name.trim().length < 2)) {
        errors.push("Name must contain at least 2 characters");
    }

    // SKU validation
    if (sku !== undefined &&
        (typeof sku !== "string" || !sku.trim())) {
        errors.push("Valid SKU is required");
    }

    // Category validation
    if (category !== undefined &&
        (typeof category !== "string" || !category.trim())) {
        errors.push("Valid category is required");
    }

    // Price validation
    if (price !== undefined &&
        (typeof price !== "number" || !Number.isFinite(price) || price < 0)) {
        errors.push("Price must be a non-negative number");
    }

    // Quantity validation
    if (quantity !== undefined &&
        (!Number.isInteger(quantity) || quantity < 0)) {
        errors.push("Quantity must be a non-negative integer");
    }

    // Reorder level validation
    if (reorderLevel !== undefined &&
        (!Number.isInteger(reorderLevel) || reorderLevel < 0)) {
        errors.push("Reorder level must be a non-negative integer");
    }

    // Supplier validation
    if (supplier !== undefined && typeof supplier !== "string") {
        errors.push("Supplier must be a string");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }

    next();
};

module.exports = validateProduct;
