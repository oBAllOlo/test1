import React, { useState, useEffect } from "react";
import qrcode from "qrcode";
import generatePayload from "promptpay-qr";
import { useCartStore } from "../stores/useCartStore"; // ดึงข้อมูลจาก cart store

const QRCheckout = () => {
  const { cart, total } = useCartStore(); // ดึงข้อมูล cart และ total จาก store
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    amount: total, // ตั้งค่าเริ่มต้นตาม total จาก cart
    slipImage: null, // สำหรับจัดเก็บรูปสลิป
  });

  const [qrCode, setQRCode] = useState(null);

  // ใช้ useEffect เพื่อตั้งค่า amount ใหม่เมื่อ total ใน cart เปลี่ยน
  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, amount: total }));

    // Generate QR code ทันทีที่ total ถูกอัปเดต
    const generateQR = async () => {
      const mobileNumber = "0812345678"; // ใส่เบอร์โทรศัพท์ PromptPay ที่ต้องการ (ควรเป็นเบอร์จริง)
      const payload = generatePayload(mobileNumber, { amount: total }); // สร้าง payload จากเบอร์โทรและจำนวนเงิน

      try {
        const qrDataURL = await qrcode.toDataURL(payload); // สร้าง QR Code ในรูปแบบ Data URL
        setQRCode(qrDataURL); // บันทึก QR Code ใน state
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    if (total > 0) {
      generateQR(); // เรียกใช้การสร้าง QR code ทันทีเมื่อ total พร้อมใช้งาน
    }
  }, [total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ฟังก์ชันจัดการไฟล์อัปโหลด
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, slipImage: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form data or perform any other necessary actions
    console.log("Form submitted", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">PromptPay QR Checkout</h2>

      {/* จัดรายการสินค้าที่เลือกซื้อข้างๆกัน */}
      <div className="mb-8 w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* รายการสินค้าที่เลือกซื้อ */}
        <div className="flex-1">
          <h3 className="text-xl mb-4">Your Selected Items</h3>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-gray-800 p-4 rounded-lg shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <p className="text-white text-lg font-bold">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                <div className="text-emerald-400 font-semibold">
                  {item.quantity} x ฿{item.price.toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-800 rounded-lg shadow">
              <p className="text-white font-semibold text-lg">Total</p>
              <p className="text-emerald-400 font-semibold">
                ฿{total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ฟอร์มข้อมูลการจัดส่ง */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label htmlFor="fullName" className="block text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-300">
                Shipping Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-gray-300">
                Total Amount (฿)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                required
                disabled // ปิดการแก้ไขช่องนี้ เนื่องจากเราดึงค่าจาก total ของ cart โดยตรง
              />
            </div>

            {/* ช่องอัปโหลดรูปสลิป */}
            <div>
              <label htmlFor="slipImage" className="block text-gray-300">
                Upload Payment Slip
              </label>
              <input
                type="file"
                id="slipImage"
                name="slipImage"
                accept="image/*"
                onChange={handleFileChange} // จัดการการเปลี่ยนไฟล์
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-emerald-500"
            >
              Submit
            </button>
          </form>

          {/* แสดง QR Code ที่สร้างทันที */}
          {qrCode && (
            <div className="mt-6">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCheckout;
