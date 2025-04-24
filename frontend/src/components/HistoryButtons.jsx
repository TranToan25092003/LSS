import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HistoryButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => navigate("/history")}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          currentPath === "/history"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        Lịch sử mượn đồ
      </button>
      <button
        onClick={() => navigate("/lend-history")}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          currentPath === "/lend-history"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        Lịch sử cho mượn
      </button>
    </div>
  );
};

export default HistoryButtons;
