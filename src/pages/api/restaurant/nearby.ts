// api/nearby-restaurants.ts

import { NextApiRequest, NextApiResponse } from "next";

import Restaurant from "@/modals/RestaurantModel";
import DbConnect from "@/config/databse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await DbConnect();
      const { latitude, longitude } = req.body;

      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required." });
      }

      // Find nearby restaurants within a certain distance (in meters)
      const maxDistanceInKm = 5; // You can adjust this distance as needed
      const nearbyRestaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(latitude), parseFloat(longitude)],
            },
            distanceField: "distance",
            maxDistance: maxDistanceInKm * 1000,
            spherical: true,
          },
        },
      ]);

      // Sort restaurants by distance (optional)
      //nearbyRestaurants.sort((a, b) => a.distance - b.distance);

      return res.status(200).json({
        restaurants: nearbyRestaurants,
        total: nearbyRestaurants.length,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
