import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { register, login, getAllManagers } from "../controller/auth.controller.js";
import { body, validationResult } from "express-validator";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ali Khan"
 *
 *               email:
 *                 type: string
 *                 example: "ali@example.com"
 *
 *               password:
 *                 type: string
 *                 example: "123456"
 *
 *               role:
 *                 type: string
 *                 enum:
 *                   - super_admin
 *                   - admin
 *                   - branch_manager
 *                   - cashier
 *                   - sales_staff
 *                   - inventory_officer
 *                   - purchase_officer
 *                   - accountant
 *                   - hr
 *                   - delivery_staff
 *                 example: "sales_staff"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .optional()
      .isIn([
        "super_admin",
        "admin",
        "branch_manager",
        "cashier",
        "sales_staff",
        "inventory_officer",
        "purchase_officer",
        "accountant",
        "hr",
        "delivery_staff"
      ])
      .withMessage("Invalid role"),
  ],
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).trim()
], login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile (Protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


/**
 * @swagger
 * /api/auth/get-all-managers:
 *   get:
 *     summary: Get All Managers (Protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */

router.get("/get-all-managers", authMiddleware, getAllManagers);
export default router;