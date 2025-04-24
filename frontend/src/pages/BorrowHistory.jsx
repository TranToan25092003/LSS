import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { customFetch } from "../utils/customAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import HistoryButtons from "../components/HistoryButtons";

const BorrowHistory = () => {
  const { user } = useUser();
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await customFetch.get(`/borrow/history/${user.id}`);
        setBorrowHistory(response.data.data);
      } catch (error) {
        console.error("Error fetching borrow history:", error);
        setError(
          error.response?.data?.message || "Lỗi khi tải lịch sử mượn đồ"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBorrowHistory();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <HistoryButtons />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <HistoryButtons />
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <p className="font-bold">Có lỗi xảy ra!</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (!borrowHistory || borrowHistory.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <HistoryButtons />
        <h1 className="text-2xl font-bold mb-6">Lịch sử mượn đồ</h1>
        <p className="text-gray-500">Bạn chưa có lịch sử mượn đồ nào</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <HistoryButtons />
      <h1 className="text-2xl font-bold mb-6">Lịch sử mượn đồ</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên đồ</TableHead>
            <TableHead>Thời gian mượn</TableHead>
            <TableHead>Tổng thời gian</TableHead>
            <TableHead>Tổng giá</TableHead>
            <TableHead>Trạng thái trả</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowHistory.map((borrow) => (
            <TableRow key={borrow._id}>
              <TableCell>{borrow.item?.name}</TableCell>
              <TableCell>
                {format(new Date(borrow.createdAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{borrow.totalTime} giờ</TableCell>
              <TableCell>{borrow.totalPrice.toLocaleString()} VND</TableCell>
              <TableCell>
                {borrow.returnStatus ? (
                  borrow.returnStatus.ownerConfirm ? (
                    <span className="text-green-600">Đã trả</span>
                  ) : (
                    <span className="text-yellow-600">Đang chờ xác nhận</span>
                  )
                ) : (
                  <span className="text-red-600">Chưa trả</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BorrowHistory;
