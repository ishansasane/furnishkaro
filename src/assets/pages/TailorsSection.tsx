import React from "react";

interface TailorsSectionProps {
  selections: any[];
  setNavState: (nav: string) => void;
}

const TailorsSection: React.FC<TailorsSectionProps> = ({ selections, setNavState }) => {
  return (
    <div className="flex flex-col w-full justify-between gap-3 mt-3">
      <p className="text-[1.3vw] font-semibold">Tailors</p>

      <table className="w-full">
        <thead>
          <tr className="w-full flex flex-row justify-between font-semibold border-b pb-1">
            <td className="w-[10%]">Sr.No.</td>
            <td className="w-[10%]">Product</td>
            <td className="w-[10%]">Reference</td>
            <td className="w-[10%]">Room</td>
            <td className="w-[10%]">Width</td>
            <td className="w-[10%]">Height</td>
            <td className="w-[10%]">Parts/Sq.Ft</td>
            <td className="w-[10%]">Rate</td>
            <td className="w-[10%]">Tailor</td>
            <td className="w-[10%]">Status</td>
            <td className="w-[10%]">Remark</td>
          </tr>
        </thead>
        <tbody>
          {selections.flatMap((selection, mainIndex) =>
            selection.areacollection?.flatMap((area, areaIndex) =>
              area.items
                ?.map((item, itemIndex) => {
                  if (Array.isArray(item) && item[2] === "Tailoring") {
                    return (
                      <tr
                        key={`${mainIndex}-${areaIndex}-${itemIndex}`}
                        className="w-full flex flex-row justify-between border-b py-1"
                      >
                        <td className="w-[10%]">{itemIndex + 1}</td>
                        <td className="w-[10%]">{item[0]}</td>
                        <td className="w-[10%]">{area.reference || "-"}</td>
                        <td className="w-[10%]">{selection.area || "-"}</td>
                        <td className="w-[10%]">{area.measurement?.width}</td>
                        <td className="w-[10%]">{area.measurement?.height}</td>
                        <td className="w-[10%]">{area.measurement?.quantity}</td>
                        <td className="w-[10%]">{"Rate"}</td>
                        <td className="w-[10%]">{"Tailor"}</td>
                        <td className="w-[10%]">{"Status"}</td>
                        <td className="w-[10%]">{"Remark"}</td>
                      </tr>
                    );
                  }
                  return null;
                })
                .filter(Boolean)
            )
          )}
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
