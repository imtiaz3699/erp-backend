import Branch from "../models/branch.model.js";
import { body, validationResult } from "express-validator";

export const createBranch = async (req, res) => {
    try {
        const { name, type, phone, email, managerId, address, status, openingDate, createdBy, updatedBy } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!phone) {
            return res.status(400).json({ message: "Phone is required" });
        }
        const isBranchExists = await Branch.findOne({
            name,
        })
        if (isBranchExists) {
            return res.status(400).json({ message: "Branch already exists" });
        }

        const branch = new Branch({
            name, type, phone, email, managerId, address, status, openingDate, createdBy, updatedBy,
        })
        await branch.save();
        res.status(201).json({ message: "Branch created" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}


export const updateBranch = async (req, res) => {
    const branchId = req.params.id;
    try {
        const { name, type, phone, email, managerId, address, status, openingDate, createdBy, updatedBy } = req.body;
        const isBranchExists = await Branch.findById(branchId);
        if (!isBranchExists) {
            return res.status(400).json({ message: "Branch not found" });
        }
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const branchUpdated = await Branch.findByIdAndUpdate(branchId, {
            name, type, phone, email, managerId, address, status, openingDate, createdBy, updatedBy
        }, {
            new: true
        })
        res.status(201).json({ message: branchUpdated });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getSingleBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        res.status(200).json(branch);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const deleteBranch = async (req, res) => {
    try {
        const isBranchExists = await Branch.findById(req.params.id);
        if (!isBranchExists) {
            return res.status(400).json({ message: "Branch not found" });
        }
        const branch = await Branch.findByIdAndDelete(req.params.id);
        if (branch) {
            res.status(200).json({ message: "Branch deleted" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}
export const getAllBranches = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;
        const total = await Branch.countDocuments();

        const branches = await Branch.find({})
            .populate('managerId createdBy updatedBy')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: branches
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

