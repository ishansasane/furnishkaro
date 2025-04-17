import React from 'react';
import { setTaskDialogOpen } from '../Redux/dataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OverviewPage = ({ projectData, status, setStatus, tasks }) => {
  const dueAmount = projectData.totalAmount + projectData.totalTax - projectData.paid;
  const dispatch = useDispatch();
  const taskDialogOpen = useSelector(( state : RootState) => state.data.taskDialogOpen);
  const navigate = useNavigate();

  const addNewTask = () => {
    dispatch(setTaskDialogOpen(true));
    console.log(taskDialogOpen);
    navigate("/tasks");
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between items-center'>
        <p className='text-[1.4vw] font-semibold'>Project Name : {projectData.projectName}</p>
        <p className='text-[1.1vw]'>Delivery Date : <input className='rounded-lg border px-2 py-2' type="date" value={projectData.projectDate} /></p>
      </div>

      <div className='flex flex-row justify-between gap-3 h-[25vw]'>
        {/* Client Info */}
        <div className='flex flex-col border rounded-lg p-3 w-1/3 justify-between'>
          <p className='text-[1.2vw]'>Client Information</p>
          {["Name", "Phone", "Alternate Phone", "Email", "Address"].map((label, idx) => (
            <div key={label} className='flex flex-row justify-between'>
              <p className='text-[1.1vw] text-gray-500'>{label}</p>
              <p className='text-[1.1vw]'>{projectData.customerLink[idx]}</p>
            </div>
          ))}
          <div className='flex flex-row justify-between'>
            <p className='text-[1.1vw] text-gray-500'>Additional Requests</p>
            <p className='text-[1.1vw]'>{projectData.additionalRequests}</p>
          </div>
        </div>

        {/* Status */}
        <div className='flex flex-col w-1/3 p-3 border rounded-lg'>
          <p className='text-[1.2vw]'>Current Status</p>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[1vw] text-gray-500 mt-1'>Delivery & Installation</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-4 py-2 rounded-md">
              <option value="Unsent">Unsent</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Payments */}
        <div className='flex flex-col w-1/3 p-3 rounded-lg border justify-between'>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.2vw]'>Payments</p>
            <div className='flex flex-row gap-2'>
              <button className='text-white text-[1vw] bg-sky-600 rounded-lg px-3 h-8'>Add</button>
              <button className='text-white text-[1vw] bg-sky-600 rounded-lg px-3 h-8'>View</button>
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.1vw]'>Total Payment</p>
            <p className='text-[1.1vw]'>{projectData.totalAmount + projectData.totalTax}</p>
          </div>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.1vw]'>Payment Received</p>
            <p className='text-[1.1vw]'>{projectData.paid}</p>
          </div>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.1vw]'>Due</p>
            <p className='text-[1.1vw]'>{dueAmount}</p>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className='flex flex-row w-full gap-3 justify-between mt-3 h-[25vw]'>
        {/* Tailor Info */}
        <div className='flex flex-col justify-between w-1/3 border rounded-lg p-3'>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.2vw]'>Tailor Information</p>
            <button className='text-white rounded-lg bg-sky-600 px-2 h-8'>Assign</button>
          </div>
        </div>

        {/* Interior & Sales */}
        <div className='flex flex-col justify-between w-1/3 gap-2 ml-2'>
          {[{
            title: "Interior Information",
            data: projectData.interiorArray
          }, {
            title: "Sales Associate Information",
            data: projectData.salesAssociateArray
          }].map((section, idx) => (
            <div key={idx} className='flex flex-col p-3 border rounded-lg h-[12.5vw]'>
              <p className='text-[1.2vw]'>{section.title}</p>
              <div className='flex flex-row justify-between'>
                <p className='text-[1.1vw]'>{section.data[0]}</p>
                <p className='text-[1.1vw]'>{section.data[2]}</p>
                <button className='text-white bg-sky-600 px-2 h-8'>View</button>
              </div>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className='flex flex-col p-3 border rounded-lg w-1/3 h-[25vw]'>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.2vw]'>Tasks</p>
            <button onClick={addNewTask} style={{ borderRadius : "8px" }} className='text-white bg-sky-600 px-2 h-8'>Create Task</button>
          </div>
          <div className='flex flex-col justify-between gap-2 overflow-y-scroll'>
            {tasks.filter(task => task[5] === projectData.projectName).map((task, index) => (
              <div key={index} className="border rounded-lg p-2 flex flex-col">
                <div className='flex flex-row justify-between'>
                  <p className={`text-white text-[1.1vw] border rounded-lg px-2 py-1 ${
                    task[6] === "High" ? "bg-red-500" :
                    task[6] === "Low" ? "bg-green-500" :
                    task[6] === "Moderate" ? "bg-yellow-500" : ""
                  }`}>{task[6]}</p>
                  <p className={`text-white text-[1.1vw] border rounded-lg px-2 py-1 ${
                    task[7] === "To Do" ? "bg-red-500" :
                    task[7] === "Completed" ? "bg-green-500" :
                    task[7] === "In Progress" ? "bg-yellow-500" : ""
                  }`}>{task[7]}</p>
                </div>
                <p className='text-[1.2vw] font-semibold'>{task[0]}</p>
                <p className='text-[1.1vw]'>Created At : {task[3]}</p>
                <p className='text-[1.1vw]'>Description : {task[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
