import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
})

const branchSchema = new mongoose.Schema(
    {
        branchCode: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["branch", "warehouse", "headOffice"],
            default: "branch",
        },
        phone: String,
        email: String,
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: {
            city: {
                type: String,
                required: true,
            },
            area: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        openingDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
    timestamps: true, // creates createdAt & updatedAt automatically
}
);
const Counter = mongoose.model("Counter", counterSchema);
branchSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: "branch", },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )
        this.branchCode = `BR-${String(counter.seq).padStart(3, "0")}`;
        next();
    } catch (error) {
        next(error);
    }
});
const Branch = mongoose.model("Branch", branchSchema);

export default Branch;


