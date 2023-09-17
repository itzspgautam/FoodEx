// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import Order from "@/modals/OrderModel";
import { getNextOrderNumber } from "@/utils/OrderUtils";
import { generatePaymentOrder } from "@/utils/PaymentUtils";
import { NextApiRequest, NextApiResponse } from "next";

const newOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  await DbConnect();

  if (req.method === "POST") {
    try {
      const { amount } = req.body;

      const order = await generatePaymentOrder({ amount });
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

export default newOrder;
