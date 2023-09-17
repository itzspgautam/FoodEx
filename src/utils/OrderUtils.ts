import Order from "@/modals/OrderModel";

export const getNextOrderNumber = async () => {
  const latestOrder = await Order.findOne().sort({ orderNumber: -1 });

  if (latestOrder) {
    return parseInt(latestOrder.orderNumber) + 1;
  } else {
    return 1; // Start from 1 if no orders exist
  }
};
