import express from "express";

import { approveTransfer, CreateTransfer, deleteTransfer, getAllTransfers, getSingleTransfer, rejectTransfer } from '../controller/transfer.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { body, validationResult, param } from 'express-validator';
const router = express.Router();
/**
 * @swagger
 * /api/transfer/create-transfer:
 *   post:
 *     summary: Create a stock transfer between branches
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromBranchId
 *               - toBranchId
 *               - items
 *             properties:
 *               fromBranchId:
 *                 type: string
 *                 description: Source branch ID
 *                 example: "66b8f4c5d4f7c2a123456789"
 *               toBranchId:
 *                 type: string
 *                 description: Destination branch ID
 *                 example: "66b8f4c5d4f7c2a987654321"
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - APPROVED
 *                   - REJECTED
 *                 example: "PENDING"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "66b8f4c5d4f7c2a112233445"
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 10
 *     responses:
 *       200:
 *         description: Transfer created successfully
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
 *                   example: "Transfer created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Insufficient stock. Available stock 5"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post("/create-transfer", authMiddleware, [
    body("fromBranchId").trim().isMongoId(),
    body("toBranchId").trim().isMongoId(),
    body("items").isArray({ min: 1 }),
    body("items.*.productId").trim().isMongoId(),
    body("items.*.quantity").isFloat({ gt: 0 })
], CreateTransfer);


/**
 * @swagger
 * /api/transfer/get-all-transfers:
 *   get:
 *     summary: Get all stock transfers with pagination
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Transfers fetched successfully
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
 *                   example: "Transfers fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get("/get-all-transfers", authMiddleware, getAllTransfers);



/**
 * @swagger
 * /api/transfer/delete-transfer/{id}:
 *   delete:
 *     summary: Delete a stock transfer by ID
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID to delete
 *     responses:
 *       200:
 *         description: Transfer deleted successfully
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
 *                   example: "Transfer deleted successfully."
 *       400:
 *         description: Transfer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Transfer does not exists."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


router.delete("/delete-transfer/:id", authMiddleware, deleteTransfer);



/**
 * @swagger
 * /api/transfer/reject-transfer/{id}:
 *   put:
 *     summary: Reject a pending stock transfer
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID to reject
 *     responses:
 *       200:
 *         description: Transfer rejected successfully
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
 *                   example: "Transfer rejected successfully."
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error (not found / not pending / unauthorized)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only pending transfers can be rejected."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


router.put("/reject-transfer/:id", authMiddleware, rejectTransfer);
/**
 * @swagger
 * /api/transfer/get-transfer/{id}:
 *   get:
 *     summary: Get a single transfer by ID
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transfer ID
 *         schema:
 *           type: string
 *           example: "6891f5f7d4c9a2f9a1234567"
 *     responses:
 *       200:
 *         description: Transfer record fetched successfully
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
 *                   example: "Transfer record fetch successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6891f5f7d4c9a2f9a1234567"
 *                     fromBranchId:
 *                       type: object
 *                     toBranchId:
 *                       type: object
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                           quantity:
 *                             type: number
 *                             example: 5
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Transfer does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Transfer does not exist."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

router.get('/get-transfer/:id', authMiddleware, getSingleTransfer)
/**
 * @swagger
 * /api/transfer/approve-transfer/{id}:
 *   patch:
 *     summary: Approve a pending transfer and move stock between branches
 *     tags:
 *       - Transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transfer ID
 *         schema:
 *           type: string
 *           example: "6891f5f7d4c9a2f9a1234567"
 *     responses:
 *       200:
 *         description: Transfer approved successfully
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
 *                   example: "Transfer approved successfully."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     transferNotFound:
 *                       value: "Transfer does not exists."
 *                     creatorCannotApprove:
 *                       value: "You cannot accept the transfer because you are the creator of it."
 *                     alreadyRejected:
 *                       value: "This transfer is already cancelled."
 *                     notPending:
 *                       value: "Only pending transfers can be approved."
 *                     stockNotFound:
 *                       value: "Stock does not exists."
 *                     insufficientStock:
 *                       value: "The available quantity is 5"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */


router.put("/approve-transfer/:id", authMiddleware, approveTransfer);
export default router;

