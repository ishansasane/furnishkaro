import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { setBankData } from '../Redux/dataSlice';

const BankDetails = () => {

    const [bankDialog, setBankDialog] = useState(false);
    const [editBankData, setEditBankData] = useState(null);

    const [customerName, setCustomerName] = useState(null);
    const [accountNumber, setAccountNumber] = useState(null);
    const [ifscCode, setIfscCode] = useState(null);

    const dispatch = useDispatch();

    const bankData = useSelector(( state : RootState ) => state.data.bankData);
    const [refresh, setRefresh] = useState(false);
    

    const fetchBankData = async () => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getBankData");
        const data = await response.json();
        return data.body || [];
    }

    const sendBankDetails = async () => {

        let date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();

        const newdate = day + "/"+month+"/"+year;

        let url = null;
        if(editBankData){
            url = "https://sheeladecor.netlify.app/.netlify/functions/server/updateBankData"
        }else{
            url = "https://sheeladecor.netlify.app/.netlify/functions/server/sendBankData"
        }

        const response = await fetch(url, {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ customerName, accountNumber, ifscCode, date : newdate })
        });

        if(response.status == 200){
            if(editBankData){
                alert("Bank Details Editted");
            }else{
                alert("New Bank Details Added");
            }
            try {
                const updatedBankData = await fetchBankData();
                localStorage.setItem("bankData", JSON.stringify({ data: updatedBankData, time: Date.now() }));
                dispatch(setBankData(updatedBankData));
            } catch (error) {
                console.error("Failed to update bank data after add/edit:", error);
            }
            setEditBankData(null);
            setCustomerName(null);
            setAccountNumber(null);
            setIfscCode(null);
            setBankDialog(false);

        }else{
            alert("Error in adding bank details");
        }
    }

    const deleteBankData = async (customerName) => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteBankData", {
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({ customerName })
        });

        if(response.ok){
        try {
            const updatedBankData = await fetchBankData();
            localStorage.setItem("bankData", JSON.stringify({ data: updatedBankData, time: Date.now() }));
            dispatch(setBankData(updatedBankData));
        } catch (error) {
            console.error("Failed to update bank data after add/edit:", error);
        }
            alert("Bank Data Deleted");
        }else{
            alert("Error in deleting bank data");
        }
    }

useEffect(() => {
  const fetchAndCacheBankData = async () => {
    const now = Date.now();
    const cacheKey = "bankData";
    let bankList = [];

    try {
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
          bankList = parsed.data;
          dispatch(setBankData(bankList));
          return;
        }
      }

      const data = await fetchBankData();
      bankList = data;
      dispatch(setBankData(bankList));
      localStorage.setItem(cacheKey, JSON.stringify({ data: bankList, time: now }));
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
    }
  };

  fetchAndCacheBankData();
}, [dispatch]);


  return (
    <div className='flex flex-col gap-3 justify-center w-full p-6'>
        <div className={` ${bankDialog ? "hidden" : ""} flex flex-row justify-between`}>
            <p className='text-[2vw] font-semibold'>Bank Details</p>
            <button style={{ borderRadius : "6px" }} onClick={() => setBankDialog(true)} className='px-2 h-9 bg-sky-600 hover:bg-sky-700 text-white'>Add new details</button>
        </div>
        <div className={` ${bankDialog ? "hidden" : ""} flex flex-col border rounded-xl p-2`}>
            <table className=''>
                <thead className=''>
                    <th>Sr.No</th>
                    <th>Customer Name</th>
                    <th>Account Number</th>
                    <th>IFSC Code</th>
                    <th>Created Date</th>
                    <th>Options</th>
                </thead>
                <tbody>
                {bankData.length !== 0 &&
                    bankData.map((data, index) => {
                    return (
                        <tr key={index} className='hover:bg-sky-50'>
                        <td className='text-[1.1vw]'>{index + 1}</td>
                        <td className='text-[1.1vw]'>{data[0]}</td>
                        <td className='text-[1.1vw]'>{data[1]}</td>
                        <td className='text-[1.1vw]'>{data[2]}</td>
                        <td className='text-[1.1vw] py-2'>{data[3]}</td>
                        <td className='flex flex-row gap-2 py-2'>
                            <button onClick={() => {setEditBankData(true); setCustomerName(data[0]); setAccountNumber(data[1]); setIfscCode(data[2]); setBankDialog(true);}}>edit</button>
                            <button onClick={() => deleteBankData(data[0])}>delete</button>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>

            </table>
        </div>
        {
            bankDialog && <div className='flex flex-col rounded-xl p-3 gap-3 w-[35vw] justify-center border border-black'>
                <p className='text-[1.3vw]'>{editBankData ? "Edit Bank Details" : "Add Bank Details"}</p>
                <div className='flex flex-col gap-2'>
                    <input type="text" placeholder='Customer Name' value={customerName} onChange={(e) => setCustomerName(e.target.value)} className='px-2 rounded-lg border h-8'/>
                    <input type="text" placeholder='Account Number' value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className='px-2 rounded-lg border h-8'/>
                    <input type="text" placeholder='IFSC Code' value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className='px-2 rounded-lg border h-8'/>
                </div>
                <button style={{ borderRadius : "6px" }} onClick={sendBankDetails} className='text-white px-2 h-9 bg-sky-600 hover:bg-sky-700'>{editBankData ? "Edit" : "Save"}</button>
                <button style={{ borderRadius : "6px" }} onClick={() => {setEditBankData(false); setCustomerName(null); setAccountNumber(null); setIfscCode(null); setBankDialog(false);}} className='text-white px-2 h-9 bg-sky-600 hover:bg-sky-700'>Cancel</button>
            </div>
        }
    </div>
  )
}

export default BankDetails
