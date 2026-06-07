import express from 'express';

import authMiddleware from '../middleware/auth.middleware.js';
import { createStock, updateStock, getAllStocks, getSingleStock, deleteStock, getAvailableProductsForStock } from '../controller/stock.controller.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Stock Api's
 */


/**
 * @swagger
 * /api/stock/create-stock:
 *   post:
 *     summary: Create Stock
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - branchId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901234"
 *               branchId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901235"
 *               quantity:
 *                 type: number
 *                 example: 100
 *               reservedQty:
 *                 type: number
 *                 example: 5
 *               damagedQty:
 *                 type: number
 *                 example: 2
 *               minStockLevel:
 *                 type: number
 *                 example: 10
 *               maxStockLevel:
 *                 type: number
 *                 example: 500
 *               averageCostPrice:
 *                 type: number
 *                 example: 250
 *               lastPurchasePrice:
 *                 type: number
 *                 example: 260
 *               stockValue:
 *                 type: number
 *                 example: 25000
 *               status:
 *                 type: string
 *                 example: "in_stock"
 *               lastStockInAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-11T10:00:00.000Z"
 *               createdBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *               updatedBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *     responses:
 *       201:
 *         description: Stock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


router.post(
    "/create-stock",
    authMiddleware,
    [
        body("productId").isMongoId()
            .withMessage("Invalid Product ID"),

        body("branchId")
            .isMongoId()
            .withMessage("Invalid Branch ID"), ,

        body("quantity")
            .isFloat({ gt: 0 })
            .withMessage("Quantity must be > 0"),

        body("reservedQty")
            .isFloat({ gt: 0 }),

        body("damagedQty")
            .isFloat({ gt: 0 }),

        body("minStockLevel")
            .isFloat({ gt: 0 }),

        body("maxStockLevel")
            .isFloat({ gt: 0 }),

        body("averageCostPrice")
            .isFloat({ gt: 0 }),
        body("lastPurchasePrice")
            .isFloat({ gt: 0 }),

        body("stockValue")
            .isFloat({ gt: 0 }),

        body("status")
            .isIn(["in_stock", "low_stock", "out_of_stock"])
            .withMessage("Invalid status"),

        body("lastStockInAt")
            .isISO8601()
            .withMessage("Invalid date format"),

        body("createdBy")
            .isMongoId()
            .withMessage("Invalid User ID"),

        body("updatedBy")
            .isMongoId()
            .withMessage("Invalid User ID"),
    ],
    createStock
);



/**
 * @swagger
 * /api/stock/update-stock/{id}:
 *   put:
 *     summary: Update Stock
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901234"
 *               branchId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901235"
 *               quantity:
 *                 type: number
 *                 example: 100
 *               reservedQty:
 *                 type: number
 *                 example: 5
 *               damagedQty:
 *                 type: number
 *                 example: 2
 *               minStockLevel:
 *                 type: number
 *                 example: 10
 *               maxStockLevel:
 *                 type: number
 *                 example: 500
 *               averageCostPrice:
 *                 type: number
 *                 example: 250
 *               lastPurchasePrice:
 *                 type: number
 *                 example: 260
 *               stockValue:
 *                 type: number
 *                 example: 25000
 *               status:
 *                 type: string
 *                 example: "in_stock"
 *               lastStockIn:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-11T10:00:00.000Z"
 *               updatedBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock updated successfully
 *                 stock:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Stock not found
 *       500:
 *         description: Internal server error
 */

