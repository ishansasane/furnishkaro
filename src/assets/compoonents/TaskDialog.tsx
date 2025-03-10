import { useState } from "react";

interface TaskDialogProps {
  onClose: () => void;
  isEditing : boolean;
  setediting : () => void;
  name : string;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ onClose, isEditing, setediting, name }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [assignee, setAssignee] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("Moderate");
  const [status, setStatus] = useState("Pending");

  const addTask = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addtask", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ title : taskName, description, date : dateTime, time : dateTime, assigneeLink : assignee, projectLink : project, priority, status })
    });

    if(response.status === 200){
      alert("Task Added");
    }else{
      alert("Error");
    }
    onClose();
  }

  const editTask = async () => {

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatetask", {
      method : "POST",
      headers : {
        "content-type" : "application/json",
      },
      credentials : "include",
      body : JSON.stringify({ title : name, description, date : dateTime, time : dateTime, assigneeLink : assignee, projectLink : project, priority, status })
    });

    if(response.status === 200){
      alert("Task updates");
    }else{
      alert("error");
    }
    setediting();
    onClose();
  }

  const cancel = () => {
    setediting();
    onClose();
  }

  return (
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
      {/* Dialog Box */}
      <div className="relative bg-white shadow-lg rounded-lg p-6 w-full border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 {isEditing ? "Edit Task" : "Add Task"}</h2>

        {/* Task Name */}
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={`w-full border p-2 rounded mb-3 ${isEditing ? "hidden" : "none" }`}
        />

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        ></textarea>

        {/* Date & Time */}
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Assignee */}
        <input
          type="text"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Project Selection */}
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Project</option>
          <option value="Website Redesign">Website Redesign</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="Backend API">Backend API</option>
        </select>

        {/* Priority Selection */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

        {/* Status Selection */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={cancel} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={isEditing ? editTask : addTask} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isEditing ? "Edit Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;
