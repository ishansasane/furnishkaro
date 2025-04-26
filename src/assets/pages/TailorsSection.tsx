import React, { useEffect } from "react";

interface TailorsSectionProps {
  selections: any[];
  setNavState: (nav: string) => void;
}

const TailorsSection: React.FC<TailorsSectionProps> = ({ updateTailorRate, updateTailorRemark, updateTailorStatus, updateTailorData, tailors, selections, setNavState, statusArray, tailorsArray, setTailorsArray }) => {

  return (
    <div className="flex flex-col w-full justify-between gap-3 mt-3">
      <p className="text-[1.3vw] font-semibold">Tailors</p>

      <table className="w-full">
        <thead>
          <tr className="text-center">
            <td className="">Sr.No.</td>
            <td className="">Product</td>
            <td className="">Reference</td>
            <td className="">Room</td>
            <td className="">Width</td>
            <td className="">Height</td>
            <td className="">Parts/Sq.Ft</td>
            <td className="">Rate</td>
            <td className="">Tailor</td>
            <td className="">Status</td>
            <td className="">Remark</td>
          </tr>
        </thead>
        <tbody>
  {tailorsArray.map((tailor, index) => {
    if (!tailor.item || tailor.item[2] !== "Tailoring") return null;

    const selection = selections[tailor.mainindex];
    const area = selection?.areacollection[tailor.groupIndex];

    return (
      <tr key={index} className="text-center">
        <td>{index + 1}</td>
        <td>{tailor.item[0]}</td>
        <td>{area?.reference || "-"}</td>
        <td>{selection?.area || "-"}</td>
        <td>{area?.measurement?.width}</td>
        <td>{area?.measurement?.height}</td>
        <td>{area?.measurement?.quantity}</td>
        <td>
          <input
            type="text"
            className="border rounded-lg pl-2 h-8 w-[6vw]"
            value={tailor.rate}
            onChange={(e) => updateTailorRate(index, e.target.value)}
          />
        </td>
        <td>
          <select
            className="border px-2 py-1 rounded mr-2"
            value={tailor.tailorData}
            onChange={(e) => updateTailorData(index, e.target.value)}
          >
            <option value="">Choose Tailor</option>
            {tailors.map((data, i) => (
              <option key={i} value={data}>
                {data[0]}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            className="border px-2 py-1 rounded mr-2"
            value={tailor.status}
            onChange={(e) => updateTailorStatus(index, e.target.value)}
          >
            <option value="">Pending</option>
            {statusArray.map((data, i) => (
              <option key={i} value={data}>
                {data}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3">
          <input
            className="border rounded-lg pl-2 h-8 w-[8vw]"
            type="text"
            value={tailor.remark}
            onChange={(e) => updateTailorRemark(index, e.target.value)}
          />
        </td>
      </tr>
    );
  })}
</tbody>

      </table>

      <div className="flex flex-row justify-between mt-4">
        <button
          onClick={() => setNavState("Goods")}
          className="rounded-lg border px-4 py-2 bg-white"
        >
          Back
        </button>
        <button
          onClick={() => setNavState("Payments")}
          className="rounded-lg text-white border px-4 py-2 bg-sky-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TailorsSection;
