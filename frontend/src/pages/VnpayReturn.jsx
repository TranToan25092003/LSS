import { message, Spin } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FailedModal from "../components/vnPay/FailedModal";
import SuccessModal from "../components/vnPay/SuccessModal";

const VnpayReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalFailedVisible, setIsModalFailedVisible] = useState(false);

  useEffect(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    const query = new URLSearchParams(location.search);
    const vnp_ResponseCode = query.get("vnp_ResponseCode");
    const orderId = query.get("vnp_TxnRef");
    const amount = query.get("vnp_Amount");

    if (!orderId || !amount) {
      message.error("Lỗi: Không tìm thấy thông tin giao dịch.");
      setIsModalFailedVisible(true);
      return;
    }

   const handleVNPayResponse = async () => {
    try {
        const borrowInfo = JSON.parse(localStorage.getItem("borrowInfo")) || {};
        if (!borrowInfo.borrowerClerkId || !borrowInfo.itemId) {
            message.error("Lỗi: Không tìm thấy thông tin mượn.");
            setIsModalFailedVisible(true);
            return;
        }

        const response = await axios.post("http://localhost:3000/borrow", {
            ...borrowInfo,
            transactionId: orderId,
            paymentStatus: "paid",
        });

        if (response.status === 201) {
            localStorage.removeItem("borrowInfo");
            setIsModalVisible(true);
        } else {
            throw new Error("Không thể lưu thông tin mượn.");
        }
    } catch (error) {
        console.error("Lỗi khi xử lý phản hồi VNPay:", error);
        message.error("Lỗi khi xử lý phản hồi VNPay.");
        setIsModalFailedVisible(true);
    }
};

    if (vnp_ResponseCode === "00") {
      console.log("✅ Thanh toán thành công, bắt đầu xử lý...");
      handleVNPayResponse();
    } else {
      console.log("❌ Thanh toán thất bại.");
      message.error("Thanh toán thất bại. Vui lòng thử lại.");
      setIsModalFailedVisible(true);
    }
  }, [location]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Spin size="large" />
      <SuccessModal isVisible={isModalVisible} onClose={() => navigate("/")} />
      <FailedModal isVisible={isModalFailedVisible} onClose={() => navigate("/")} />
    </div>
  );
};

export default VnpayReturn;