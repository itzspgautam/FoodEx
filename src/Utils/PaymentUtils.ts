import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import {RootState} from '../State/store';

export const openRazorpay = ({
  orderId,
  prefill,
}: {
  orderId: String;
  prefill: {email: String | null; contact: String | null; name: String};
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options: any = {
        description: 'Payment Description',
        image: 'https://your-image-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_tCST2FUUfTNF0C',
        name: 'FoodEx',
        prefill,
        theme: {color: '#DC220F'},
        order_id: orderId, // Unique order ID
      };

      const paymentResponse = await RazorpayCheckout.open(options);
      resolve(paymentResponse);
    } catch (error) {
      reject(error);
    }
  });
};
