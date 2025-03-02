import { useState } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard";
import TaskCard from "../compoonents/TaskCard";
import InquiryCard from "../compoonents/InquiryCard";
import TaskDialog from "../compoonents/TaskDialog";
import { Link } from "react-router-dom";


const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, User 👋</h1>
        <Link to="/add-project">
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
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
            <DeadlineCard project="Website Redesign" date="March 10, 2025" />
            <DeadlineCard project="Mobile App Development" date="April 5, 2025" />
            <DeadlineCard project="Backend API" date="May 20, 2025" />
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📝 Tasks</h2>
            <button
              onClick={() => setTaskDialogOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              + Add Task
            </button>
          </div>

          {/* Scrollable Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto h-96 pr-2">
            <TaskCard
              task="Fix Login Bug"
              description="Users unable to log in after password reset."
              date="Feb 25, 2025"
              time="10:30 AM"
              assignee="John Doe"
              priority="High"
              status="Pending"
            />
            <TaskCard
              task="Design Landing Page"
              description="Create a responsive landing page."
              date="March 2, 2025"
              time="2:00 PM"
              assignee="Jane Smith"
              priority="Moderate"
              status="In Progress"
            />
            <TaskCard
              task="API Optimization"
              description="Improve API response time by 30%."
              date="March 5, 2025"
              time="3:00 PM"
              assignee="Alex Brown"
              priority="High"
              status="Pending"
            />
            <TaskCard
              task="Database Cleanup"
              description="Remove redundant data from DB."
              date="March 8, 2025"
              time="11:00 AM"
              assignee="Chris Evans"
              priority="Low"
              status="Completed"
            />
            <TaskCard
              task="Update Documentation"
              description="Add latest API changes."
              date="March 10, 2025"
              time="4:00 PM"
              assignee="Emma Watson"
              priority="Moderate"
              status="Pending"
            />
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
      {isTaskDialogOpen && <TaskDialog onClose={() => setTaskDialogOpen(false)} />}
    </div>
  );
};

export default Dashboard;
