import { useEffect } from "react";

const TaskCard = ({ taskData }) => {
  const priorityColors = {
    High: "bg-red-500",
    Moderate: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <div className="bg-white shadow-md rounded-lg ml-4 mt-4 mb-2 p-5 border-l-4 transition-transform transform hover:scale-105">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{taskData[0]}</h3>
        <span className={`px-2 py-1 text-xs font-medium text-white rounded ${priorityColors[taskData[6]]}`}>
          {taskData[6]}
        </span>
      </div>
      <p className="text-base text-gray-500 mt-2">{taskData[5]}</p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Date:</strong> {taskData[2]}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Assigned to:</strong> {taskData[4]}
      </p>
      <p className={`text-sm font-medium mt-2 ${taskData[7] === "In Progress" ? "text-yellow-500" : ""} ${taskData[7] === "Completed" ? "text-green-500" : ""} ${taskData[7] === "To Do" ? "text-red-500" : ""}`}>
        Status: {taskData[7]}
      </p>
    </div>
  );
};

export default TaskCard;