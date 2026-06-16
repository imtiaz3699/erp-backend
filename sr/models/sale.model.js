import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            sellingPrice: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["COMPLETED", "CANCELLED"],
        default: "COMPLETED",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const saleInvoiceNumber = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
    },
    value:{
        type:Number,
        default:0
    }
})
export const SaleInvoiceNumber = mongoose.model("SaleInvoiceNumber",saleInvoiceNumber)
const Sale = mongoose.model("Sale",saleSchema);
export default Sale;

