import React, { useEffect, useState } from 'react';
import { setTaskDialogOpen } from '../Redux/dataSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TaskDialog from '../compoonents/TaskDialog';
import { setProjectFlag } from '../Redux/dataSlice';

const OverviewPage = ({ addPayment, setAddPayment, interiorArray, salesAssociateArray, setNavState, projectData, status, setStatus, tasks, tailorsArray, setTailorsArray, goodsArray, setGoodsArray, projectDate, setPRojectDate, projects }) => {
  const dueAmount = projectData.totalAmount + projectData.totalTax - projectData.paid;
  const dispatch = useDispatch();
  const taskDialogOpen = useSelector(( state : RootState) => state.data.taskDialogOpen);

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [editing, setediting] = useState(null);

  const addNewTask = () => {
    dispatch(setTaskDialogOpen(true));
    console.log(taskDialogOpen);
    navigate("/tasks");
  }



  const [pending, setPending] = useState(0);
  const [ordered, setOrdered] = useState(0);
  const [received, setReceived] = useState(0);
  const [instock, setInStock] = useState(0);

  const [tailorpending, setTailorPending] = useState(0);
  const [tailorordered, setTailorOrdered] = useState(0);
  const [tailorreceived, setTailorReceived] = useState(0);

  useEffect(() => {
    // Reset counts first
    let pendingCount = 0;
    let orderedCount = 0;
    let receivedCount = 0;
    let instockCount = 0;
  
    let tailorPendingCount = 0;
    let tailorOrderedCount = 0;
    let tailorReceivedCount = 0;
    console.log(goodsArray);
  
    // Count statuses in goodsArray
    goodsArray.forEach(item => {
      switch (item.status) {
        case "Pending":
          pendingCount++;
          break;
        case "Ordered":
          orderedCount++;
          break;
        case "Received":
          receivedCount++;
          break;
        case "In Stock":
          instockCount++;
          break;
        default:
          break;
      }
    });
  
    // Count statuses in tailorsArray
    tailorsArray.forEach(tailor => {
      switch (tailor.status) {
        case "Pending":
          tailorPendingCount++;
          break;
        case "Ordered":
          tailorOrderedCount++;
          break;
        case "Received":
          tailorReceivedCount++;
          break;
        default:
          break;
      }
    });
  
    // Update state
    setPending(pendingCount);
    setOrdered(orderedCount);
    setReceived(receivedCount);
    setInStock(instockCount);
  
    setTailorPending(tailorPendingCount);
    setTailorOrdered(tailorOrderedCount);
    setTailorReceived(tailorReceivedCount);
  }, [goodsArray, tailorsArray]);
  

  return (
    <div className={`flex flex-col`}>
      <div className='flex flex-row justify-between items-center'>
        <p className='text-[1.4vw] font-semibold'>Project Name : {projectData.projectName}</p>
        <p className='text-[1.1vw]'>Delivery Date : <input className='rounded-lg border px-2 py-2' type="date" value={projectDate} onChange={(e) => setPRojectDate(e.target.value)}/></p>
      </div>

      <div className={`flex flex-row justify-between gap-3 h-[25vw]`}>
        {/* Client Info */}
        <div className='flex flex-col border rounded-lg p-3 w-[25vw] justify-between'>
          <p className='text-[1.2vw]'>Client Information</p>
            <div className='flex flex-row justify-between'>
              <p className='text-[1.1vw] text-gray-500'>Name</p>
              <p className='text-[1.1vw] overflow-y-auto'>{projectData.customerLink[0]}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='text-[1.1vw] text-gray-500'>Phone</p>
              <p className='text-[1.1vw] overflow-y-auto'>{projectData.customerLink[1]}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='text-[1.1vw] text-gray-500'>Alternate Phone</p>
              <p className='text-[1.1vw] overflow-y-auto'>{projectData.customerLink[4]}</p>
            </div>
            <div className='flex flex-row justify-between gap-3'>
              <p className='text-[1.1vw] text-gray-500'>Email</p>
              <p className='text-[1.1vw] flex-wrap gap-3 w-full'>{projectData.customerLink[2]}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <p className='text-[1.1vw] text-gray-500'>Address</p>
              <p className='text-[1.1vw]  gap-3 flex-wrap'>{projectData.customerLink[3]}</p>
            </div>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.1vw] text-gray-500'>Additional Requests</p>
            <p className='text-[1.1vw]'>{projectData.additionalRequests}</p>
          </div>
        </div>

        {/* Status */}
        <div className='flex flex-col w-1/3 p-3 border rounded-lg overflow-y-scroll'>
          <p className='text-[1.2vw]'>Current Status</p>
          <div className='flex flex-row justify-between -mt-3'>
            <p className='text-[1vw] text-gray-500 mt-2'>Delivery & Installation</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-4 py-2 rounded-md">
              <option value="Unsent">Unsent</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <p className='text-[0.9vw] font-semibold'>Order Confirmed</p>
          <div className='flex flex-col gap-1 w-full'>
            <p className='text-[0.9vw] font-semibold'>Goods Ordered</p>
            <div className='flex flex-row w-full justify-between'>
            <div className='flex flex-row w-full flex-wrap gap-1'>
              <p className='text-[0.8vw] rounded-xl text-yellow-500 font-semibold bg-yellow-100 py-1 px-2'>Pending-{pending}</p>
              <p className='text-[0.8vw] rounded-xl text-sky-600 font-semibold bg-sky-100 py-1 px-2'>Ordered-{ordered}</p>
              <p className='text-[0.8vw] rounded-xl text-green-600 font-semibold bg-green-100 py-1 px-2'>Received-{received}</p>
              <p className='text-[0.8vw] rounded-xl text-green-600 font-semibold bg-green-100 py-1 px-2'>In Stock-{instock}</p>
            </div>
            <button style={{ borderRadius : "6px" }} onClick={() => setNavState("Goods")} className='text-sky-600 border-1 font-semibold h-8 px-2 border-sky-600 bg-white'>View</button>
          </div>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <p className='text-[0.9vw] font-semibold'>Goods Sent to Tailor</p>
            <div className='flex flex-row w-full justify-between'>
            <div className='flex flex-row w-full flex-wrap gap-1'>
              <p className='text-[0.8vw] rounded-xl text-yellow-500 font-semibold bg-yellow-100 py-1 px-2'>Pending-{tailorpending}</p>
              <p className='text-[0.8vw] rounded-xl text-sky-600 font-semibold bg-sky-100 py-1 px-2'>Ordered-{tailorordered}</p>
              <p className='text-[0.8vw] rounded-xl text-green-600 font-semibold bg-green-100 py-1 px-2'>Received-{tailorreceived}</p>
            </div>
            <button style={{ borderRadius : "6px" }} onClick={() => setNavState("Tailors")} className='text-sky-600 border-1 font-semibold h-8 px-2 border-sky-600 bg-white'>View</button>
          </div>
          </div>
        </div>

        {/* Payments */}
        <div className='flex flex-col w-1/3 p-3 rounded-lg border justify-between'>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.2vw]'>Payments</p>
            <div className='flex flex-row gap-2'>
              <button onClick={() => setAddPayment(true)} style={{ borderRadius : "6px" }} className='text-white text-[1vw] hover:bg-sky-700 bg-sky-600 rounded-lg px-3 h-8'>Add</button>
              <button onClick={() => navigate("/paymentsPage")} style={{ borderRadius : "6px" }} className='text-white text-[1vw] hover:bg-sky-700 bg-sky-600 rounded-lg px-3 h-8'>View</button>
            </div>
          </div>
          <div className='flex flex-row justify-between border rounded-lg p-2'>
            <div className='w-1 bg-gray-500  border border-gray-800'></div>
            <p className='text-[1.1vw]'>Total Payment</p>
            <p className='text-[1.1vw]'>{(projectData.totalAmount + projectData.totalTax).toFixed(2)}</p>
          </div>
          <div className='flex flex-row justify-between border rounded-lg p-2'>
            <div className='w-1 bg-green-500  border border-green-500'></div>
            <p className='text-[1.1vw]'>Payment Received</p>
            <p className='text-[1.1vw]'>{projectData.paid}</p>
          </div>
          <div className='flex flex-row justify-between border rounded-lg p-2'>
            <div className='w-1 bg-yellow-500  border border-yellow-500'></div>
            <p className='text-[1.1vw]'>Due</p>
            <p className='text-[1.1vw]'>{(dueAmount).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className='flex flex-row w-full gap-3 justify-between mt-3 h-[25vw]'>
        {/* Tailor Info */}
        <div className='flex flex-col w-1/3 border rounded-lg p-3'>
          <div className='flex flex-row justify-between'>
            <p className='text-[1.2vw]'>Tailor Information</p>
            <button onClick={() => setNavState("Tailors")} className='text-white rounded-lg bg-sky-600 px-2 h-8'>Assign</button>
          </div>
          <div className='flex flex-col justify-between gap-2'>
            
              {
                tailorsArray && tailorsArray.map((tailor, index) => (
                  <div className='flex flex-row w-full justify-between' key={index}>
                  <div className='flex flex-col border rounded-lg p-2 w-full'>
                    <p className='text-[1.1vw] text-sky-600 font-semibold'>{tailor.tailorData[0]}</p>
                    <p className='text-[1.1vw]'>{tailor.tailorData[1]}</p>
                  </div>
                  </div>
                ))
              }
            
          </div>
        </div>

        {/* Interior & Sales */}
        <div className='flex flex-col justify-between w-1/3 gap-2 ml-2'>
          {[{
            title: "Interior Information",
            data: interiorArray
          }, {
            title: "Sales Associate Information",
            data: salesAssociateArray
          }].map((section, idx) => (
            <div key={idx} className='flex flex-col p-3 border rounded-lg h-[12.5vw]'>
              <div className='flex flex-row justify-between'>
                <p className='text-[1.2vw]'>{section.title}</p>
                <button onClick={() => setNavState("Customer & Project Details")} style={{ borderRadius : "8px" }} className='text-white bg-sky-600 px-2 h-8'>View</button>
              </div>
              <div className='flex flex-row justify-between mt-2'>
                <p className='text-[1.1vw]'>{section.data[0]}</p>
                <p className='text-[1.1vw]'>{section.data[2]}</p>
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
            {tasks !== undefined && tasks.filter(task => task[5] === projectData.projectName).map((task, index) => (
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
                <button onClick={() => { setediting(task); setDialogOpen(true); }} style={{ borderRadius : "6px" }} className='border px-2 py-1 w-20 text-white bg-sky-600 hover:bg-sky-700'>Edit Task</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {dialogOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setTaskDialogOpen(false))}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TaskDialog
                onClose={() => setDialogOpen(false)}
                isEditing={editing}
                setediting={setediting}
                name={"NA"}
                setrefresh={setRefresh}
                projectData={projects}
                setTaskDialogOpen={setTaskDialogOpen}
                taskDialogOpen={dialogOpen}
                setProjectFlag={setProjectFlag}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OverviewPage;
