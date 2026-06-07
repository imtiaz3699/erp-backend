
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productImages: [
      {
        url: String,
        public_id: String
      }
    ],
    barcode: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    unit: { type: String, enum: ['KG', 'PCS', 'BOX'], required: true },           // kg, pcs, box, etc.
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
  }, {
  timestamps: true, // creates createdAt & updatedAt automatically
}
);
productSchema.index({name:1,barcode:1},{unique:true})
const Product = mongoose.model("Product", productSchema);

export default Product;