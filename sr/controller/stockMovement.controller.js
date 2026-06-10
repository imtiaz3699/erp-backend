import Stock from "../models/stock.model.js";
import StockMovement from "../models/stockmovement.model.js";
import {stockMovementService} from "../services/stockmovement.service.js";
export const createStockMovement = async (req, res) => {
    try {
        const result = await stockMovementService({
            ...req.body,
            userId: req.user._id,
        });

        return res.status(201).json({
            message: "Stock movement recorded",
            data: result,
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};

