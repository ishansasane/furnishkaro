import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Edit } from "lucide-react";

// 🔧 SAME CLEANING LOGIC as your ProtectedRoute
const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
};

const cleanRoute = (route: string) => {
  try {
    const decoded = route.replace(/\\/g, "");
    return normalizePath(decoded);
  } catch {
    return route;
  }
};

interface PaymentsSectionProps {
  addPayment: boolean;
  setAddPayment: (val: boolean) => void;
  Amount: number;
  Tax: number;
  Received: number;
  Discount: number;
  paymentData: any[];
  deletePayment: (
    amount: string,
    date: string,
    mode: string,
    remarks: string
  ) => void;
  setNavState: (nav: string) => void;
  setEditPayments: (val: any) => void;
  setPaymentDate: (val: string) => void;
  setPaymentMode: (val: string) => void;
  setPayment: (val: string) => void;
  setPaymentRemarks: (val: string) => void;
  projectData: any;
  discountType: string;
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
  projectData,
  discountType,
}) => {
  const [canDeleteOrEdit, setCanDeleteOrEdit] = useState(false);

  // ✅ Check if "/delete-payments" permission exists
  useEffect(() => {
    try {
      const raw = localStorage.getItem("allowed_routes");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(cleanRoute);
          setCanDeleteOrEdit(cleaned.includes("/delete-payments"));
        }
      }
    } catch (err) {
      console.error("❌ Failed to check /delete-payments permission:", err);
    }
  }, []);

  const editPaymentData = (data: any[]) => {
    setPayment(data[2]);
    setPaymentDate(data[3]);
    setPaymentMode(data[4]);
    setPaymentRemarks(data[5]);
    setEditPayments(data);
    setAddPayment(true);
  };

  return (
    <div
      className={`${
        addPayment ? "hidden" : ""
      } flex flex-col gap-3 mt-3 w-full`}
    >
      <p className="text-[1.3vw] font-semibold">Payments</p>

      <div className="flex flex-row w-full justify-between gap-3">
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Total Amount</p>
          <p className="text-[1.3vw]">{Amount.toFixed(2)}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Payment Received</p>
          <p className="text-[1.3vw]">{Received}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Payment Due</p>
          <p className="text-[1.3vw]">{(Amount - Received).toFixed(2)}</p>
        </div>
        <div className="border rounded-lg w-1/4 p-3">
          <p className="text-[1.3vw] text-gray-500">Discount</p>
          <p className="text-[1.3vw]">{Discount + ` in ${discountType}`}</p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between mt-2">
          <p className="text-[1.2vw] font-semibold">Received Payments</p>
          <button
            onClick={() => setAddPayment(true)}
            style={{ borderRadius: "8px" }}
            className="shadow-xl hover:bg-sky-700 bg-sky-600 text-white px-2 h-8"
          >
            Add Payment
          </button>
        </div>

        <table className="w-full border border-gray-300 mt-2">
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
              ?.filter((data) => data[1] === projectData.projectName)
              .map((data, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{data[2]}</td>
                  <td className="p-2">{data[3]}</td>
                  <td className="p-2">{data[4]}</td>
                  <td className="p-2">{data[5]}</td>
                  <td className="p-2">
                    <div className="flex flex-row gap-2 items-center">
                      {canDeleteOrEdit && (
                        <>
                          <button onClick={() => editPaymentData(data)}>
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              deletePayment(data[1], data[2], data[3], data[4])
                            }
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-between mt-4">
        <button
          onClick={() => setNavState("Tailors")}
          className="rounded-lg border px-2 h-8 bg-white"
        >
          Back
        </button>
        <button
          onClick={() => setNavState("Tasks")}
          className="rounded-lg text-white border px-2 h-8 bg-sky-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentsSection;
