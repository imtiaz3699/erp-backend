import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
        type: String,
        enum: [
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
        ],
        default: "sales_staff"
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;