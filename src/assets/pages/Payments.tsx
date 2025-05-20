import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { setPaymentData } from '../Redux/dataSlice'

const Payments = () => {

    const fetchPaymentData = async () => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"); 
        const data = await response.json();
        return data.message;
    }

    const dispatch = useDispatch();

    const [editPayments, setEditPayments] = useState(undefined);

    const paymentsData = useSelector((state : RootState) => state.data.paymentData);
    const [payment, setPayment] = useState(0);
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentRemarks, setPaymentRemarks] = useState("");

    const [addPayment , setAddPayment] = useState(false);

    const [customer, setCustomer] = useState("");
    const [project, setProject] = useState("");

    const [deleted, setDeleted] = useState(true);

    useEffect(() => {
    let isMounted = true;

    const fetchPaymentInfo = async () => {
        try {
        const cached = localStorage.getItem("paymentData");
        const now = Date.now();

        if (cached) {
            const parsed = JSON.parse(cached);
            const timeDiff = now - parsed.time;

            // If cache is fresh (within 5 mins), use it
            if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
            if (isMounted) {
                dispatch(setPaymentData(parsed.data));
            }
            return;
            }
        }

        // Fetch fresh data
        const paymentData = await fetchPaymentData();

        if (paymentData && isMounted) {
            dispatch(setPaymentData(paymentData));
            localStorage.setItem("paymentData", JSON.stringify({ data: paymentData, time: now }));
        }
        } catch (error) {
        console.error("❌ Error fetching payment data:", error);
        }
    };

    fetchPaymentInfo();

    return () => {
        isMounted = false; // prevent state updates if unmounted
    };
    }, [dispatch, deleted]);

const deletePayment = async (name, projectname, p, pd, pm, re) => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletePayment", {
    credentials : "include",
    method : "POST",
    headers : {
        
      "content-type" : "application/json",
    },
    body : JSON.stringify({ customerName : name, Name : projectname, Received : p, ReceivedDate : pd, PaymentMode : pm, Remarks : re })
  });

  if(response.status == 200){
    alert("Deleted");
    if(deleted){
        setDeleted(false);
    }else{
        setDeleted(true);
    }
  }else{
    alert("Error");
  }
}

const addPaymentFunction = async () => {
  const isEdit = typeof editPayments !== "undefined";

  const url = isEdit
    ? "https://sheeladecor.netlify.app/.netlify/functions/server/updateProjects"
    : "https://sheeladecor.netlify.app/.netlify/functions/server/addPayment";

  const payload = isEdit
    ? {
        customerName: customer,
        Name: project,
        Received: payment,
        ReceivedDate: paymentDate,
        PaymentMode: paymentMode,
        Remarks: paymentRemarks, // send this if backend needs it
      }
    : {
        customerName: customer,
        Name: project,
        Received: payment,
        ReceivedDate: paymentDate,
        PaymentMode: paymentMode,
        Remarks: paymentRemarks,
      };

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      alert(isEdit ? "Payment updated" : "Payment added");
      setAddPayment(false);
      setPayment(0);
      setPaymentDate("");
      setPaymentMode("");
      setPaymentRemarks("");
      if(deleted){
        setDeleted(false);
      }else{
        setDeleted(true);
      }
    } else {
      alert("Error");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Network or server error");
  }
  setEditPayments(undefined);
};

  const setCancelPayment = () => {
    if(editPayments){
      setPayment(0);
      setPaymentDate("");
      setPaymentMode("");
      setPaymentRemarks("NA");
      setAddPayment(false);
    }else{
      setAddPayment(false);
    }
  }

  return (
    <div className='w-full p-6 flex flex-col justify-between items-center'>
        <div className="w-full justify-between flex flex-row">
            <p className='text-[2vw] font-semibold'>Payments</p>
        </div>
<div className='w-full justify-between flex flex-col rounded-xl border p-3 mt-10 max-h-screen overflow-scroll'>
    <table className='w-full'>
        <tbody>
            <tr className='text-[1.2vw] font-semibold'>
                <th className=''>Sr. No.</th>
                <th>Amount</th>
                <th>Project</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </tbody>
        <tbody>
            {paymentsData && paymentsData.map((payment, index) => (
                <tr className='hover:bg-sky-50' key={index}>
                    <td>{index + 1}</td>
                    <td>{payment[2]}</td>
                    <td>{payment[1]}</td>
                    <td>{payment[4]}</td>
                    <td>{payment[3] || '-'}</td> {/* Optional Date */}
                    <td className='py-3 flex flex-row gap-3'>
                        {/* Example action: Delete button */}
                        <button onClick={() => deletePayment(payment[0], payment[1], payment[2], payment[3], payment[4], payment[5])} className="text-red-500 hover:underline"><FaTrash /></button>
                        <button onClick={() => { setProject(payment[1]); setCustomer(payment[0]); setAddPayment(true); }} className="text-sky-700 hover:underline"><FaEdit /></button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
                  { 
            addPayment && <div className="flex flex-col z-50 justify-between gap-3 w-[50vw] border rounded-xl p-3">
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Amount Received</p><p className="text-red-500">*</p></div>
                <input type="text" value={payment} className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPayment(e.target.value == "" ? 0 : parseFloat(e.target.value))}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Payment Date</p><p className="text-red-500">*</p></div>
                <input type="date" value={paymentDate} className="border-1 rounded-lg pl-2 h-8 pr-2" onChange={(e) => setPaymentDate(e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Payment Mode</p><p className="text-red-500">*</p></div>
                <input type="text" value={paymentMode}  className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPaymentMode(e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-1"><p className="text-[1.1vw]">Remarks</p><p className="text-red-500">*</p></div>
                <input type="text" value={paymentRemarks} className="border-1 rounded-lg pl-2 h-8" onChange={(e) => setPaymentRemarks(e.target.value)}/>
              </div>
              <div className="flex flex-row justify-end gap-3">
                <button onClick={() => {if(editPayments != undefined){ setEditPayments(undefined); } setCancelPayment()}} style={{ borderRadius : "8px" }} className="border-2 border-sky-700 text-sky-600 bg-white px-2 h-8">Close</button>
                <button onClick={() => addPaymentFunction()} style={{ borderRadius : "8px" }} className={`${editPayments == undefined ? "" : "hidden"} text-white bg-sky-600 hover:bg-sky-700 px-2 h-8`}>Add Payment</button>
                <button onClick={() => addPaymentFunction()} style={{ borderRadius : "8px" }} className={`${editPayments != undefined ? "" : "hidden"} text-white bg-sky-600 hover:bg-sky-700 px-2 h-8`}>Edit Payment</button>
              </div>
            </div>
          }
    </div>
  )
}

export default Payments