router.put(
    "/update-stock/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Stock ID"),

        body("productId")
            .optional()
            .isMongoId()
            .withMessage("Invalid Product ID"),

        body("branchId")
            .optional()
            .isMongoId()
            .withMessage("Invalid Branch ID"),

        body("quantity")
            .optional()
            .isFloat({ gt: 0 })
            .withMessage("Quantity must be > 0"),

        body("reservedQty")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Reserved Qty must be >= 0"),

        body("damagedQty")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Damaged Qty must be >= 0"),

        body("minStockLevel")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Min Stock Level must be >= 0"),

        body("maxStockLevel")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Max Stock Level must be >= 0"),

        body("averageCostPrice")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Average Cost Price must be >= 0"),

        body("lastPurchasePrice")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Last Purchase Price must be >= 0"),

        body("stockValue")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Stock Value must be >= 0"),

        body("status")
            .optional()
            .isIn(["in_stock", "low_stock", "out_of_stock"])
            .withMessage("Invalid status"),

        body("lastStockIn")
            .optional()
            .isDate()
            .withMessage("Invalid date format"),

        body("updatedBy")
            .optional()
            .isMongoId()
            .withMessage("Invalid User ID"),
    ],
    updateStock
);

/**
 * @swagger
 * /api/stock/get-stock/{id}:
 *   get:
 *     summary: Get Single Stock
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stock:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6890a1b2c3d4e5f678901237"
 *                     productId:
 *                       type: object
 *                     branchId:
 *                       type: object
 *                     quantity:
 *                       type: number
 *                       example: 100
 *                     reservedQty:
 *                       type: number
 *                       example: 5
 *                     damagedQty:
 *                       type: number
 *                       example: 2
 *                     minStockLevel:
 *                       type: number
 *                       example: 10
 *                     maxStockLevel:
 *                       type: number
 *                       example: 500
 *                     averageCostPrice:
 *                       type: number
 *                       example: 250
 *                     lastPurchasePrice:
 *                       type: number
 *                       example: 260
 *                     stockValue:
 *                       type: number
 *                       example: 25000
 *                     status:
 *                       type: string
 *                       example: "in_stock"
 *                     lastStockIn:
 *                       type: string
 *                       format: date-time
 *                     createdBy:
 *                       type: object
 *                     updatedBy:
 *                       type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid Stock ID
 *       404:
 *         description: Stock not found
 *       500:
 *         description: Internal server error
 */

router.get(
    "/get-stock/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Stock ID"),
    ],
    getSingleStock
);


/**
 * @swagger
 * /api/stock/get-stocks:
 *   get:
 *     summary: Get All Stocks
 *     tags: [Stock]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *
 *     responses:
 *       200:
 *         description: Stocks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStocks:
 *                   type: number
 *                   example: 100
 *
 *                 totalPages:
 *                   type: number
 *                   example: 10
 *
 *                 currentPage:
 *                   type: number
 *                   example: 1
 *
 *                 stocks:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       500:
 *         description: Internal server error
 */

router.get(
    "/get-stocks",
    authMiddleware,
    getAllStocks
);

/**
 * @swagger
 * /api/stock/delete-stock/{id}:
 *   delete:
 *     summary: Delete Stock
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Stock ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock deleted successfully
 *
 *       400:
 *         description: Invalid Stock ID
 *
 *       404:
 *         description: Stock not found
 *
 *       500:
 *         description: Internal server error
 */

router.delete(
    "/delete-stock/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Stock ID"),
    ],
    deleteStock
);

/**
 * @swagger
 * /api/stock/available-products/{branchId}:
 *   get:
 *     summary: Get products that are not yet assigned to stock for a specific branch
 *     tags:
 *       - Stock
 *
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *
 *     responses:
 *       200:
 *         description: Available products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 count:
 *                   type: number
 *                   example: 2
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "689e1d12ab45cd67890ef123"
 *
 *                       name:
 *                         type: string
 *                         example: "Rice 5KG"
 *
 *                       barcode:
 *                         type: string
 *                         example: "123456789"
 *
 *                       category:
 *                         type: string
 *                         example: "Grocery"
 *
 *                       brand:
 *                         type: string
 *                         example: "Falak"
 *
 *                       sellingPrice:
 *                         type: number
 *                         example: 4500
 *
 *       500:
 *         description: Failed to fetch available products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message:
 *                   type: string
 *                   example: Failed to fetch available products
 */
router.get("/available-products/:branchId", authMiddleware, getAvailableProductsForStock)

export default router;