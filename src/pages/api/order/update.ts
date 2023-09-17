// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import Order from "@/modals/OrderModel";
import { getNextOrderNumber } from "@/utils/OrderUtils";
import { NextApiRequest, NextApiResponse } from "next";

const newOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  await DbConnect();

  if (req.method === "PUT") {
    try {
      const { orderId, payment } = req.body;
      const user = req.user;

      if (!orderId) {
        return res
          .status(404)
          .json({ success: false, message: "Order id is required." });
      }
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
      }
      order.payment = payment;

      await order.save();

      res.status(201).json({ success: true, order });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error creating the order", error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

export default authHandle(newOrder);
