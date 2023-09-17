// pages/api/models/Payment.ts

import mongoose, { Document, Schema } from "mongoose";

export interface Payment extends Document {
  order_id: string;
  payment_id: string;
  area: string;
  amount: number;
}

const PaymentSchema: Schema = new Schema(
  {
    order_id: { type: String, required: true },
    payment_id: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<Payment>("Payment", PaymentSchema);
