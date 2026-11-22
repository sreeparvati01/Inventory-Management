# Inventory Management System

This is a simple Inventory Management System made using Node.js, Express.js and MongoDB.

It helps users manage products and their stock details.

## Features

- Add new products
- View all products
- View product by ID
- Update product details
- Delete products
- Validate product information
- Filter products
- Sort products
- Pagination
- Check low-stock products
- View category-wise summary
- Adjust product stock

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- Postman

## Project Structure

```text
Inventory-Management/
│
├── config/
├── middleware/
├── models/
├── routes/
├── outputs/
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## How to Run the Project

**1. Clone the repository**

```bash
git clone https://github.com/sreeparvati01/Inventory-Management
```

**2. Open the project folder**

```bash
cd Inventory-Management
```

**3. Install dependencies**

```bash
npm install
```

**4. Create a `.env` file**

Add your MongoDB connection string:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/InventoryDB
```

**5. Start the server**

```bash
node server.js
```

Server runs on port 5000.

## API Testing

All APIs are tested using Postman.

## Screenshots

The `outputs` folder contains screenshots of:

1. Create Product
2. Get All Products
3. Update Product
4. Delete Product
5. Validation
6. Filtering
7. Sorting
8. Pagination
9. Low Stock
10. Category Summary
11. Stock Adjustment

## Author

Developed as part of the Unit 3 Assignment.