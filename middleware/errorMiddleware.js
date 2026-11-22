
const errorMiddleware = (err, req, res, next) => {

    console.error(err.message);

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: err.message
        });
    }

    // Duplicate SKU Error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "SKU already exists"
        });
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }

    // Default Error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorMiddleware;
