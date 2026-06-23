import Product from "../models/product.model.js";
import { body, validationResult } from "express-validator";
import { uploadToCloudinary } from "../middleware/upload.js";
import Stock from "../models/stock.model.js";
import mongoose from "mongoose";
export const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, barcode, category, brand, unit, costPrice, sellingPrice, isActive } = req.body;

        const isProductExists = await Product.findOne({ name, barcode });
        if (isProductExists) {
            return res.status(400).json({ message: "Product already exists" });
        }
        const images = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                console.log(result, 'fasldfjhalsdfjhlasdjfhlasjd')
                images.push({
                    url: result.secure_url,     // ⭐ IMPORTANT
                    public_id: result.public_id
                });
            }
        }
        console.log(req.files, 'myFiles')
        const product = new Product({
            name,
            barcode,
            category,
            brand,
            unit,
            costPrice,
            sellingPrice,
            isActive,
            productImages: images
        });
        await product.save();
        res.status(201).json({ message: product });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, barcode, category, brand, unit, costPrice, sellingPrice, isActive } = req.body;
        const isProductExists = await Product.findById(productId);
        if (!isProductExists) {
            return res.status(400).json({ message: "Product not found" });
        }
        const images = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                console.log(result, 'fasldfjhalsdfjhlasdjfhlasjd')
                images.push({
                    url: result.secure_url,     // ⭐ IMPORTANT
                    public_id: result.public_id
                });
            }
        }
        if (isProductExists) {
            const updateProduct = await Product.findByIdAndUpdate(productId, {
                name,
                barcode,
                category,
                brand,
                unit,
                costPrice,
                sellingPrice,
                isActive,
                productImages: images
            })
            res.status(200).json({ message: "Product updated" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const skip = (page - 1) * limit;

        const total = await Product.countDocuments();

        const products = await Product.find({})
            .populate('category brand')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        console.log(products, 'falsdjfhlasjfhdlasjkfhdlkasjd')
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: products,
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const isProductExists = await Product.findById(productId);

        if (!isProductExists) {
            return res.status(400).json({ message: "Product not found" });
        }

        const product = await Product.findByIdAndDelete(productId);

        if (product) {
            res.status(200).json({ message: "Product deleted" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}



export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.params;
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });

        return res.status(200).json(products);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const searchProductByNameAndBranch = async (req, res) => {
    const { branchId, name } = req.params;
    try {
        const stocks = await Stock.aggregate([
            {
                $match: {
                    branchId: new mongoose.Types.ObjectId(branchId),
                    quantity: { $gt: 0 }
                },


            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $match: {
                    "product.name": {
                        $regex: name,
                        $options: "i"
                    }
                }
            }
        ])
        console.log(stocks, 'fasdlfjhasldkjfsd')
        return res.status(200).json(stocks);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}