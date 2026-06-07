import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
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

    // Main Stock
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Reserved for pending orders/sales
    reservedQty: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Damaged inventory
    damagedQty: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Inventory Controls
    minStockLevel: {
      type: Number,
      default: 5,
      min: 0,
    },

    maxStockLevel: {
      type: Number,
      default: 1000,
      min: 0,
    },

    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },

    // Costing
    averageCostPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastPurchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Auto Calculated
    stockValue: {
      type: Number,
      default: 0,
    },

    // Stock Status
    status: {
      type: String,
      enum: ["out_of_stock", "low_stock", "in_stock"],
      default: "in_stock",
    },

    // Stock Activity
    lastStockInAt: {
      type: Date,
    },

    lastStockOutAt: {
      type: Date,
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate stock records
stockSchema.index(
  { productId: 1, branchId: 1 },
  { unique: true }
);

// Auto calculate stock status + stock value
stockSchema.pre("save", function (next) {

  // Stock Value
  this.stockValue = this.quantity * this.averageCostPrice;

  // Status Logic
  if (this.quantity <= 0) {
    this.status = "out_of_stock";
  } else if (this.quantity <= this.minStockLevel) {
    this.status = "low_stock";
  } else {
    this.status = "in_stock";
  }

  next();
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;