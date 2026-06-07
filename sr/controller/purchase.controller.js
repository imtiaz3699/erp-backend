import { successResponse } from "../helper/helperFunctions.js";
import Purchase from "../models/purchase.model.js";
import Supplier from "../models/supplier.model.js";
import { stockMovementService } from "../services/stockmovement.service.js";

export const createPurchase = async (req, res) => {
    try {
        const { supplierId, branchId, items, totalAmount } = req.body;
        // Purchase invoice
        const purchase = await Purchase.create({
            supplierId,
            branchId,
            items,
            totalAmount,
            createdBy: req.user?._id
        })
        // process stock in for each item
        for (const item of items) {
            await stockMovementService({
                productId: item.productId,
                branchId,
                quantity: item.quantity,
                costPrice: item.costPrice,
                type: "IN",
                referenceType: "PURCHASE",
                referenceId: purchase?._id,
                userId: req.user?._id
            })
        }
        return successResponse(res, 200, "Purchase created.", purchase)
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getAllPurchaseOrders = async (req, res) => {
    try {
        // Query Params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Skip Calculation
        const skip = (page - 1) * limit;

        // Total Documents
        const totalPurchaseOrders = await Purchase.countDocuments();

        // Fetch Data
        const purchaseOrders = await Purchase.find({})
            .populate("supplierId branchId items.productId createdBy updatedBy")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Total Pages
        const totalPages = Math.ceil(totalPurchaseOrders / limit);

        res.status(200).json({
            success: true,
            message: "Purchase orders fetched successfully",
            data: purchaseOrders,
            pagination: {
                total: totalPurchaseOrders,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: e.message,
        });
    }
};

