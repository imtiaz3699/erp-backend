import express from 'express';

import authMiddleware from '../middleware/auth.middleware.js';
import { createPurchase, getAllPurchaseOrders, getPendingPurchaseOrders, getProductsBasedOnPurchaseOrder } from '../controller/purchase.controller.js';
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
/**
 * @swagger
 * /api/purchase/get-all-purchase-orders:
 *   get:
 *     summary: Get all purchase orders with pagination
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
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
 *         description: Purchase orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Purchase orders fetched successfully
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *
 *                       supplierId:
 *                         type: object
 *                         description: Populated supplier object
 *
 *                       branchId:
 *                         type: object
 *                         description: Populated branch object
 *
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: object
 *                             quantity:
 *                               type: number
 *                             costPrice:
 *                               type: number
 *
 *                       totalAmount:
 *                         type: number
 *
 *                       invoiceNumber:
 *                         type: string
 *                         example: INV-001
 *
 *                       createdBy:
 *                         type: object
 *
 *                       updatedBy:
 *                         type: object
 *
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 120
 *
 *                     page:
 *                       type: integer
 *                       example: 1
 *
 *                     limit:
 *                       type: integer
 *                       example: 10
 *
 *                     totalPages:
 *                       type: integer
 *                       example: 12
 *
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *
 *       500:
 *         description: Server error
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
 *                   example: Something went wrong
 *
 *                 error:
 *                   type: string
 */



router.get("/get-all-purchase-orders", authMiddleware, getAllPurchaseOrders);
/**
 * @swagger
 * /api/purchase/get-pending-purchase-orders:
 *   get:
 *     summary: Get pending purchase orders
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
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
 *         description: Purchase orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Purchase orders fetched successfully
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *
 *                       supplierId:
 *                         type: object
 *
 *                       branchId:
 *                         type: object
 *
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: object
 *                             quantity:
 *                               type: number
 *                             costPrice:
 *                               type: number
 *
 *                       totalAmount:
 *                         type: number
 *
 *                       invoiceNumber:
 *                         type: string
 *                         example: INV-001
 *
 *                       createdBy:
 *                         type: object
 *
 *                       updatedBy:
 *                         type: object
 *
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 120
 *
 *                     page:
 *                       type: integer
 *                       example: 1
 *
 *                     limit:
 *                       type: integer
 *                       example: 10
 *
 *                     totalPages:
 *                       type: integer
 *                       example: 12
 *
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *
 *       500:
 *         description: Server error
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
 *                   example: Something went wrong
 *
 *                 error:
 *                   type: string
 */
router.get("/get-pending-purchase-orders", authMiddleware, getPendingPurchaseOrders);
/**
 * @swagger
 * /api/purchase/get-products-by-purchase-order-id/{id}:
 *   get:
 *     summary: Get products for a specific purchase order
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: object
 *                         description: Populated product object
 *
 *                       quantity:
 *                         type: number
 *                         example: 10
 *
 *                       costPrice:
 *                         type: number
 *                         example: 1200
 *
 *       404:
 *         description: Purchase order not found
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
 *                   example: Purchase order not found
 *
 *       500:
 *         description: Server error
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
 *                   example: Something went wrong
 *
 *                 error:
 *                   type: string
 */



router.get("/get-products-by-purchase-order-id/:id", authMiddleware, getProductsBasedOnPurchaseOrder);
export default router;