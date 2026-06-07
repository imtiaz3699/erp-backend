import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controller/category.controller.js";
import { body, validationResult } from "express-validator";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category Api's
 */

/**
 * @swagger
 * /api/category/create-category:
 *   post:
 *     summary: Create category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category Created
 */
router.post("/create-category", authMiddleware, [
    body("name").trim().escape().notEmpty(),
    body("description").normalizeEmail(),
    body("isActive").isBoolean().withMessage("isActive must be a boolean")
], createCategory);

/**
 * @swagger
 * /api/category/update-category/{id}:
 *   put:
 *     summary: Update Category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - isActive
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: All electronic products
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category Updated Successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Category Not Found
 *       500:
 *         description: Internal Server Error
 */
router.put("/update-category/:id", authMiddleware, [
    body("name").trim().escape().notEmpty(),
    body("description").normalizeEmail(),
    body("isActive").isBoolean().withMessage("isActive must be a boolean")
], updateCategory);


/**
 * @swagger
 * /api/category/all-categories:
 *   get:
 *     summary: Get All Categories (Protected)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All Categories
 */
router.get("/all-categories", authMiddleware, getAllCategories);
/**
 * @swagger
 * /api/category/single-category/{id}:
 *   get:
 *     summary: Get Single Category (Protected)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Single Category
 */
router.get("/single-category/:id", authMiddleware, getSingleCategory);


/**
 * @swagger
 * /api/category/delete-category/{id}:
 *   delete:
 *     summary: Delete Category (Protected)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Single Category
 */

router.delete("/delete-category/:id", authMiddleware, deleteCategory);

export default router;