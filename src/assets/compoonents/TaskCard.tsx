interface TaskCardProps {
    task: string;
    description: string;
    date: string;
    time: string;
    assignee: string;
    priority: "High" | "Moderate" | "Low";
    status: "Pending" | "In Progress" | "Completed";
  }
  
  const TaskCard: React.FC<TaskCardProps> = ({ task, description, date, time, assignee, priority, status }) => {
    const priorityColors: Record<string, string> = {
      High: "bg-red-500",
      Moderate: "bg-yellow-500",
      Low: "bg-green-500",
    };
  
    return (
      <div className="bg-white shadow-md rounded-lg p-5 border-l-4 transition-transform transform hover:scale-105">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{task}</h3>
          <span className={`px-2 py-1 text-xs text-white rounded ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{description}</p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Date:</strong> {date} | <strong>Time:</strong> {time}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>Assigned to:</strong> {assignee}
        </p>
        <p className={`text-sm mt-2 font-semibold ${status === "Pending" ? "text-red-500" : "text-green-500"}`}>
          Status: {status}
        </p>
      </div>
    );
  };
  
  export default TaskCard;
  