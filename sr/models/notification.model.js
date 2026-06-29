import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    referenceId: {
        type: String,
        required: true
    },
    referenceModel: {
        type: String,
        required: true
    },
    recipientId: {
        type: String,
        required: true
    },
    isRead: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        requiured: true,
    },
    metadata: {
        type: String,
        required: true,
    },
}, { timestamps: true })


export const Notification = mongoose.model("Notification", notificationSchema);
const sale = mongoose.model("Sale", saleSchema);

export default Sale;