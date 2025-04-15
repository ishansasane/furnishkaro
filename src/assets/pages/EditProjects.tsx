import React, { useState } from 'react'

const EditProjects = ({ projectData, index, goBack }) => {
    const [status, setStatus] = useState("Unsent");
    console.log(projectData);

    return (
      <div className='p-6'>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between items-center'>
            <p className='text-[1.4vw] font-semibold'>Order Overview</p>
            <button onClick={goBack} className="mb-4 px-3 py-1 text-white bg-red-500 rounded">← Back</button>
          </div>
          <div className='flex flex-row w-[65vw] justify-between'>
            <p className='text-[1vw]'>Overview</p>
            <p className='text-[1vw]'>Customer & Project Details</p>
            <p className='text-[1vw]'>Material Selection</p>
            <p className='text-[1vw]'>Measurement</p>
            <p className='text-[1vw]'>Quotation</p>
            <p className='text-[1vw]'>Goods</p>
            <p className='text-[1vw]'>Tailors</p>
            <p className='text-[1vw]'>Payments</p>
            <p className='text-[1vw]'>Tasks</p>
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-row justify-between items-center'>
                <p className='text-[1.4vw] font-semibold'>Project Name : {projectData.projectName}</p>
                <p className='text-[1.1vw]'>Delivery Date : <input className='rounded-lg border px-2 py-2' type="date" value={projectData.projectDate}/></p>
            </div>
            <div className='flex flex-row justify-between gap-3'>
                <div className='flex flex-col border rounded-lg p-3 w-1/3'>
                    <p className='text-[1.2vw]'>Client Information</p>
                    <div className='flex flex-row justify-between'>
                        <p className='text-[1.1vw] text-gray-500'>Name</p>
                        <p className='text-[1.1vw]'>{projectData.customerLink[0]}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <p className='text-[1.1vw] text-gray-500'>Phone</p>
                        <p className='text-[1.1vw]'>{projectData.customerLink[1]}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <p className='text-[1.1vw] text-gray-500'>Alternate Phone</p>
                        <p className='text-[1.1vw]'>{projectData.customerLink[4]}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='text-[1.1vw] text-gray-500'>Email</p>
                        <p className='text-[1.1vw]'>{projectData.customerLink[2]}</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <p className='text-[1.1vw] text-gray-500'>Address</p>
                        <p className='text-[1.1vw]'>{projectData.customerLink[3]}</p>
                    </div>
                </div>
                <div className='flex flex-col w-1/3 p-3 border rounded-lg'>
                    <p className='text-[1.2vw]'>Current Status</p>
                    <div className=' flex flex-row justify-between items-center'>
                        <p className='text-[1vw] text-gray-500 mt-1'>Delivery & Installation</p>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border px-4 py-2 rounded-md"
                        >
                            <option value="Unsent">Unsent</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-col w-1/3 p-3 rounded-lg border justify-between'>
                    <div className='flex flex-row justify-between'>
                        <p className='text-[1.2vw]'>Payments</p>
                        <div className='flex flex-row gap-2'>
                            <button style={{borderRadius : "8px"}} className='text-white text-[1vw] bg-sky-600 rounded-lg px-3 h-8'>Add</button>
                            <button style={{borderRadius : "8px"}} className='text-white text-[1vw] bg-sky-600 rounded-lg px-3 h-8'>View</button>
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
                        <p className='text-[1.1vw]'>{projectData.totalAmount + projectData.totalTax - projectData.paid}</p>
                    </div>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  };
  

export default EditProjects