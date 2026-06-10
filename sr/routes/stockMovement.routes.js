import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createStockMovement } from "../controller/stockMovement.controller.js";
import { body, validationResult, param } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock Movement
 *   description: Stock Movement Api's 
 */

/**
 * @swagger
 * /api/stock-movement/create-stock-movement:
 *   post:
 *     summary: Create stock movement (IN, OUT, TRANSFER, DAMAGE)
 *     tags:
 *       - Stock Movement
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - branchId
 *               - type
 *               - quantity
 *               - referenceType
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *
 *               branchId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *
 *               type:
 *                 type: string
 *                 enum: [IN, OUT, TRANSFER, DAMAGE]
 *                 example: IN
 *
 *               quantity:
 *                 type: number
 *                 example: 10
 *
 *               referenceType:
 *                 type: string
 *                 enum: [SALE, PURCHASE, TRANSFER, ADJUSTMENT]
 *                 example: PURCHASE
 *
 *               referenceId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d9"
 *
 *               fromBranchId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *
 *               toBranchId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *
 *               costPrice:
 *                 type: number
 *                 example: 1200
 *
 *               sellingPrice:
 *                 type: number
 *                 example: 1500
 *
 *               userId:
 *                 type: string
 *                 description: (auto from auth middleware, not required in request)
 *
 *     responses:
 *       201:
 *         description: Stock movement recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock movement recorded
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     stock:
 *                       type: object
 *                     movement:
 *                       type: object
 *
 *       400:
 *         description: Validation or business logic error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Insufficient stock
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */


router.post('/create-stock-movement',authMiddleware, createStockMovement);


export default router;