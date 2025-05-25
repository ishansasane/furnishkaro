import { useEffect } from "react";
  
  const TaskCard = ({ taskData }) => {
    const priorityColors: Record<string, string> = {
      "High": "bg-red-500",
      "Moderate": "bg-yellow-500",
      "Low": "bg-green-500",
    };

    return (
      <div className={`bg-white shadow-md rounded-lg ml-4 mt-4 mb-4 p-5 border-l-4 transition-transform transform hover:scale-109`}>
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-800">{taskData[0]}</h4>
          <span className={`px-2 py-1 text-xs text-white rounded ${taskData[6] == "Low" ? "bg-green-500" : ""} ${taskData[6] == "Moderate" ? "bg-yellow-500" : ""} ${taskData[6] == "High" ? "bg-red-500" : ""}`}>
            {taskData[6]}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{taskData[5]}</p>
        <p className="text-gray-600 text-xs mt-2">
          <strong>Date:</strong> {taskData[2]}
        </p>
        <p className="text-gray-600 text-xs">
          <strong>Assigned to:</strong> {taskData[4]}
        </p>
        <p className={`text-sm mt-2 font-semibold ${taskData[7] === "In Progress" ? "text-yellow-500" : ""} ${taskData[7] === "Completed" ? "text-green-500" : ""} ${taskData[7] === "To Do" ? "text-red-500" : ""}`}>
          Status: {taskData[7]}
        </p>
      </div>
    );
  };
  
  export default TaskCard;
  