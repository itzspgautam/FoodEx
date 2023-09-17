// pages/api/create-address.ts

import DbConnect from "@/config/databse";
import authHandle from "@/middleware/authHandle";
import AddressModal from "@/modals/AddressModel";
import { UserModel } from "@/modals/UserModel";
import { NextApiRequest, NextApiResponse } from "next";

const getAllAddress = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    await DbConnect();
    try {
      const user = req.user;
      console.log(user);

      const getAddresses = await AddressModal.find({ user });

      res.status(200).json({
        success: true,
        addresses: getAddresses,
        total: getAddresses.length,
      });
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

export default authHandle(getAllAddress);
