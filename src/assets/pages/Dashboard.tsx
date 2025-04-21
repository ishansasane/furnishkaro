import { useState, useEffect } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard";
import TaskCard from "../compoonents/TaskCard";
import InquiryCard from "../compoonents/InquiryCard";
import TaskDialog from "../compoonents/TaskDialog";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store.ts";
import { setTasks, setProjects } from "../Redux/dataSlice.ts";

const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);

    const dispatch = useDispatch();
    const tasks  = useSelector((state: RootState) => state.data.tasks);
    const projects  = useSelector((state: RootState) => state.data.projects);

  useEffect(() => {
    const fetchdata = async () => {
      let data = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks", {credentials : "include"});
      const taskData = await data.json();
      dispatch(setTasks(taskData.body));

      data = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata", {credentials : "include"});
      const projectData = await data.json();
      dispatch(setProjects(projectData.body));
    }
    if(tasks.length == 0 || projects.length == 0){
      fetchdata();
    }else{
      setTasks(tasks);
      setProjects(projects);
    }

  }, [dispatch, refresh]);

  return (
    <div className="p-6 md:mt-0 mt-20 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, User 👋</h1>
        <Link to="/add-project">
        <button className="bg-indigo-600  text-white px-5 py-2 !rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
          + Add Project
        </button>
        </Link>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Orders" value={120} color="bg-blue-500" />
        <Card title="Total Value" value={500000} color="bg-green-500" isCurrency />
        <Card title="Payment Received" value={320000} color="bg-purple-500" isCurrency />
        <Card title="Payment Due" value={180000} color="bg-red-500" isCurrency />
      </div>

      {/* Deadlines & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Project Deadlines */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📅 Project Deadlines</h2>
          <div className="space-y-4">
            {projects != undefined && projects.map((project, index) => (
              <DeadlineCard project={project[0]} date={project[5]} key={index} />
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
          <Link to="/tasks" className="!no-underline">
            <h1 className="text-xl font-semibold text-gray-800 no-underline">📝 Tasks</h1>
          </Link>

            <button
              onClick={() => setTaskDialogOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 !rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              + Add Task
            </button>
          </div>

          {/* Scrollable Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto h-96 pr-2">
              {tasks.map((task, index) => (
                            <TaskCard
                            key={index}
                            task={task[0]}
                            description={task[1]}
                            date={task[2]}
                            time={task[3]}
                            assignee={task[4]}
                            priority={task[5]}
                            status={task[6]}
                          />
              ))}
          </div>
        </div>
      </div>

      {/* Inquiry Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📩 Inquiries</h2>

        {/* Scrollable Horizontal List */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          <InquiryCard
            project="E-commerce Website"
            comments="Client wants a Shopify integration."
            inquiryDate="Feb 15, 2025"
            followUpDate="Feb 28, 2025"
          />
          <InquiryCard
            project="Mobile App for Gym"
            comments="Needs a booking system & payment gateway."
            inquiryDate="Feb 20, 2025"
            followUpDate="March 5, 2025"
          />
          <InquiryCard
            project="Real Estate CRM"
            comments="Looking for a cloud-based solution."
            inquiryDate="Feb 25, 2025"
            followUpDate="March 10, 2025"
          />
           <InquiryCard
            project="Real Estate CRM"
            comments="Looking for a cloud-based solution."
            inquiryDate="Feb 25, 2025"
            followUpDate="March 10, 2025"
          />
        </div>
      </div>

      {/* Task Dialog Modal */}
      {isTaskDialogOpen && <TaskDialog onClose={() => {setTaskDialogOpen(false); if(refresh){setRefresh(false);}else{setRefresh(true)}}} />}
    </div>
  );
};

export default Dashboard;
