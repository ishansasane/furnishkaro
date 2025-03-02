import React from "react";

interface CardProps {
  title: string;
  value: number;
  color: string; // Tailwind color class (e.g., "bg-blue-500")
  isCurrency?: boolean; // If true, show ₹ before value
}

const Card: React.FC<CardProps> = ({ title, value, color, isCurrency = false }) => {
  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 w-full max-w-sm">
      {/* Vertical Colored Line */}
      <div className={`w-2 h-full ${color} rounded-l-lg`}></div>

      {/* Content */}
      <div className="ml-4">
        <h4 className="text-gray-600 text-sm font-semibold">{title}</h4>
        <p className="text-xl font-bold text-gray-900">
          {isCurrency ? `₹${value.toLocaleString()}` : value}
        </p>
      </div>
    </div>
  );
};

export default Card;
