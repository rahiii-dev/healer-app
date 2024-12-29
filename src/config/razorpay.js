import Razorpay from "razorpay";

if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET){
    throw new Error("Razorpay credentials are required: 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'")
}
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
