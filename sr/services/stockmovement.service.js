import Stock from "../models/stock.model.js";
import StockMovement from "../models/stockmovement.model.js";
import Purchase from "../models/purchase.model.js";
import mongoose from "mongoose";
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

  let stock = await Stock.findOne({ productId, branchId });
  console.log(stock,"noor")
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

  if (type === "OUT" && referenceType === "TRANSFER") {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const fromBranchStock = await Stock.findOne({ productId, branchId: fromBranchId }).session(session);
        if (!fromBranchStock) {
          throw new Error("Source Stock does not exists.")
        }

        if (fromBranchStock.quantity < quantity) {
          throw new Error("Insufficient stock for transfer.")
        }

        fromBranchStock.quantity -= quantity;
        await fromBranchStock.save({ session });

        let toStock = await Stock.findOne({ productId, branchId: toBranchId }).session(session);

        if (!toStock) {
          toStock = new Stock({
            productId,
            branchId: toBranchId,
            quantity: 0,
            reservedQty: 0,
            damagedQty: 0,
            minStockLevel: 0,
            maxStockLevel: 0,
          })
        }
        toStock.quantity += quantity;
        await toStock.save({ session });
      })

      session.endSession();
    } catch (e) {
      session.endSession();
      throw e;
    }
  }

  if (type === "OUT" && referenceType === "SALE") {
    if (stock.quantity < 1) {
      throw new Error("Insufficient stock for sale.");
    }
    if (stock.quantity < quantity) {
      throw new Error("Insufficient stock for sale.");
    }
    stock.quantity -= quantity;
    stock.lastStockOutAt = new Date();
  }

  if (type === "DAMAGE") {
    stock.quantity -= quantity;
    stock.damagedQty = (stock.damagedQty || 0) + quantity;
  }

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