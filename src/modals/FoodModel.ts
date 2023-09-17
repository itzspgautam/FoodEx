import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define interfaces for customization and customization option
export interface CustomizationOption {
  _id: string;
  name: string;
  price: number;
}

interface Customization {
  _id: string;
  name: string;
  options: CustomizationOption[];
}

// Define interface for the Food document
interface Food extends Document {
  _id: string;
  name: string;
  category: string;
  customizations: Customization[];
  restaurant: ObjectId; // Use the ObjectId type here
}

// Define the Food schema
const FoodSchema: Schema<Food> = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  customizations: [{ type: Object, required: true }],
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

// Create the "Food" collection model using the FoodSchema
let Food: Model<Food>;

FoodSchema.index({ name: "text" });

try {
  Food = mongoose.models.Food || mongoose.model<Food>("Food", FoodSchema);
} catch (err) {
  Food = mongoose.model<Food>("Food", FoodSchema);
}

export default Food;
