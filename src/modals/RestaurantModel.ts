// models/restaurant.ts

import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for the Restaurant document
export interface RestaurantProps {
  manager: [];
  name: string;
  cuisine: [];
  logo: string;
  banner: string;
  deliveryTime: number;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  operationHours: {
    day: string;
    openingTime: string;
    closingTime: string;
  }[];
}

// Define the schema for the Restaurant model
const restaurantSchema = new Schema<RestaurantProps & Document>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  cuisine: [
    {
      type: String,
    },
  ],
  deliveryTime: {
    type: Number, // Time in minutes
    required: true,
  },
  operationHours: [
    {
      day: {
        type: String,
        required: true,
      },
      openingTime: {
        type: String,
        required: true,
      },
      closingTime: {
        type: String,
        required: true,
      },
    },
  ],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
});

// Create a geospatial index on the 'location' field to enable location-based queries
restaurantSchema.index({ location: "2dsphere" });

restaurantSchema.index({ name: "text" });

// Create the Restaurant model
const Restaurant: Model<RestaurantProps> =
  mongoose.models.Restaurant ||
  mongoose.model<RestaurantProps>("Restaurant", restaurantSchema);

export default Restaurant;
