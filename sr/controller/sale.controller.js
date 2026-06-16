import Sale from "../models/sale.model";
import { errorResponse, formatSaleInvoiceNumber, saleInvoiceNumber, successResponse } from "../helper/helperFunctions";
import Stock from "../models/stock.model";

export const createSale = async (req, res) => {
    const { branchId, items, totalAmount } = req.body;
    try {
        const saleNumber = saleInvoiceNumber();
        for (const item of items) {
            const stock = await Stock.findOne({
                productId: item.productId,
                branchId,
            })
            if (!stock) {
                return errorResponse(res, 400, "Stock does not exists.");
            }
            if (stock.quantity < item.quantity) {
                return errorResponse(res, 400, `Insufficient stock. Available stock ${stock.quantity}`)
            }
        }

        const sale = await Sale.create({
            invoiceNumber: formatSaleInvoiceNumber(saleNumber),
            branchId,
            items,
            totalAmount,
            createdBy: req.user._id
        })
        for (const item of items) {
            await stockMovementService({
                productId: item.productId,
                branchId,
                quantity: item.quantiy,
                type: "OUT",
                referenceType: "SALE",
                referenceId: sale._id,
                sellingPrice: item.sellingPrice,
                userId: req.user._id
            })
        }
        return successResponse(res, 200, "Sale successfull", sale);

    } catch (e) {
        console.log(e);
        return successResponse(res, 500, "Something is not right.")
    }
}


export const getAllSales = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const sales = await Sale.find({}).populate('branchId createdBy').limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
        const totalRecords = await Sale.countDocuments();
        return successResponse(res, 200, "Sales found.", { totalRecords: totalRecords, data: sales, page, limit });
    } catch (e) {
        console.log(e);
    }
}

