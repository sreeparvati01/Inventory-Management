
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"]
    },

    sku: {
        type: String,
        required: [true, "SKU is required"],
        unique: true,
        trim: true,
        uppercase: true
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },

    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: "Quantity must be a whole number"
        }
    },

    reorderLevel: {
        type: Number,
        required: true,
        min: [0, "Reorder level cannot be negative"],
        default: 10,
        validate: {
            validator: Number.isInteger,
            message: "Reorder level must be a whole number"
        }
    },

    supplier: {
        type: String,
        trim: true
    }

}, { timestamps: true });


// VIRTUAL PROPERTY
productSchema.virtual("stockValue").get(function () {
    return this.price * this.quantity;
});


module.exports = mongoose.model("Product", productSchema);
