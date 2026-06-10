import express from 'express';

import authMiddleware from '../middleware/auth.middleware.js';
import { createPurchase } from '../controller/purchase.controller.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/purchase/create-purchase:
 *   post:
 *     summary: Create a new purchase
 *     description: Creates a purchase invoice and automatically adds stock movements for all purchase items.
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - branchId
 *               - items
 *               - totalAmount
 *             properties:
 *               supplierId:
 *                 type: string
 *                 example: "6891b2c4d5e6f78912345678"
 *               branchId:
 *                 type: string
 *                 example: "6891b2c4d5e6f78912345679"
 *               totalAmount:
 *                 type: number
 *                 example: 25000
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - costPrice
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "6891b2c4d5e6f78912345680"
 *                     quantity:
 *                       type: number
 *                       example: 10
 *                     costPrice:
 *                       type: number
 *                       example: 1500
 *                     sellingPrice:
 *                       type: number
 *                       example: 2000
 *     responses:
 *       200:
 *         description: Purchase created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Purchase created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6891b2c4d5e6f78912349999"
 *                     supplierId:
 *                       type: string
 *                     branchId:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                     createdBy:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post(
    "/create-purchase",
    authMiddleware,
    [
        body("supplierId").isMongoId()
            .withMessage("Invalid Supplier ID"),

        body("branchId")
            .isMongoId()
            .withMessage("Invalid Branch ID"),

        body("items").isArray({ min: 1 })
            .withMessage("Items are required and must be an array"),

        body("totalAmount")
            .isFloat({ gt: 0 }),
    ],
    createPurchase
);

router
export default router;