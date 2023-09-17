import mongoose, { Mongoose } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        customisation: [
          {
            name: { type: String },
            option: {
              _id: { type: String },
              name: { type: String },
              price: { type: Number },
            },
          },
        ],
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    address: {
      type: { type: String, required: true },
      streetHouseNumber: { type: String, required: true },
      area: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      landmark: { type: String },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    payment: {
      mode: {
        type: String,
        enum: ["CASH", "ONLINE"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
      payment: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
