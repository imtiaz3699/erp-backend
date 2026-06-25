import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
    fromBranchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
    toBranchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }, quantity: {
                type: Number,
            }
        }
    ],
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true })

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;