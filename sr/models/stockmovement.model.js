import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },

        type: {
            type: String,
            enum: ["IN", "OUT", "TRANSFER", "DAMAGE"],
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        referenceType: {
            type: String,
            enum: ["SALE", "PURCHASE", "TRANSFER", "ADJUSTMENT"],
            required: true,
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
        },

        fromBranchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
        },

        toBranchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
        },

        costPrice: {
            type: Number,
            default: 0,
        },

        sellingPrice: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);

export default StockMovement;