import Stock from "../models/stock.model.js";
import StockMovement from "../models/stockmovement.model.js";
import Purchase from "../models/purchase.model.js";

export const stockMovementService = async ({
  productId,
  branchId,
  type,
  quantity,
  referenceType,
  referenceId,
  fromBranchId,
  toBranchId,
  costPrice,
  sellingPrice,
  userId,
}) => {

  // 1. Find stock
  let stock = await Stock.findOne({ productId, branchId });

  // 2. Create stock if not exists
  if (!stock) {
    stock = await Stock.create({
      productId,
      branchId,
      quantity: 0,
      reservedQty: 0,
      damagedQty: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
    });
  }

  // 3. STOCK LOGIC (CORE RULE ENGINE)

  if (type === "IN") {

    if (referenceType === "PURCHASE") {
      const purchase = await Purchase.findById(referenceId)
      const item = purchase.items.find(item => item.productId.toString() === productId.toString())
      if (!item) {
        throw new Error("Product Does not belong to purchase order.")
      }
      if (item.received) {
        throw new Error("Stock Already received for this product.")
      }
      item.received = true;
      const totalItems = purchase.items.length;
      const receivedItems = purchase.items.filter(item => item.received).length;

      if (receivedItems === 0) {
        purchase.status = "pending";
      } else if (receivedItems < totalItems) {
        purchase.status = "partially_received"
      } else {
        purchase.status = "completed"
      }
      await purchase.save();
    }


    stock.quantity += quantity;
    stock.lastStockInAt = new Date();

    if (costPrice) {
      stock.lastPurchasePrice = costPrice;

      // simple avg costing
      stock.averageCostPrice =
        (stock.averageCostPrice + costPrice) / 2;
    }
  }

  if (type === "OUT") {
    if (stock.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    stock.quantity -= quantity;
    stock.lastStockOutAt = new Date();
  }

  if (type === "DAMAGE") {
    stock.quantity -= quantity;
    stock.damagedQty = (stock.damagedQty || 0) + quantity;
  }

  if (type === "TRANSFER") {
    if (stock.quantity < quantity) {
      throw new Error("Insufficient stock for transfer");
    }

    stock.quantity -= quantity;
  }

  // 4. SAVE STOCK
  await stock.save();

  // 5. CREATE STOCK MOVEMENT LOG
  const movement = await StockMovement.create({
    productId,
    branchId,
    type,
    quantity,
    referenceType,
    referenceId: referenceId || undefined,
    fromBranchId: fromBranchId || undefined,
    toBranchId: toBranchId || undefined,
    costPrice,
    sellingPrice,
    createdBy: userId,
  });

  return {
    stock,
    movement,
  };
};