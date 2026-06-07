import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createBranch, updateBranch, getAllBranches, getSingleBranch, deleteBranch } from "../controller/branch.controller.js";
import { body, validationResult, param } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Branch
 *   description: Branch Api's
 */



/**
 * @swagger
 * /api/branch/create-branch:
 *   post:
 *     summary: Create Branch
 *     tags: [Branch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - address
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Main Branch"
 *
 *               type:
 *                 type: string
 *                 description: "wholesale | warehouse | retail (if allowed in schema)"
 *                 example: "wholesale"
 *
 *               phone:
 *                 type: string
 *                 example: "+923001234567"
 *
 *               email:
 *                 type: string
 *                 example: "branch@example.com"
 *
 *               managerId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901234"
 *
 *               address:
 *                 type: object
 *                 required:
 *                   - area
 *                   - city
 *                 properties:
 *                   area:
 *                     type: string
 *                     example: "Saddar"
 *                   city:
 *                     type: string
 *                     example: "Rawalpindi"
 *
 *               status:
 *                 type: string
 *                 example: "active"
 *
 *               openingDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-11"
 *
 *               createdBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *
 *               updatedBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Validation error / Branch already exists
 *       500:
 *         description: Internal server error
 */

router.post(
    "/create-branch",
    authMiddleware,
    [
        body("name").notEmpty().withMessage("Name is required"),

        body("email").isEmail().withMessage("Valid email is required"),

        body("phone").notEmpty().withMessage("Phone is required"),

        body("type")
            .isIn(["wholesale", "warehouse", "retail"]) // update if schema differs
            .withMessage("Invalid branch type"),

        body("address.area")
            .notEmpty()
            .withMessage("Area is required."),

        body("address.city")
            .notEmpty()
            .withMessage("City is required."),
    ],
    createBranch
);

/**
 * @swagger
 * /api/branch/update-branch/{id}:
 *   put:
 *     summary: Update Branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Branch ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Branch Name"
 *
 *               type:
 *                 type: string
 *                 example: "wholesale"
 *                 description: "wholesale | warehouse | retail (if allowed in schema)"
 *
 *               phone:
 *                 type: string
 *                 example: "+923001234567"
 *
 *               email:
 *                 type: string
 *                 example: "branch@example.com"
 *
 *               managerId:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901234"
 *
 *               address:
 *                 type: object
 *                 properties:
 *                   area:
 *                     type: string
 *                     example: "Saddar"
 *                   city:
 *                     type: string
 *                     example: "Islamabad"
 *
 *               status:
 *                 type: string
 *                 example: "active"
 *
 *               openingDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-11"
 *
 *               updatedBy:
 *                 type: string
 *                 example: "6890a1b2c3d4e5f678901236"
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */


router.put(
    "/update-branch/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Branch ID"),

        body("email")
            .optional()
            .isEmail()
            .withMessage("Invalid email"),

        body("phone")
            .optional()
            .notEmpty()
            .withMessage("Phone cannot be empty"),

        body("type")
            .optional()
            .isIn(["wholesale", "warehouse", "retail"])
            .withMessage("Invalid branch type"),

        body("address.area")
            .optional()
            .notEmpty()
            .withMessage("Area cannot be empty"),

        body("address.city")
            .optional()
            .notEmpty()
            .withMessage("City cannot be empty"),
    ],
    updateBranch
);

/**
 * @swagger
 * /api/branch/get-branch/{id}:
 *   get:
 *     summary: Get Single Branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Branch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branch fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branch:
 *                   type: object
 *       400:
 *         description: Invalid Branch ID
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */

router.get(
    "/get-branch/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Branch ID"),
    ],
    getSingleBranch
);


/**
 * @swagger
 * /api/branch/get-branches:
 *   get:
 *     summary: Get All Branches
 *     tags: [Branch]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page
 *
 *     responses:
 *       200:
 *         description: Branches fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBranches:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

router.get(
    "/get-branches",
    authMiddleware,
    getAllBranches
);

/**
 * @swagger
 * /api/branch/delete-branch/{id}:
 *   delete:
 *     summary: Delete Branch
 *     tags: [Branch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Branch ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Branch deleted successfully
 *
 *       400:
 *         description: Invalid Branch ID
 *
 *       404:
 *         description: Branch not found
 *
 *       500:
 *         description: Internal server error
 */

router.delete(
    "/delete-branch/:id",
    authMiddleware,
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid Branch ID"),
    ],
    deleteBranch
);

export default router;