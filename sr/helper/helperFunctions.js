import { InvoiceNumber } from "../models/purchase.model.js";
import { SaleInvoiceNumber } from "../models/sale.model.js";
export const errorResponse = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export const successResponse = (
  res,
  statusCode = 200,
  message = "Request successful",
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};


export const getNextInvoiceNumber = async () => {
  const counter = await InvoiceNumber.findOneAndUpdate(
    { name: "invoice" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  )
  return counter.value;
}

export const formatInvoiceNumber = (num) => {
  const padded = String(num).padStart(3, "0");
  return `INV-${padded}`
}


export const saleInvoiceNumber = async () => {
  const counter = await SaleInvoiceNumber.findOneAndUpdate(
    { name: "sale" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  )
  return counter.value;
}
export const formatSaleInvoiceNumber = (num) => {
  const padded = String(num).padStart(3, "0");
  return `SAL-${padded}`
}