import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { formatToThaiBaht } from "../lib/utils.js"; // นำเข้าฟังก์ชัน

const stripePromise = loadStripe(
  "pk_test_51PwJSPJblUbn5Gfanij6bKbErTpWOlGRX817EXBuftMDrAv2gaGTg1O4yqQROoSkkQCZ07nUZ2W562v7G8ODkcah00SCpA3Cy9"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, cart } = useCartStore();
  const navigate = useNavigate(); // Initialize the navigate function

  const savings = subtotal - total;

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = res.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  // Handle navigation to the QR Checkout page
  const handleQRPayment = () => {
    navigate("/qr-checkout");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Original price</dt>
            <dd className="text-base font-medium text-white">{formatToThaiBaht(subtotal)}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -{formatToThaiBaht(savings)}
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">{formatToThaiBaht(total)}</dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout With Card
        </motion.button>

        {/* Button to navigate to QR Checkout page */}
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleQRPayment} // Call the navigation function here
        >
          Proceed to Checkout With QR
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
