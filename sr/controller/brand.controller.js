import Brand from "../models/brand.model.js";
import { body, validationResult } from "express-validator";


export const createBrand = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const isBrandExists = await Brand.findOne({ name });

        if (isBrandExists) {
            return res.status(400).json({ message: "Brand already exists" });
        }

        const brand = new Brand({
            name,
            description,
            isActive
        });

        await brand.save();
        res.status(201).json({ message: "Brand created" });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}
export const updateBrand = async (req, res) => {
    const id = req.params.id;
    try {
        const { name, description, isActive } = req.body;
        const isBrandExists = await Brand.findById(id);
        if (!isBrandExists) {
            return res.status(400).json({ message: "Brand not found" });
        }
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const brandUpdated = await Brand.findByIdAndUpdate(id, {
            name,
            description,
            isActive
        }, {
            new: true
        })
        res.status(201).json({ message: brandUpdated });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}


export const getAllBrands = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // calculate skip
        const skip = (page - 1) * limit;

        // get total count
        const total = await Brand.countDocuments();

        // fetch paginated data
        const brands = await Brand.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: brands,
        });
    } catch (e) {
        console.log(e, 'fasdlfjshladkfjasd');
        res.status(500).json({ error: e.message });
    }
}

export const getSingleBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        res.status(200).json(brand);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const deleteBrand = async (req, res) => {
    try {
        const isBrandExists = await Brand.findById(req.params.id);
        if (!isBrandExists) {
            return res.status(400).json({ message: "Brand not found" });
        }
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (brand) {
            res.status(200).json({ message: "Brand deleted" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}
