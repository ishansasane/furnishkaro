import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { setTermsData } from '../Redux/dataSlice';

const TermsAndConditions = () => {

    const [terms, setTerms] = useState(null);
    const [termsDialog, setTermsDialog] = useState(false);

    const dispatch = useDispatch();

    const termsData = useSelector(( state : RootState ) => state.data.termsData);

    const fetchTermsData = async () => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getTermsData");
        const data = await response.json();
        return data.body || [];
    }

    const sendTermDetails = async () => {

        let date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();

        const newdate = day + "/"+month+"/"+year;

        let url = null;

        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/sendTermsData", {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ terms, date : newdate })
        });

        if(response.status == 200){
            alert("New Terms & Conditions Added");
            try {
                const updatedBankData = await fetchTermsData();
                localStorage.setItem("termData", JSON.stringify({ data: updatedBankData, time: Date.now() }));
                dispatch(setTermsData(updatedBankData));
            } catch (error) {
                console.error("Failed to add terms data after add:", error);
            }
            setTerms(null);
            setTermsDialog(false);

        }else{
            alert("Error in adding terms details");
        }
    }

    const deleteTermsData = async (terms) => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteTermsData", {
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({ terms })
        });

        if(response.ok){
        try {
            const updatedBankData = await fetchTermsData();
            localStorage.setItem("termData", JSON.stringify({ data: updatedBankData, time: Date.now() }));
            dispatch(setTermsData(updatedBankData));
        } catch (error) {
            console.error("Failed to delete Terms Data", error);
        }
            alert("Terms & Conditions Deleted");
        }else{
            alert("Error in deleting terms data");
        }
    }

useEffect(() => {
  const fetchAndCacheTermData = async () => {
    const now = Date.now();
    const cacheKey = "termData";
    let bankList = [];

    try {
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
          bankList = parsed.data;
          dispatch(setTermsData(bankList));
          return;
        }
      }

      const data = await fetchTermsData();
      bankList = data;
      dispatch(setTermsData(bankList));
      localStorage.setItem(cacheKey, JSON.stringify({ data: bankList, time: now }));
    } catch (error) {
      console.error("Failed to fetch terms data:", error);
    }
  };

  fetchAndCacheTermData();
}, [dispatch]);


  return (
    <div className='flex flex-col gap-3 justify-center w-full p-6'>
        <div className={` ${termsDialog ? "hidden" : ""} flex flex-row justify-between`}>
            <p className='text-[2vw] font-semibold'>Terms & Conditions Details</p>
            <button style={{ borderRadius : "6px" }} onClick={() => setTermsDialog(true)} className='px-2 h-9 bg-sky-600 hover:bg-sky-700 text-white'>Add new details</button>
        </div>
        <div className={` ${termsDialog ? "hidden" : ""} flex flex-col border rounded-xl p-2`}>
            <table className=''>
                <thead className=''>
                    <th>Sr.No</th>
                    <th>Terms & Conditions</th>
                    <th>Options</th>
                </thead>
                <tbody>
                {termsData.length !== 0 &&
                    termsData.map((data, index) => {
                    return (
                        <tr key={index} className='hover:bg-sky-50'>
                        <td className='text-[1.1vw]'>{index + 1}</td>
                        <td className='text-[1.1vw] py-2'>{data[0]}</td>
                        <td className='flex flex-row gap-2 py-2'>
                            <button onClick={() => deleteTermsData(data[0])}>delete</button>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>

            </table>
        </div>
        {
            termsDialog && <div className='flex flex-col rounded-xl p-3 gap-3 w-[35vw] justify-center border border-black'>
                <p className='text-[1.3vw]'>{"Add Terms & Conditions Details"}</p>
                <div className='flex flex-col gap-2'>
                    <textarea placeholder='Terms & Conditions' value={terms} onChange={(e) => setTerms(e.target.value)} className='px-2 py-2 rounded-lg border'/>
                </div>
                <button style={{ borderRadius : "6px" }} onClick={sendTermDetails} className='text-white px-2 h-9 bg-sky-600 hover:bg-sky-700'>{"Save"}</button>
                <button style={{ borderRadius : "6px" }} onClick={() => {setTerms(null); setTermsDialog(false);}} className='text-white px-2 h-9 bg-sky-600 hover:bg-sky-700'>Cancel</button>
            </div>
        }
    </div>
  )
}

export default TermsAndConditions;
