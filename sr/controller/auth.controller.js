import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password,role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User registered" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(errors)
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, name: user?.email, email: user?.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log(user, 'fasdlfjashldfkjhslakdfjsldf')

        res.json({
            user: user,
            token: token,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllManagers = async (req,res) => {
    try {
        const managers = await User.find({role: 'branch_manager'});
        res.status(200).json(managers);
    }catch (e) {
        console.log(e.message);
    }
}