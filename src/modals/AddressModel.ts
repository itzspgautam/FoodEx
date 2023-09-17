// pages/api/models/Address.ts

import mongoose, { Document, Schema } from "mongoose";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface Address extends Document {
  type: string;
  streetHouseNumber: string;
  area: string;
  district: string;
  state: string;
  country: string;
  landmark?: string;
  timestamp: Date;
  user: mongoose.Types.ObjectId;
  coordinates: LocationCoordinates;
}

const AddressSchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    streetHouseNumber: { type: String, required: true },
    area: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    landmark: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model<Address>("Address", AddressSchema);
