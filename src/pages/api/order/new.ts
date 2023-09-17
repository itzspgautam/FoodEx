// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import Order from "@/modals/OrderModel";
import { getNextOrderNumber } from "@/utils/OrderUtils";
import { NextApiRequest, NextApiResponse } from "next";

const newOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  await DbConnect();

  if (req.method === "POST") {
    try {
      const { restaurant, items, address, payment } = req.body;
      const user = req.user;
      console.log(items);
      const orderNumber = await getNextOrderNumber();
      const newOrder = new Order({
        orderNumber,
        items,
        address,
        payment,
        restaurant,
        user: user._id,
      });

      const savedOrder = await newOrder.save();

      res.status(201).json({ success: true, order: savedOrder });
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
