import express from 'express';

import authMiddleware from '../middleware/auth.middleware.js';
import { createSupplier, getAllSuppliers, updateSupplier, deleteSuppliers, getSingleSupplier } from '../controller/supplier.controller.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier management APIs
 */

/**
 * @swagger
 * /api/supplier/create-supplier:
 *   post:
 *     summary: Create Supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: ABC Traders
 *               phone:
 *                 type: string
 *                 example: "+923001234567"
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               address:
 *                 type: string
 *                 example: Karachi Pakistan
 *               createdBy:
 *                 type: string
 *                 example: "6891b2c4d5e6f78912345678"
 *     responses:
 *       200:
 *         description: Supplier created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post("/create-supplier", authMiddleware, [
    body("name").trim().escape().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("phone").trim().escape().notEmpty(),
    body("address").trim().escape().notEmpty(),
    body("createdBy").isMongoId()
], createSupplier);

/**
 * @swagger
 * /api/supplier/single-supplier/{id}:
 *   get:
 *     summary: Get Single Supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6891b2c4d5e6f78912345678"
 *     responses:
 *       200:
 *         description: Supplier found
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */

router.get("/single-supplier/:id", authMiddleware, getSingleSupplier);


/**
 * @swagger
 * /api/supplier/get-all-suppliers:
 *   get:
 *     summary: Get All Suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Suppliers fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRecords:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-suppliers", authMiddleware, getAllSuppliers);

/**
 * @swagger
 * /api/supplier/update-supplier/{id}:
 *   put:
 *     summary: Update Supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6891b2c4d5e6f78912345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ABC Traders Updated
 *               phone:
 *                 type: string
 *                 example: "+923001234567"
 *               email:
 *                 type: string
 *                 example: updated@gmail.com
 *               address:
 *                 type: string
 *                 example: Lahore Pakistan
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               updatedBy:
 *                 type: string
 *                 example: "6891b2c4d5e6f78912345678"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */

router.put("/update-supplier/:id", authMiddleware, [
    param("id").isMongoId(),
    body("name").optional().trim().escape(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim().escape(),
    body("address").optional().trim().escape(),
    body("isActive").optional().isBoolean(),
    body("updatedBy").isMongoId()
], updateSupplier);


/**
 * @swagger
 * /api/supplier/delete-supplier:
 *   delete:
 *     summary: Delete Multiple Suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "6891b2c4d5e6f78912345678"
 *                   - "6891b2c4d5e6f78912345679"
 *     responses:
 *       200:
 *         description: Suppliers deleted successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.delete("/delete-supplier", authMiddleware, [
    body("ids").isArray({ min: 1 }).withMessage("ids must be a non-empty array"),
    body("ids.*").isMongoId().withMessage("Each id must be a valid MongoDB ObjectId")
], deleteSuppliers);

export default router;