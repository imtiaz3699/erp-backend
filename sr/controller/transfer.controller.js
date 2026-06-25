import Transfer from "../models/transfer.model.js";
import { successResponse, errorResponse } from "../helper/helperFunctions.js";
import Stock from '../models/stock.model.js'
import StockMovement from "../models/stockmovement.model.js";
import mongoose from "mongoose";
export const CreateTransfer = async (req, res) => {
    const { fromBranchId, toBranchId, items } = req.body;
    try {
        if (!items?.length) {
            return errorResponse(res, 400, "Atleast one product is required.");
        }

        for (const item of items) {
            if (!item.productId) {
                return errorResponse(res, 400, "Please select a product.");
            }
            const stock = await Stock.findOne({ productId: item.productId, branchId: fromBranchId })

            if (!stock) {
                return errorResponse(res, 400, "Stock does not exists.");
            }

            if ((stock.quantity < item.quantity) || (stock.quantity === 0) || (item.quantity <= 0)) {
                return errorResponse(res, 400, `Insufficient stock. Available stock ${stock.quantity}`)
            }
        }
        const transfer = await Transfer.create({ fromBranchId, toBranchId, items, createdBy: req.user.id });
        // const movement = await StockMovement.create({
        //     productId: item.productId,
        //     branchId: isTransferExists.toBranchId,
        //     type: "IN",
        //     quantity: item.quantity,
        //     referenceType: "TRANSFER",
        //     referenceId: id,
        //     fromBranchId: isTransferExists.fromBranchId,
        //     toBranchId: isTransferExists.toBranchId,
        //     costPrice: 0,
        //     sellingPrice: 0,
        //     createdBy: req.user.id
        // }, { session })
        return successResponse(res, 200, "Transfer Created successfully.", transfer)
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, e.message);
    }
}

export const getAllTransfers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const transfers = await Transfer.find({}).populate('fromBranchId toBranchId').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
        const totalRecords = await Transfer.countDocuments();
        return successResponse(res, 200, "Transfer Record Fetched successfully.", { totalRecords: totalRecords, data: transfers, page, limit });
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal server error", e.message);
    }
}

export const deleteTransfer = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const transferId = req.params.id
    try {
        const isTransferExists = await Transfer.findById(transferId);


        console.log(isTransferExists?.createdBy !== req.user.id, isTransferExists?.createdBy, req.user.id)
        if (!isTransferExists) {
            return errorResponse(res, 400, "Transfer does not exists.");
        }
        if (isTransferExists.status !== "PENDING") {
            return errorResponse(res, 400, "Only pending transfers can be deleted.");
        }
        if (!isTransferExists?.createdBy.equals(req.user.id)) {
            return errorResponse(res, 400, "You are not authorized to delete this transfer.");
        }

        const deleteTransfer = await Transfer.findByIdAndDelete(transferId);
        if (deleteTransfer) {
            return successResponse(res, 200, "Transfer deleted successfully.");
        }
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal Server Error", e.message)
    }
}

export const rejectTransfer = async (req, res) => {
    const transferId = req.params.id;
    try {
        const isTransferExists = await Transfer.findById(transferId);
        if (!isTransferExists) {
            return errorResponse(res, 400, "Transfer does not exists.");
        }
        if (isTransferExists.status !== "PENDING") {
            return errorResponse(res, 400, "Only pending transfers can be rejected.");
        }

        if (isTransferExists?.createdBy.equals(req.user.id)) {
            return errorResponse(res, 400, "You can delete the transfer but cannot delete.");
        }
        const rejectTransfer = await Transfer.findByIdAndUpdate(transferId, { status: "REJECTED" }, { new: true });
        if (rejectTransfer) {
            return successResponse(res, 200, "Transfer rejected successfully.");
        }
    } catch (e) {
        return errorResponse(res, 500, "Internal Server Error", e.message)
    }
}

export const getSingleTransfer = async (req, res) => {
    const id = req.params.id;
    try {
        const transfer = await Transfer.findById(id).populate('fromBranchId toBranchId items.productId');
        if (!transfer) {
            return errorResponse(res, 500, "Transfer does not exists.", e.message);
        }
        return successResponse(res, 200, 'Transfer record fetch successfully.', transfer);
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal server error.", e.message);
    }
}

export const approveTransfer = async (req, res) => {
    const id = req.params.id;
    let session;
    try {
        const isTransferExists = await Transfer.findById(id);
        if (!isTransferExists) {
            return errorResponse(res, 400, 'Transfer does not exists.');
        }
        if (!isTransferExists.createdBy) {
            return errorResponse(res, 400, "User id is missing in this transfer.")
            if (isTransferExists.createdBy.equals(req.user.id)) {
                return errorResponse(res, 400, "You cannot accept the trnasfer because you are the creator of it.")
            }
        }

        if (isTransferExists.status === 'REJECTED') {
            return errorResponse(res, 400, 'This transfer is already cancelled.')
        }
        if (isTransferExists.status !== "PENDING") {
            return errorResponse(res, 400, 'Only pending transfers can be approved.')
        }
        const items = isTransferExists.items
        session = await mongoose.startSession();
        session.startTransaction();

        await Transfer.findByIdAndUpdate(id, { status: "APPROVED" }, { new: true, session });

        for (const item of items) {
            const availableStock = await Stock.findOne({ productId: item.productId, branchId: isTransferExists.fromBranchId }).session(session)
            if (!availableStock) {
                await session.abortTransaction();
                return errorResponse(res, 400, "Stock does not exists.");
            }

            if (availableStock.quantity <= 0) {
                await session.abortTransaction();
                return errorResponse(res, 400, 'Stock does not exists.');
            }

            if (availableStock.quantity < item.quantity) {
                await session.abortTransaction();
                return errorResponse(res, 400, `The available quantity is ${item.quantity}`)
            }

            availableStock.quantity -= item.quantity;
            await availableStock.save({ session });

            const movement = await StockMovement.create([{
                productId: item.productId,
                branchId: isTransferExists.toBranchId,
                type: "IN",
                quantity: item.quantity,
                referenceType: "TRANSFER",
                referenceId: id,
                fromBranchId: isTransferExists.fromBranchId,
                toBranchId: isTransferExists.toBranchId,
                costPrice: 0,
                sellingPrice: 0,
                createdBy: req.user.id
            }], { session })
            await Stock.updateOne(
                {
                    productId: item.productId,
                    branchId: isTransferExists.toBranchId
                },
                {
                    $inc: { quantity: item.quantity }
                },
                { session, upsert: true }
            )
        }
        await session.commitTransaction();
        session.endSession();
        return successResponse(
            res,
            200,
            "Transfer approved successfully."
        );
    } catch (e) {
        await session.endSession();
        return errorResponse(res, 500, "Internal server error.", e.message);
    }
}

