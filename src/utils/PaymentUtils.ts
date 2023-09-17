import newOrder from "@/pages/api/payment/save";

const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_tCST2FUUfTNF0C",
  key_secret: "xn2plljXCCx38jEjbRCF2W3a",
});

export const generatePaymentOrder = async ({ amount }: { amount: number }) => {
  const order = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: "REC-FEX-" + Date.now().toString(),
    partial_payment: false,
  });
  return order;
};

export const verifyPaymentBeforeSave = async ({
  order_id,
  payment_id,
  amount,
}: {
  order_id: string;
  payment_id: string;
  amount: number;
}) => {
  try {
    const fetchOrder = await instance.orders.fetchPayments(order_id);
    const order = fetchOrder.items[0];
    if (order?.amount !== amount) {
      return { success: false, message: "Invalid amount for this order." };
    }
    if (order?.id !== payment_id) {
      return { success: false, message: "Invalid payment Id for this order." };
    }
    return { success: true, message: "Order verified successfully!", order };
  } catch (error: any) {
    return { success: false, message: error?.error?.description, error: error };
  }
};
