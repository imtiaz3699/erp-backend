import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    invoiceNumber: {
        type: String,
        unique: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number,
            costPrice: Number,
        }
    ],
    totalAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const invoiceNumberSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
    },
    value:{
        type:Number,
        default:0
    }
})
export const InvoiceNumber = mongoose.model("InvoiceNumber",invoiceNumberSchema);


const Purchase = mongoose.model("Purchase",purchaseSchema);
export default Purchase;
