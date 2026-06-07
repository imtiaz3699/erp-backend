import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, required: true },
  }, {
  timestamps: true, // creates createdAt & updatedAt automatically
}
);

const Category = mongoose.model("Category", categorySchema);

export default Category;