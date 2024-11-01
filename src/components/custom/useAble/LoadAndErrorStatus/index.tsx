// Loading and Error Components
export const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center ">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
// Empty Component with Animated Icon


const Empty: React.FC<{ message?: string }> = ({ message = "No items found." }) => {
  return (
    <div className="flex flex-col items-center justify-center  text-center">
      <div className="animate-bounce mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m0 0H4m8 0h8"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default Empty;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (message?.includes("ID not found in context")) {
      navigate("/login");
    }
  }, [message, navigate]);

  return (
    <div className="flex items-center justify-center">
      <p className="text-red-600 text-lg">Error: {message}</p>
    </div>
  );
};


  //cn("[&_tr]:border-b", className)