import DbConnect from "@/config/databse";
import Food from "@/modals/FoodModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { restaurant } = req.query;

    try {
      await DbConnect();
      const menu = await Food.find({ restaurant });

      return res.status(200).json({
        success: true,
        menu,
        total: menu.length,
      });
    } catch (error) {
      console.error("Error fetching menu:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed." });
  }
}
