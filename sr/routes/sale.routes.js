import express from 'express';

import authMiddleware from '../middleware/auth.middleware.js';
import { createSale, getAllSales } from '../controller/sale.controller.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Sale
 *   description: Sale Api's
 */

/**
 * @swagger
 * /api/sale/create-sale:
 *   post:
 *     summary: Create Sale
 *     tags: [Sale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchId
 *               - items
 *               - totalAmount
 *             properties:
 *               branchId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     costPrice:
 *                       type: number
 *             totalAmount:
 *               type: number
 *     responses:
 *       200:
 *         description: Sale created successfully
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
 *                   example: Sale created
 *                 data:
 *                   type: object
 *                   properties:               
 *                     _id:
 *                       type: string       
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     branchId:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                     items:
 *                       type: array    
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string 
 *                             example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                           quantity:
 *                             type: number
 *                             example: 10
 *                           costPrice:
 *                             type: number 
 *                             example: 1000
 *                           createdAt:
 *                             type: string
 *                             example: "2023-01-01T00:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             example: "2023-01-01T00:00:00.000Z"
 *       400:   
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/create-sale', authMiddleware, createSale);

/**
 * @swagger
 * /api/sale/get-all-sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sale]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales fetched successfully
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
 *                   example: Sales fetched
 *                 data:
 *                   type: object   
 *                   properties:
 *                     sales:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                           branchId:
 *                             type: string
 *                             example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                           totalAmount:
 *                             type: number
 *                             example: 1000
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 productId:
 *                                   type: string   
 *                                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                                 quantity:
 *                                   type: number
 *                                   example: 10    
 *                                 costPrice:
 *                                   type: number   
 *                                   example: 1000
 *                                 createdAt:
 *                                   type: string
 *                                   example: "2023-01-01T00:00:00.000Z"
 *                                 updatedAt:
 *                                   type: string   
 *                                   example: "2023-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 */
router.get('/get-all-sales', authMiddleware, getAllSales);

export default router;