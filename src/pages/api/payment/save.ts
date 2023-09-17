// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import Order from "@/modals/OrderModel";
import PaymentModel from "@/modals/PaymentModel";
import { getNextOrderNumber } from "@/utils/OrderUtils";
import { verifyPaymentBeforeSave } from "@/utils/PaymentUtils";
import { NextApiRequest, NextApiResponse } from "next";

const newOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  await DbConnect();

  if (req.method === "POST") {
    try {
      const { order_id, payment_id, amount } = req.body;

      const verifyOrder = await verifyPaymentBeforeSave({
        order_id,
        payment_id,
        amount,
      });
      if (!verifyOrder.success) {
        res.status(400).json({ success: false, message: verifyOrder.message });
        return;
      }

      const isOrderAlreadySaved = await PaymentModel.findOne({ order_id });
      if (isOrderAlreadySaved) {
        res.status(400).json({
          success: false,
          message: "This payment is already registered.",
        });
        return;
      }

      const newPayment = new PaymentModel({
        order_id,
        payment_id,
        amount,
      });

      await newPayment.save();

      res.status(201).json({ success: true, payment: newPayment });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error savinf the payment", error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

export default newOrder;
