import React, { useState } from "react";
import qrcode from "qrcode";
import generatePayload from "promptpay-qr";
import { useCartStore } from "../stores/useCartStore"; // ดึงข้อมูล total จาก cart store

const QRCheckout = () => {
  const { total } = useCartStore(); // รับ total จาก store ที่เก็บข้อมูลรถเข็นสินค้า
  const [qrCode, setQRCode] = useState(null);

  const handleGenerateQR = async () => {
    const mobileNumber = "0812345678"; // เบอร์ PromptPay ที่ต้องการ
    const payload = generatePayload(mobileNumber, { amount: total }); // ใช้ total เป็นจำนวนเงิน

    try {
      const qrDataURL = await qrcode.toDataURL(payload); // สร้าง QR Code ในรูปแบบ Data URL
      setQRCode(qrDataURL); // เก็บ QR Code ใน state
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">PromptPay QR Checkout</h2>

      <button
        onClick={handleGenerateQR} // สร้าง QR Code ตามยอด Total
        className="mb-6 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        Generate QR Code for {total} THB
      </button>

      {qrCode ? (
        <img src={qrCode} alt="QR Code" className="mt-4" />
      ) : (
        <p>Click the button to generate a QR Code</p>
      )}
    </div>
  );
};

export default QRCheckout;
