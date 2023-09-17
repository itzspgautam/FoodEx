import { NextApiRequest, NextApiResponse } from "next";
import DbConnect from "@/config/databse";
import Food from "@/modals/FoodModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    DbConnect();
    try {
      // Parse the incoming data from the request body
      const { name, category, customizations, restaurant } = req.body;

      // Create a new Food document based on the data received
      const newFood: Food = new Food({
        name,
        category,
        customizations,
        restaurant: restaurant,
      });

      // Save the new food item to the database
      await newFood.save();

      return res.status(201).json({
        success: true,
        message: "Food item saved successfully.",
        food: newFood,
      });
    } catch (error) {
      console.error("Error saving food item:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error saving food item." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
