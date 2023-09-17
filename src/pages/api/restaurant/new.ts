// pages/api/restaurants.ts

import DbConnect from "@/config/databse";
import Restaurant, { RestaurantProps } from "@/modals/RestaurantModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Connect to the database
      await DbConnect();

      // Get the restaurant data from the request body
      const {
        name,
        deliveryTime,
        address,
        cuisine,
        rating,
        logo,
        banner,
        location,
        operationHours,
      } = req.body;

      // Create a new restaurant document using the Restaurant model
      const newRestaurant = new Restaurant({
        name,
        deliveryTime,
        logo,
        banner,
        cuisine,
        rating,
        address,
        location,
        operationHours,
      });
      await newRestaurant.save();
      // Return the newly created restaurant as the response
      return res.status(201).json(newRestaurant);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  // Handle unsupported HTTP methods
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
