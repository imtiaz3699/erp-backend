import { errorResponse, successResponse } from "../helper/helperFunctions.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

export const createSupplier = async (req, res) => {
    const { name, phone, email, address, createdBy } = req.body;
    try {

        const isSupplierExists = await Supplier.findOne({
            name, email
        })

        if (isSupplierExists) {
            return errorResponse(res, 400, 'Supplier with this name or email already exists.');
        }

        if (!name) {
            return errorResponse(res, 400, 'Name is required.');
        }
        if (!email) {
            return errorResponse(res, 400, 'Email is required.');
        }
        if (!phone) {
            return errorResponse(res, 400, 'Phone number is required.');
        }
        const supplier = new Supplier({
            name, phone, email, address, createdBy
        })
        await supplier.save();
        return successResponse(res, 200, "Supplier Created", supplier)
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal server error", e.message);
    }
}

export const getSingleSupplier = async (req, res) => {
    try {
        const supplierId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(supplierId)) {
            return errorResponse(res, 400, "Invalid supplier id.");
        }

        const supplier = await Supplier.findById(supplierId);

        if (!supplier) {
            return errorResponse(res, 404, "Supplier not found.");
        }

        return successResponse(res, 200, "Supplier found.", supplier);

    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal server error.", e.message);
    }
};
// 6a1174b775d12fa63f64dff

export const getAllSuppliers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const suppliers = await Supplier
            .find({})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .populate('createdBy');

        const totalRecords = await Supplier.countDocuments();
        return successResponse(res, 200, 'Suppliers found.', { totalRecords: totalRecords, data: suppliers, page, limit, });
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, 'Internal server error.', e.message);
    }
}

export const updateSupplier = async (req, res) => {
    const supplierId = req.params.id;
    const { name, phone, email, address, isActive, updatedBy } = req.body;
    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return errorResponse(res, 404, 'Supplier not found.');
        }
        const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, { name, phone, email, address, isActive, updatedBy }, { new: true });
        return successResponse(res, 200, 'Supplier updated.', updatedSupplier);
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, 'Internal server error.', e.message);
    }
}

export const deleteSuppliers = async (req, res) => {
    const supplierIds = req.body.ids; // expecting an array of supplier IDs
    try {
        if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
            return errorResponse(res, 400, 'Please provide an array of supplier IDs to delete.');
        }
        const deleteResult = await Supplier.deleteMany({ _id: { $in: supplierIds } });
        return successResponse(res, 200, `${deleteResult.deletedCount} suppliers deleted.`);
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, 'Internal server error.', e.message);
    }
}