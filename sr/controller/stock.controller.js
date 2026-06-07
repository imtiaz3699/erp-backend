import Product from "../models/product.model.js";
import Stock from "../models/stock.model.js";
import { body, validationResult } from "express-validator";


export const createStock = async (req, res) => {
    try {
        const { productId, branchId, quantity, reservedQty, damagedQty, minStockLevel, maxStockLevel, averageCostPrice, lastPurchasePrice, stockValue, status, lastStockInAt, createdBy, updatedBy } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const stock = new Stock({
            productId, branchId, quantity, reservedQty, damagedQty, minStockLevel, maxStockLevel, averageCostPrice, lastPurchasePrice, stockValue, status, lastStockInAt, createdBy, updatedBy
        });
        await stock.save();
        res.status(201).json({ message: "Stock created" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const updateStock = async (req, res) => {
    const stockId = req.params.id;
    try {
        const isStockExists = await Stock.findById(stockId);
        if (!isStockExists) {
            return res.status(400).json({ message: "Stock not found" });
        }
        const updateStock = await Stock.findByIdAndUpdate(stockId, req.body, {
            new: true
        })
        res.status(201).json({ message: updateStock });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getSingleStock = async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        res.status(200).json(stock);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getAllStocks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Stock.countDocuments();

        const stocks = await Stock.find({})
            .populate('productId branchId createdBy updatedBy')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });


        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: stocks
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const deleteStock = async (req, res) => {
    const stockId = req.params.id;
    try {
        const isStockExists = await Stock.findById(stockId);
        if (!isStockExists) {
            return res.status(400).json({ message: "Stock not found" });
        }
        const stock = await Stock.findByIdAndDelete(stockId);
        if (stock) {
            res.status(200).json({ message: "Stock deleted" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}

export const getAvailableProductsForStock = async (req, res) => {
    try {
        const { branchId } = req.params;

        const existingStocksProduct = await Stock.find({ branchId }).select('productId');
        const existingProductIds = existingStocksProduct.map(
            (item) => item.productId
        );

        const products = await Product.find({
            _id: {
                $nin: existingProductIds
            }
        })
        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        })


    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
}