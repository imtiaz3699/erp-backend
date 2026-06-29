import { errorResponse, successResponse } from "../../helper/helperFunctions.js";
import Supplier from "../../models/supplier.model.js";
import mongoose from "mongoose"
import Adjustment from '../../models/stockAdjustment.model.js'
import Stock from '../../models/stock.model.js'
export const createAdjustment = async (req, res) => {
    const { branchId, productId, quantity, adjustmentType, reason, remarks } = req.body;
    try {
        const isStockExists = await Stock.findOne({ branchId, productId });
        if (!isStockExists) {
            return errorResponse(res, 400, "Stock does not exists.")
        }
        const adjustment = await Adjustment.create({
            branchId,
            productId,
            adjustmentType,
            reason,
            remarks,
            quantity,
            createdBy: req.user.id
        })
        return successResponse(res, 200, "Adjustment created successfully",)
    } catch (e) {
        return errorResponse(res, 500, 'Internal server error.')
    }
}

export const getAllAdjustments = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const allAdjustments = await Adjustment
            .find({})
            .populate("branchId productId")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .populate('branchId productId createdBy');

    const totalRecords = await Adjustment.countDocuments();

        return successResponse(res, 200, 'Adjustments fetched successfully.', { totalRecords, limit, page, data:allAdjustments })
    } catch (e) {
        return errorResponse(res, 500, 'Internal server error.')
    }
}


export const getSingleAdjustments = async (req, res) => {
    const id = req.params.id;
    try {
        const adjustment = await Adjustment.findById(id).populate('branchId productId createdBy');
        if (!adjustment) {
            return errorResponse(res, 200, 'Adjustment does not exists.');
        }
        return successResponse(res, 200, 'Adjustment fetched successfully.', adjustment)

    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, 'Internal server error.')
    }
}


export const approveAdjustment = async (req, res) => {
    const id = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();
    //check if adjustment exists.
    //check if it's the branch maanager who is approving
    // check if the stock exists or not.
    // update the stock quantity
    //save the stock and approve the adjustment but use the transaction with it so that both operation done together.
    try {
        const isAdjustment = await Adjustment.findById(id).populate('branchId').session(session);
        if (!isAdjustment) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, 'Adjustment does not exists.');
        }
        if (isAdjustment.status !== 'PENDING') {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, 'Only pending adjustments can be approved.');
        }
        if (!isAdjustment.branchId.managerId.equals(req.user.id)) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, 'You are not authorized to approve this adjustment.');
        }
        const isStockExists = await Stock.findOne({ branchId: isAdjustment.branchId, productId: isAdjustment.productId }).session(session);
        if (!isStockExists) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, 'This stock does not exists in this branch.')
        }

        if (isAdjustment.adjustmentType === "DECREASE" && isStockExists.quantity < adjustment.quantity) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 400, 'This stock does not exists in this branch.')
        }
        if (isAdjustment.adjustmentType === "INCREASE") {
            isStockExists.quantity += isAdjustment.quantity
        }
        if (isAdjustment.adjustmentType === "DECREASE") {
            isStockExists.quantity -= isAdjustment.quantity
        }
        await isStockExists.save({ session })

        isAdjustment.status === "APPROVED";
        isAdjustment.approvedBy = req.user.id;



        await isAdjustment.save({ session });
        await session.commitTransaction();
        session.endSession();
        return successResponse(res, 200, 'Adjustment approved successfully.', adjustment)
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 500, 'Internal server error.')
    }
}


export const rejectAdjustment = async (req, res) => {
    const id = req.params.id;
    const { reason } = req.body;
    //
    console.log(id,'fasdlfjhlasdkjfhlaskjdfhlkasjfhdkljasd')
    try {
        const isAdjustment = await Adjustment.findById(id).populate("branchId");
        if (!isAdjustment) {
            return errorResponse(res, 400, 'Adjustment does not exists.');
        }
        if (isAdjustment.status !== "PENDING") {
            return errorResponse(res, 400, 'Only pending adjustments can be rejected.');
        }
        if (!isAdjustment.branchId.managerId.equals(req.user.id)) {
            return errorResponse(res, 400, 'You are not authorized to reject this adjustment.');
        }
        if (!reason) {
            return errorResponse(res, 400, 'Reason is required.');
        }
        const stock = await Stock.findOne({ branchId: isAdjustment.branchId, productId: isAdjustment.productId }, { new: true });
        if (!stock) {
            return errorResponse(res, 400, 'This stock does not exists in this branch.')
        }
        isAdjustment.status = "REJECTED";
        isAdjustment.rejectedBy = req.user.id;
        isAdjustment.remarks = reason;
        isAdjustment.save();
        return successResponse(res, 200, 'Adjustment rejected successfully.', isAdjustment)
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, 'Internal server error.')
    }
} 