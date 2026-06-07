
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type:String, required: true },
    description:{ type: String },
    isActive: { type: Boolean, required: true },
  }, {
  timestamps: true, // creates createdAt & updatedAt automatically
}
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;