import Sale from "../models/sale.model.js";
import { errorResponse, formatSaleInvoiceNumber, saleInvoiceNumber, successResponse } from "../helper/helperFunctions.js";
import Stock from "../models/stock.model.js";
import { stockMovementService } from "../services/stockmovement.service.js";

export const createSale = async (req, res) => {
    const { branchId, items, totalAmount, fromBranchId } = req.body;
    try {
        console.log(items, 'fadlfjhalsdkfjhalsdkjfhlasjkdf')
        const saleNumber = await saleInvoiceNumber();
        if (Array.isArray(items)) {
            for (const item of items) {
                const stock = await Stock.findOne({
                    productId: item.productId,
                    branchId,
                })
                if (!stock) {
                    return errorResponse(res, 400, "Stock does not exists.");
                }
                if ((stock.quantity < item.quantity) || (stock.quantity === 0) || (item.quantity <= 0)) {
                    return errorResponse(res, 400, `Insufficient stock. Available stock ${stock.quantity}`)
                }
            }
        }
        const sale = await Sale.create({
            invoiceNumber: formatSaleInvoiceNumber(saleNumber),
            branchId,
            items,
            totalAmount,
            createdBy: req.user._id
        })
        // console.log('stockmovement')
        for (const item of items) {

            await stockMovementService({
                productId: item.productId,
                branchId,
                type: "OUT",
                quantity: item.quantity,
                referenceType: "SALE",
                referenceId: sale._id,
                fromBranchId: branchId,
                toBranchId: undefined,
                costPrice: item.costPrice,
                sellingPrice: item.sellingPrice,
                userId: req.user.id
            })
        }

        return successResponse(res, 200, "Sale successfull", sale);

    } catch (e) {
        console.log(e);
        return successResponse(res, 500, e.message);
    }
}


export const getAllSales = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const sales = await Sale.find({}).populate({
            path: "branchId",
            populate: {
                path: "managerId"
            }
        }).populate('createdBy items.productId').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
        const totalRecords = await Sale.countDocuments();
        return successResponse(res, 200, "Sales found.", { totalRecords: totalRecords, data: sales, page, limit });
    } catch (e) {
        console.log(e);
        return errorResponse(res, 500, "Internal server error.", e.message);
    }
}

