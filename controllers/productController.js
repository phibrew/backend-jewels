import { Product } from "../models/productModel.js";

export const createProduct = async (req, res) => {
    try { 
        const images = req.files ? req.files.map(file=>
            `uploads/products/${file.filename}`
        ): []; // Assuming you're using multer for file uploads
        const { name, description, price, category, stock } = req.body;
        if(!name || !description || !price || !images || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        const numericStock = parseInt(stock);
        if (isNaN(numericStock) || numericStock < 0) {
            return res.status(400).json({ message: "Stock must be a non-negative integer" });
        }
        const newProduct = new Product({
        name,
        description,
        price,
        images,     
        category,
        stock,
        });
        await newProduct.save();
        return res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        return res.status(400).json({ message: "Error creating product", error: error.message });
    }
}

export const getProductByID = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return res.status(400).json({ message: "Error fetching products", error: error.message });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const { page=1, limit=10 } = req.query;
        const products = await Product.find()
            .limit(limit).skip((page - 1) * limit);
        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return res.status(400).json({ message: "Error fetching products", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let updateData = {...req.body };
        if (req.file) {
            const images = req.file.map(file=>
                `uploads/products/${file.filename}`
            );
            updateData.images = images;
        }
        product.set(updateData);
        await product.save();   

        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        return res.status(400).json({ message: "Error updating product", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }   
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Error deleting product", error: error.message });
    }
}

export const searchProducts = async (req, res) => {
    const { query, page=1, limit=10 } = req.query();

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        }).limit(limit).skip((page - 1) * limit);
        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}

export const filterProducts = async (req, res) => {
    const { category, tags, priceRange, page=1, limit = 10 } = req.query;
    try {
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if(tags){
            filter.tags = { $in: tags.split(",") }; // Assuming tags is a comma-separated string
        }
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split(",").map(Number);
            filter.price = { $gte: minPrice, $lte: maxPrice };
        }
        const products = await Product.find(filter)
        .limit(limit).skip((page - 1) * limit);
        if(!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        return res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}