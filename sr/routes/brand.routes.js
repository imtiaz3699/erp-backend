import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from "../controller/brand.controller.js";
import { body, validationResult } from "express-validator";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand Api's
 */

/**
 * @swagger
 * /api/brand/create-brand:
 *   post:
 *     summary: Create Brand
 *     tags: [Brand]
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
 *         description: Brand Created
 */
router.post("/create-brand", [
  body("name").trim().escape().notEmpty(),
  body("description").normalizeEmail(),
  body("isActive").isBoolean().withMessage("isActive must be a boolean")
], createBrand);


/**
* @swagger
* /api/brand/update-brand/{id}:
*   put:
*     summary: Update Brand
*     tags: [Brand]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: Brand Id
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


router.put("/update-brand/:id",
  authMiddleware,
  [
    body("name").trim().escape().notEmpty(),
    body("description").normalizeEmail(),
    body("isActive").isBoolean().withMessage("isActive must be a boolean")
  ], updateBrand);


/**
 * @swagger
 * /api/brand/all-brands:
 *   get:
 *     summary: Get All Brands (Protected)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All Brands
 */
router.get("/all-brands", authMiddleware, getAllBrands);
/**
 * @swagger
 * /api/brand/single-brand/{id}:
 *   get:
 *     summary: Get Single Brand (Protected)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Single Brand
 */
router.get("/single-brand/:id", authMiddleware, getSingleBrand);


/**
 * @swagger
 * /api/brand/delete-brand/{id}:
 *   delete:
 *     summary: Delete Brand (Protected)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Single Brand
 */

router.delete("/delete-brand/:id", authMiddleware, deleteBrand);

export default router;