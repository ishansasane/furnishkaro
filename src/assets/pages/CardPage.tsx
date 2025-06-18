import React from "react";

interface CardProps {
  title: string;
  value: number;
  color: string; // Tailwind color class (e.g., "bg-blue-500")
  isCurrency?: boolean;
  icon?: React.ReactNode; // Optional icon
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  percentage?: number; // Optional percentage change
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  color,
  isCurrency = false,
  icon,
  trend,
  percentage,
}) => {
  // Format value with Indian locale
  const formattedValue = isCurrency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");

  // Determine trend colors
  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  }[trend || "neutral"];

  const trendIcon = {
    up: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ),
    down: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    ),
    neutral: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    ),
  }[trend || "neutral"];

  return (
    <div className="relative group overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full p-5">
      {/* Gradient background overlay (hidden until hover) */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${color.replace(
          "bg-",
          "bg-gradient-to-r from-"
        )} to-white`}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          {/* Title with optional icon */}
          <div className="flex items-center mb-1">
            {icon && (
              <div className={`p-2 rounded-lg ${color} bg-opacity-10 mr-3`}>
                {React.cloneElement(icon as React.ReactElement, {
                  className: "w-5 h-5 " + color,
                })}
              </div>
            )}
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
          </div>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formattedValue}
          </p>

          {/* Trend indicator (if provided) */}
          {trend && percentage && (
            <div className={`flex items-center text-sm ${trendColor}`}>
              {trendIcon}
              <span className="ml-1">
                {percentage}% {trend === "up" ? "increase" : "decrease"}
              </span>
              <span className="ml-2 text-xs text-gray-400">vs last period</span>
            </div>
          )}
        </div>

        {/* Optional decorative element */}
        <div
          className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}
        >
          <div className={`w-8 h-8 rounded-full ${color} bg-opacity-20`}></div>
        </div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, value / 1000)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Card;
