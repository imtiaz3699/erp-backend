import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import salesRoutes from "./routes/sale.routes.js";

import swaggerUiExpress from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import stockMovementRoutes from "./routes/stockMovement.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}))

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/stock-movement", stockMovementRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/sale", salesRoutes);

export default app;