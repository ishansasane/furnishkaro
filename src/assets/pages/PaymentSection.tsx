import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Edit } from 'lucide-react';

interface PaymentsSectionProps {
  addPayment: boolean;
  setAddPayment: (val: boolean) => void;
  Amount: number;
  Tax: number;
  Received: number;
  Discount: number;
  paymentData: any[];
  deletePayment: (amount: string, date: string, mode: string, remarks: string) => void;
  setNavState: (nav: string) => void;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  addPayment,
  setAddPayment,
  Amount,
  Tax,
  Received,
  Discount,
  paymentData,
  deletePayment,
  setNavState,
  setEditPayments,
  setPaymentDate,
  setPaymentMode,
  setPayment,
  setPaymentRemarks,
  projectData
}) => {

  const editPaymentData = (data) => {
    setPayment(data[1]);
    setPaymentDate(data[2]);
    setPaymentMode(data[3]);
    setPaymentRemarks(data[4]);
    setEditPayments(data); 
    setAddPayment(true);
  }

  return (
    <div className={`${addPayment ? "hidden" : ""} flex flex-col gap-3 mt-3 w-full`}>
      <p className="text-[1.3vw] font-semibold">Payments</p>
      <div className="flex flex-row w-full justify-between gap-3">
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Total Amount</p>
          <p className="text-[1.3vw]">{(Amount + Tax).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Payment Received</p>
          <p className="text-[1.3vw]">{Received}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Payment Due</p>
          <p className="text-[1.3vw]">{(Amount + Tax - Received - Discount).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Discount</p>
          <p className="text-[1.3vw]">{Discount}</p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <p className="text-[1.2vw] font-semibold">Received Payments</p>
          <button
            onClick={() => setAddPayment(true)}
            style={{ borderRadius: "8px" }}
            className="shadow-xl hover:bg-sky-700 bg-sky-600 text-white px-2 h-8"
          >
            Add Payment
          </button>
        </div>

        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Amount Received</th>
              <th className="text-left p-2">Received Date</th>
              <th className="text-left p-2">Payment Mode</th>
              <th className="text-left p-2">Remarks</th>
              <th className="text-left p-2">Options</th>
            </tr>
          </thead>
          <tbody>
          {paymentData
            ?.filter(data => data[0] === projectData.projectName)
            .map((data, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{data[1]}</td>
                <td className="p-2">{data[2]}</td>
                <td className="p-2">{data[3]}</td>
                <td className="p-2">{data[4]}</td>
                <td className="flex flex-row gap-2 items-center mt-2">
                  <button><Edit size={18} onClick={() => editPaymentData(data)}/></button>
                  <button onClick={() => deletePayment(data[1], data[2], data[3], data[4])}>
                    <FaTrash className="text-red-500" />
                  </button>
                </td>
              </tr>
          ))}

          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-between">
        <button
          onClick={() => setNavState("Tailors")}
          style={{ borderRadius: "8px" }}
          className="rounded-lg border px-2 h-8 bg-white"
        >
          Back
        </button>
        <button
          onClick={() => setNavState("Tasks")}
          style={{ borderRadius: "8px" }}
          className="rounded-lg text-white border px-2 h-8 bg-sky-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentsSection;
