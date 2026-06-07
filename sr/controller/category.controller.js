import Category from "../models/category.model.js";
import { body, validationResult } from "express-validator";


export const createCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const isCategoryExists = await Category.findOne({ name });

        if (isCategoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({
            name,
            description,
            isActive
        });

        await category.save();
        res.status(201).json({ message: "Category created." });

    } catch (e) {
        console.log(e, 'fasdlfjshladkfjasd');
        res.status(500).json({ error: e.message });
    }
}
export const updateCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const isCategoryExists = await Category.findById(id);
        if (!isCategoryExists) {
            return res.status(400).json({ message: "Category not found" });
        }
        const { name, description, isActive } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const category = await Category.findByIdAndUpdate(id, {
            name,
            description,
            isActive
        },
            {
                new: true
            });
        res.status(201).json({ message: category });
    } catch (e) {
        console.log(e, 'fasdlfjshladkfjasd');
        res.status(500).json({ error: e.message });
    }
}

export const getAllCategories = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // calculate skip
        const skip = (page - 1) * limit;

        // get total count
        const total = await Category.countDocuments();

        // fetch paginated data
        const categories = await Category.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: categories,
        });
    } catch (e) {
        console.log(e, 'fasdlfjshladkfjasd');
        res.status(500).json({ error: e.message });
    }
}

export const getSingleCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const isCategoryExists = await Category.findById(req.params.id);
        if (!isCategoryExists) {
            return res.status(400).json({ message: "Category not found" });
        }
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.status(200).json({ message: "Category deleted" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}