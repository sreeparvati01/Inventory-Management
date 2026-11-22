
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Product Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Inventory Management API is running!");
});

// 404 - Route Not Found
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
