import DbConnect from "@/config/databse";
import Food from "@/modals/FoodModel";
import Restaurant from "@/modals/RestaurantModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = req.query.query as string;
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);

    if (!query)
      return res
        .status(400)
        .json({ success: false, message: "Missing search query." });
    if (!latitude || !longitude)
      return res
        .status(400)
        .json({ success: false, message: "Invalid latitude or longitude." });

    try {
      await DbConnect();

      const maxDistanceInKm = 5;

      const nearbyRestaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [latitude, longitude] },
            distanceField: "distance",
            maxDistance: maxDistanceInKm * 1000,
            spherical: true,
          },
        },
      ]);

      const nearbyRestaurantIds = nearbyRestaurants.map(
        (restaurant) => restaurant._id
      );

      const searchedFoods = await Food.find({
        name: { $regex: query, $options: "i" },
        restaurant: { $in: nearbyRestaurantIds },
      }).populate("restaurant");

      const searchedRestaurants = nearbyRestaurants
        .filter((restaurant) => restaurant.name.match(new RegExp(query, "i")))
        .map((item) => item);

      res
        .status(200)
        .json({ restaurants: searchedRestaurants, foods: searchedFoods });
    } catch (error) {
      console.error("Error during search:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
