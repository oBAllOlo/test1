import React, { useState } from "react";
import qrcode from "qrcode";
import generatePayload from "promptpay-qr";

const QRCheckout = () => {
  const [qrCode, setQRCode] = useState(null);

  const handleGenerateQR = async (amount) => {
    const mobileNumber = "0812345678"; // ใส่เบอร์โทรศัพท์ PromptPay ที่ต้องการ (ควรเป็นเบอร์จริง)
    const payload = generatePayload(mobileNumber, { amount }); // สร้าง payload จากเบอร์โทรและจำนวนเงิน

    try {
      const qrDataURL = await qrcode.toDataURL(payload); // สร้าง QR Code ในรูปแบบ Data URL
      setQRCode(qrDataURL); // บันทึก QR Code ใน state
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">PromptPay QR Checkout</h2>

      <button
        onClick={() => handleGenerateQR(100)} // สมมติว่าเป็นจำนวน 100 บาท
        className="mb-6 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        Generate QR Code 
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
