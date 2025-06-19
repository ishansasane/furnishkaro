import { useState } from "react";

const TaskCard = ({ taskData }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced color mappings with gradients
  const priorityStyles = {
    High: "from-red-500 to-red-600",
    Moderate: "from-amber-500 to-amber-600",
    Low: "from-green-500 to-green-600",
  };

  const statusStyles = {
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    "To Do": "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Format date beautifully
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Check if task is overdue
  const isOverdue =
    new Date(taskData[2]) < new Date() && taskData[7] !== "Completed";

  return (
    <div
      className={`relative w-full bg-white rounded-xl shadow-xs hover:shadow-lg transition-all duration-500 border border-gray-100 overflow-hidden group ${
        isHovered ? "ring-2 ring-indigo-100" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glowing priority accent */}
      <div
        className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${
          priorityStyles[taskData[6]]
        } transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-80"
        }`}
      ></div>

      {/* Floating action button appears on hover */}
      {isHovered && (
        <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-indigo-600 transition-all hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      )}

      {/* Main card content - adjusted padding for reduced height */}
      <div className="p-4 pl-5">
        {/* Task title with subtle hover effect */}
        <h3
          className={`text-md font-semibold text-gray-900 mb-1 transition-all duration-300 ${
            isHovered ? "translate-x-1" : ""
          }`}
        >
          {taskData[0]}
        </h3>

        {/* Priority tag with animated underline */}
        <div className="relative inline-block mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              priorityStyles[taskData[6]]
                ? `bg-gradient-to-r ${priorityStyles[taskData[6]]} text-white`
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {taskData[6]} Priority
          </span>
          <div
            className={`absolute bottom-0 left-0 h-0.5 ${
              priorityStyles[taskData[6]]
                ? `bg-gradient-to-r ${priorityStyles[taskData[6]]}`
                : "bg-gray-300"
            } transition-all duration-500 ${isHovered ? "w-full" : "w-0"}`}
          ></div>
        </div>

        {/* Task description with shorter height */}
        <div className="relative mb-3 max-h-12 overflow-hidden">
          <p className="text-gray-600 text-sm leading-tight line-clamp-2">
            {taskData[5]}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Compact metadata grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
              Due Date
            </p>
            <p
              className={`flex items-center text-xs font-medium ${
                isOverdue ? "text-red-500" : "text-gray-700"
              }`}
            >
              {isOverdue && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {formatDate(taskData[2])}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
              Assigned To
            </p>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold mr-1">
                {taskData[4].charAt(0)}
              </div>
              <p className="text-xs text-gray-700 truncate">{taskData[4]}</p>
            </div>
          </div>
        </div>

        {/* Compact status with progress indicator */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
              Status
            </p>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusStyles[taskData[7]]
              }`}
            >
              {taskData[7]}
            </div>
          </div>

          {/* Smaller progress circle */}
          <div className="relative w-8 h-8">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  taskData[7] === "Completed"
                    ? "#10B981"
                    : taskData[7] === "In Progress"
                    ? "#F59E0B"
                    : "#9CA3AF"
                }
                strokeWidth="3"
                strokeDasharray={`${
                  taskData[7] === "Completed"
                    ? 100
                    : taskData[7] === "In Progress"
                    ? 60
                    : 30
                }, 100`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
              {taskData[7] === "Completed"
                ? "✓"
                : taskData[7] === "In Progress"
                ? "..."
                : "!"}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle hover overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}
      ></div>
    </div>
  );
};

export default TaskCard;
