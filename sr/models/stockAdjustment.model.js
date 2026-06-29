import mongoose from "mongoose";

const stockAdjustmentSchema = new mongoose.Schema({

    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    adjustmentType: {
        type: String,
        enum: ["INCREASE", "DECREASE"],
    },
    reason: {
        type: String,
        enum: [
            // Decrease Reasons
            "DAMAGED",
            "EXPIRED",
            "LOST",
            "STOLEN",
            "BREAKAGE",
            "QUALITY_REJECTION",
            "SUPPLIER_RETURN",
            "INTERNAL_USE",
            "SAMPLE_GIVEN",

            // Common Reasons
            "COUNT_CORRECTION",
            "WAREHOUSE_ERROR",

            // Increase Reasons
            "FOUND_STOCK",
            "CUSTOMER_RETURN",
            "TRANSFER_CORRECTION",
            "DATA_ENTRY_CORRECTION",
            "SUPPLIER_EXTRA",
            "PRODUCTION_OUTPUT",

            // Fallback
            "OTHER"
        ],
        required: true
    },
    remarks: {
        type: String,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
    }

}, { timestamps: true })

const Adjustment = mongoose.model("Adjustment", stockAdjustmentSchema);

export default Adjustment;