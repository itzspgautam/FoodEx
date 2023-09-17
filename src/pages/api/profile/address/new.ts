// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import { NextApiRequest, NextApiResponse } from "next";

const newAddress = async (req: NextApiRequest, res: NextApiResponse) => {
  await DbConnect();

  if (req.method === "POST") {
    try {
      const {
        type,
        streetHouseNumber,
        area,
        district,
        state,
        country,
        landmark,
        coordinates,
      } = req.body;
      const user = req.user;

      if (
        !type ||
        !streetHouseNumber ||
        !area ||
        !district ||
        !state ||
        !country ||
        !landmark ||
        !coordinates
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      const newAddress = new AddressModal({
        type,
        streetHouseNumber,
        area,
        district,
        state,
        country,
        landmark,
        coordinates,
        user: user._id,
      });

      const savedAddress = await newAddress.save();

      res.status(201).json({ success: true, address: savedAddress });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error creating the address" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

export default authHandle(newAddress);
