import React from 'react'

const CustomerDashboard = ({ customerDashboardData, setCustomerDashboardData, setCustomerDashboard }) => {
  return (
    <div className='flex flex-col gap-3 w-full p-6'>

        <div className='flex flex-row w-full justify-between items-center'>
            <div className='flex flex-col gap-1'>
                <p className='text-[1.6vw] font-semibold'>{customerDashboardData[0]}</p>
                <p className='text-[0.8vw]'>Dashboard  •  Customers  •  {customerDashboardData[0]}</p>
            </div>
            <button style={{ "borderRadius" : "6px" }} className='text-white px-2 py-1 bg-sky-600 hover:bg-sky-700' onClick={() => setCustomerDashboard(false)}>Cancel</button>
        </div>
        <div className='flex flex-row w-full justify-between gap-3'>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-gray-600'>Active Orders</p>
                <p className='text-[1.1vw]'>{}</p>
            </div>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-gray-600'>Payment Received</p>
                <p className='text-[1.1vw]'>{}</p>
            </div>
            <div className='flex flex-col border rounded-xl p-3 w-1/3'>
                <p className='text-[1.2vw] text-gray-600'>Payment Due</p>
                <p className='text-[1.1vw]'>{}</p>
            </div>
        </div>
        <div className='flex flex-col w-full border rounded-xl p-3'>
            <table>
                <tr className='text-gray-600'>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Received</th>
                    <th>Due</th>
                    <th>Date</th>
                    <th>Quote</th>
                </tr>
            </table>
        </div>
        <div className='flex flex-col w-2/3 border rounded-xl p-3 gap-3'>
            <p className='text-[1.3vw] font-semibold'>Customer Details</p>
            <div className='flex flex-row w-full justify-between gap-2'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-3'>
                        <p className='text-[0.9vw] text-gray-600'>Customer</p><p className='text-red-600'>*</p>
                    </div>
                    <input type="text" className='border rounded-lg px-2 py-2 w-full' value={customerDashboardData[0]}/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-2'>
                        <p className='text-[0.9vw] text-gray-600'>Email</p>
                    </div>
                    <input type="text" className='border rounded-lg px-2 py-2 w-full' value={customerDashboardData[2]}/>
                </div>
            </div>
            <div className='flex flex-row w-full justify-between gap-2'>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-3'>
                        <p className='text-[0.9vw] text-gray-600'>Phone Number</p>
                    </div>
                    <input type="text" className='border rounded-lg px-2 py-2 w-full' value={customerDashboardData[1]}/>
                </div>
                <div className='flex flex-col w-1/2'>
                    <div className='flex flex-row gap-1 -mb-2'>
                        <p className='text-[0.9vw] text-gray-600'>Alternate Phone Number</p>
                    </div>
                    <input type="text" className='border rounded-lg px-2 py-2 w-full' value={customerDashboardData[4]}/>
                </div>
            </div>
            <div className='flex flex-col w-full'>
                <p className='text-[0.9vw] text-gray-600'>Address</p>
                <input type="text" className='border rounded-lg px-2 py-2' value={customerDashboardData[3]}/>
            </div>
        </div>
    </div>
  )
}

export default CustomerDashboard;