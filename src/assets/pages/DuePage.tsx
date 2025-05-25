import React from 'react'
import { useNavigate } from 'react-router-dom'

const DuePage = () => {

    const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-between items-center w-90vw'>
        <div className='flex flex-col w-[80vw] p-3 border rounded-xl'>
            <div className='flex flex-row w-full justify-between'>
                <p className='text-[1.6vw] font-semibold'>Due Payments</p>
                <button onClick={() => navigate("/")} style={{ borderRadius : "6px" }} className='border px-2 h-10 text-white bg-sky-600 hover:bg-sky-700'>Dashboard</button>
            </div>
            <div className='flex flex-col'>
                
            </div>
        </div>
    </div>
  )
}

export default DuePage
