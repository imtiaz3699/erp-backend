import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { approveAdjustment, createAdjustment, getAllAdjustments, getSingleAdjustments, rejectAdjustment } from '../controller/stockAdjustment/stockAdjustment.controller.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/adjustment/create-adjustment:
 *   post:
 *     summary: Create a stock adjustment
 *     tags:
 *       - Adjustments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchId
 *               - productId
 *               - quantity
 *               - adjustmentType
 *               - reason
 *             properties:
 *               branchId:
 *                 type: string
 *                 example: "687f6a1e9c8b2f0012a12345"
 *               productId:
 *                 type: string
 *                 example: "687f6a4b9c8b2f0012a67890"
 *               quantity:
 *                 type: number
 *                 example: 10
 *               adjustmentType:
 *                 type: string
 *                 enum:
 *                   - INCREASE
 *                   - DECREASE
 *                 example: INCREASE
 *               reason:
 *                 type: string
 *                 example: Damaged goods returned
 *               remarks:
 *                 type: string
 *                 example: Added back into inventory after inspection.
 *     responses:
 *       200:
 *         description: Adjustment created successfully.
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
 *                   example: Adjustment created successfully
 *       400:
 *         description: Stock does not exist.
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
 *                   example: Stock does not exists.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */

router.post('/create-adjustment', authMiddleware, [
    body('branchId').not().isEmpty().trim().escape().withMessage('Branch ID is required'),
    body('productId').not().isEmpty().trim().escape().withMessage('Product ID is required'),
    body('quantity').not().isEmpty().trim().escape().withMessage('Quantity is required'),
    body('adjustmentType').not().isEmpty().trim().escape().withMessage('Adjustment type is required'),
    body('reason').not().isEmpty().trim().escape().withMessage('Reason is required'),
    body('remarks').not().isEmpty().trim().escape().withMessage('Remarks is required'),
], createAdjustment);


/**
 * @swagger
 * /api/adjustment/get-all-adjustments:
 *   get:
 *     summary: Get all stock adjustments
 *     tags:
 *       - Adjustments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Adjustments fetched successfully.
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
 *                   example: Adjustments fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     allAdjustments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6885f4d4d4f45b1c3d123456"
 *                           quantity:
 *                             type: number
 *                             example: 15
 *                           adjustmentType:
 *                             type: string
 *                             enum:
 *                               - INCREASE
 *                               - DECREASE
 *                             example: INCREASE
 *                           reason:
 *                             type: string
 *                             example: Stock correction
 *                           remarks:
 *                             type: string
 *                             example: Physical stock count adjustment
 *                           branchId:
 *                             type: object
 *                             description: Populated Branch document
 *                           productId:
 *                             type: object
 *                             description: Populated Product document
 *                           createdBy:
 *                             type: object
 *                             description: Populated User document
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-07-29T10:30:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-07-29T10:30:00.000Z"
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */

router.get('/get-all-adjustments', authMiddleware, getAllAdjustments);


/**
 * @swagger
 * /api/adjustment/get-single-adjustment/{id}:
 *   get:
 *     summary: Get a single stock adjustment by ID
 *     tags:
 *       - Adjustments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Adjustment ID
 *         schema:
 *           type: string
 *           example: "6885f4d4d4f45b1c3d123456"
 *     responses:
 *       200:
 *         description: Adjustment fetched successfully.
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
 *                   example: Adjustment fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6885f4d4d4f45b1c3d123456"
 *                     quantity:
 *                       type: number
 *                       example: 20
 *                     adjustmentType:
 *                       type: string
 *                       enum:
 *                         - INCREASE
 *                         - DECREASE
 *                       example: DECREASE
 *                     reason:
 *                       type: string
 *                       example: Damaged products
 *                     remarks:
 *                       type: string
 *                       example: Removed damaged stock after inspection.
 *                     branchId:
 *                       type: object
 *                       description: Populated Branch document
 *                     productId:
 *                       type: object
 *                       description: Populated Product document
 *                     createdBy:
 *                       type: object
 *                       description: Populated User document
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-29T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-29T10:30:00.000Z"
 *       404:
 *         description: Adjustment not found.
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
 *                   example: Adjustment does not exists.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */

router.get('/adjustment/:id', authMiddleware, getSingleAdjustments);


/**
 * @swagger
 * /api/adjustment/{id}/approve:
 *   patch:
 *     summary: Approve a stock adjustment
 *     tags:
 *       - Adjustments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the adjustment to approve
 *         schema:
 *           type: string
 *           example: "6885f4d4d4f45b1c3d123456"
 *     responses:
 *       200:
 *         description: Adjustment approved successfully.
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
 *                   example: Adjustment approved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6885f4d4d4f45b1c3d123456"
 *                     status:
 *                       type: string
 *                       example: APPROVED
 *                     approvedBy:
 *                       type: string
 *                       example: "6885f4d4d4f45b1c3d987654"
 *                     adjustmentType:
 *                       type: string
 *                       enum:
 *                         - INCREASE
 *                         - DECREASE
 *                     quantity:
 *                       type: number
 *                       example: 15
 *       400:
 *         description: Bad Request
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
 *                     adjustmentNotFound:
 *                       value: Adjustment does not exists.
 *                     alreadyProcessed:
 *                       value: Only pending adjustments can be approved.
 *                     unauthorized:
 *                       value: You are not authorized to approve this adjustment.
 *                     stockNotFound:
 *                       value: This stock does not exists in this branch.
 *                     insufficientStock:
 *                       value: Insufficient stock available for adjustment.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */

router.put('/:id/approve', authMiddleware, [
    body('id').isMongoId().withMessage('Invalid ID'),
], approveAdjustment);




/**
 * @swagger
 * /api/adjustment/{id}/reject:
 *   patch:
 *     summary: Reject a stock adjustment
 *     tags:
 *       - Adjustments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the adjustment to reject
 *         schema:
 *           type: string
 *           example: "6885f4d4d4f45b1c3d123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Incorrect quantity entered by the requester.
 *     responses:
 *       200:
 *         description: Adjustment rejected successfully.
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
 *                   example: Adjustment rejected successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6885f4d4d4f45b1c3d123456"
 *                     status:
 *                       type: string
 *                       example: REJECTED
 *                     rejectedBy:
 *                       type: string
 *                       example: "6885f4d4d4f45b1c3d987654"
 *                     reason:
 *                       type: string
 *                       example: Incorrect quantity entered by the requester.
 *       400:
 *         description: Bad Request
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
 *                     adjustmentNotFound:
 *                       value: Adjustment does not exists.
 *                     onlyPending:
 *                       value: Only pending adjustments can be rejected.
 *                     unauthorized:
 *                       value: You are not authorized to reject this adjustment.
 *                     reasonRequired:
 *                       value: Reason is required.
 *                     stockNotFound:
 *                       value: This stock does not exists in this branch.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */
router.put('/:id/reject', authMiddleware, [
    body('id').isMongoId().withMessage('Invalid ID'),
], rejectAdjustment);

export default router;