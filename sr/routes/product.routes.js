import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct,searchProductsByName } from "../controller/product.controller.js";
import { body, validationResult } from "express-validator";
import { upload, uploadToCloudinary } from "../middleware/upload.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product Api's
 */

/**
 * @swagger
 * /api/product/create-product:
 *   post:
 *     summary: Create Product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               barcode:
 *                 type: string
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               unit:
 *                 type: string
 *                 enum: [KG, PCS, BOX]
 *               costPrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created
 */

router.post(
  "/create-product",
  authMiddleware,
  upload.array("files", 5),
  [
    body("name").notEmpty().withMessage("Name is required"),

    body("barcode")
      .notEmpty()
      .withMessage("Barcode is required"),

    body("category")
      .isMongoId()
      .withMessage("Invalid category ID"),

    body("brand")
      .isMongoId()
      .withMessage("Invalid brand ID"),

    body("unit")
      .isIn(["KG", "PCS", "BOX"])
      .withMessage("Invalid unit"),

    body("costPrice")
      .isFloat({ gt: 0 })
      .withMessage("Cost price must be > 0"),

    body("sellingPrice")
      .isFloat({ gt: 0 })
      .withMessage("Selling price must be > 0"),

    body("isActive")
      .isBoolean()
      .withMessage("isActive must be boolean"),
  ],

  createProduct
);




/**
 * @swagger
 * /api/product/update-product/{id}:
 *   patch:
 *     summary: Update Product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - barcode
 *               - category
 *               - brand
 *               - unit
 *               - costPrice
 *               - sellingPrice
 *               - isActive
 *             properties:
 *               name:
 *                 type: string
 *               barcode:
 *                 type: string
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               unit:
 *                 type: string
 *                 enum: [KG, PCS, BOX]
 *               costPrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product Updated
 */

router.patch(
  "/update-product/:id",
  authMiddleware,
  upload.array("files", 5),
  [
    body("name").notEmpty().withMessage("Name is required"),

    body("barcode")
      .notEmpty()
      .withMessage("Barcode is required"),

    body("category")
      .isMongoId()
      .withMessage("Invalid category ID"),

    body("brand")
      .isMongoId()
      .withMessage("Invalid brand ID"),

    body("unit")
      .isIn(["KG", "PCS", "BOX"])
      .withMessage("Invalid unit"),

    body("costPrice")
      .isFloat({ gt: 0 })
      .withMessage("Cost price must be > 0"),

    body("sellingPrice")
      .isFloat({ gt: 0 })
      .withMessage("Selling price must be > 0"),

    body("isActive")
      .isBoolean()
      .withMessage("isActive must be boolean"),
  ],
  updateProduct
);


/**
 * @swagger
 * /api/product/all-product:
 *   get:
 *     summary: Get All Products (Protected)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All Products
 */
router.get("/all-product", authMiddleware, getAllProducts);



/**
 * @swagger
 * /api/product/get-single-product/{id}:
 *   get:
 *     summary: Get Single Product (Protected)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Single Product
 */
router.get("/get-single-product/:id", authMiddleware, getSingleProduct);


/**
 * @swagger
 * /api/product/delete-product/{id}:
 *   delete:
 *     summary: Delete Product (Protected)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Single Product
 */
router.delete("/delete-product/:id", authMiddleware, deleteProduct);

/**
 * @swagger
 * /api/product/find-product/{name}:
 *   get:
 *     summary: Get Products By Name
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product Name
 *     responses:
 *       200:
 *         description: Single Product
 */
router.get("/find-product/:name", authMiddleware, searchProductsByName);
export default router;