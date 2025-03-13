require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration (Now using environment variable)
const mongoURI = process.env.MONGO_URI;

// Check if MongoDB URI is loaded
if (!mongoURI) {
    console.error("❌ Error: MONGO_URI is not set in .env file");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define a Mongoose Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    category: String,
    price: Number,
    description: String,
});

// Create a Mongoose Model
const Book = mongoose.model("Book", bookSchema);

// Routes
app.get('/', (req, res) => {
    res.send('📚 Welcome to BookFlix API!');
});

// Upload a book to MongoDB
app.post("/upload-book", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.json(savedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all books (with optional category filter)
app.get("/all-books", async (req, res) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a book by ID
app.patch("/book/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ error: "Book not found!" });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a book by ID
app.delete("/book/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ error: "Book not found!" });
        res.json({ message: "Book deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single book by ID
app.get("/book/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found!" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
