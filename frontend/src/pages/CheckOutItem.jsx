import { redirect, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, message, Form, Radio, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import clerk from "@/utils/clerk";
import { toast } from "sonner";

export const checkoutLoader = () => {
  try {
    if (!clerk.isSignedIn) {
      toast("You must login first", {
        description: "Login please",
      });
      return redirect("/");
    }
  } catch (error) {
    toast(error?.message || "error");
  }
};

const CheckoutItemPage = () => {
  const { userId } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Kiểm tra dữ liệu từ location.state
  useEffect(() => {
    if (!data || !data.itemId || !data.price) {
      message.error("Không tìm thấy thông tin sản phẩm.");
      navigate("/"); // Điều hướng về trang chính nếu thiếu dữ liệu
    }
  }, [data, navigate]);

  const [form] = Form.useForm();
  const [borrowDuration, setBorrowDuration] = useState(
    data?.borrowDuration || 1
  ); // Thời gian mượn mặc định
  const [totalPrice, setTotalPrice] = useState(data?.price || 0); // Tổng giá mặc định
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Trạng thái hiển thị modal

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value, 10);
    if (duration >= 1) {
      setBorrowDuration(duration);
      setTotalPrice(duration * data.price); // Tính tổng giá dựa trên thời gian mượn
    }
  };

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      console.log("Location State:", location.state);

      const borrowInfo = {
        borrowerClerkId: userId, // ID người mượn
        itemId: data.itemId, // ID sản phẩm
        totalTime: borrowDuration, // Thời gian mượn
        totalPrice: totalPrice, // Tổng giá
      };

      if (values.paymentMethod === "vnpay") {
        const orderId = Date.now().toString();
        localStorage.setItem("orderId", JSON.stringify(orderId));
        localStorage.setItem("borrowInfo", JSON.stringify(borrowInfo));
        message.info("Đang chuyển hướng đến VNPay...");

        const vnpayResponse = await axios.post(
          "http://localhost:3000/vnpay/create-payment",
          {
            amount: totalPrice,
            orderId: orderId,
            returnUrl: `${window.location.origin}/return-vnpay`,
          }
        );

        if (vnpayResponse.data.paymentUrl) {
          window.location.href = vnpayResponse.data.paymentUrl;
        } else {
          message.error("Lỗi khi tạo thanh toán VNPay.");
        }
      } else {
        // Xử lý thanh toán tiền mặt
        const response = await axios.post(
          "http://localhost:3000/borrow",
          borrowInfo
        );
        if (response.status === 201) {
          message.success("Mượn thành công! Dữ liệu đã được lưu.");
          setIsSuccessModalVisible(true);
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Error saving borrow data:", error.response.data);
        message.error(
          error.response.data.message || "Đã xảy ra lỗi khi lưu dữ liệu mượn."
        );
      } else {
        console.error("Error:", error);
        message.error("Vui lòng điền đầy đủ thông tin.");
      }
    }
  };

  const handleSuccessModalOk = () => {
    setIsSuccessModalVisible(false);
    navigate("/"); // Điều hướng về trang chính
  };

  return (
    <div style={styles.container}>
      <Card title="Borrow Confirmation" style={styles.card}>
        <div style={styles.infoSection}>
          <h3 style={styles.title}>{data.name}</h3>
          <p style={styles.description}>{data.description}</p>
          <p style={styles.price}>
            {data.isFree
              ? "FREE"
              : `${data.price.toLocaleString()} đ / ${data.rate}`}
          </p>
        </div>
        <Form form={form} layout="vertical" style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="duration">
              Borrow Duration ({data.rate})
            </label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={borrowDuration}
              onChange={handleDurationChange}
              style={styles.input}
            />
          </div>

          <div style={styles.totalPrice}>
            <span>Total Price:</span>
            <span>
              {data.isFree ? "FREE" : `${totalPrice.toLocaleString()} đ`}
            </span>
          </div>

          <Form.Item
            name="paymentMethod"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương thức thanh toán.",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="cash">Tiền mặt</Radio>
              <Radio value="vnpay">VNPay</Radio>
            </Radio.Group>
          </Form.Item>
          <Button
            type="primary"
            onClick={handleConfirm}
            block
            style={styles.button}
          >
            Xác nhận mượn
          </Button>
        </Form>
      </Card>

      {/* Modal hiển thị khi thanh toán thành công */}
      <Modal
        title="Thanh toán thành công"
        visible={isSuccessModalVisible}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>Bạn đã mượn thành công! Vui lòng thanh toán tại quầy.</p>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  infoSection: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    marginTop: "20px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  totalPrice: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#1890ff",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "4px",
  },
};

export default CheckoutItemPage;
