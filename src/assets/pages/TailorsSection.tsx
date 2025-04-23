import React from "react";

interface TailorsSectionProps {
  selections: any[];
  setNavState: (nav: string) => void;
}

const TailorsSection: React.FC<TailorsSectionProps> = ({ selections, setNavState, statusArray }) => {
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
          {selections.flatMap((selection, mainIndex) =>
            selection.areacollection?.flatMap((area, areaIndex) =>
              area.items
                ?.map((item, itemIndex) => {
                  if (Array.isArray(item) && item[2] === "Tailoring") {
                    return (
                      <tr
                        key={`${mainIndex}-${areaIndex}-${itemIndex}`}
                        className="text-center"
                      >
                        <td className="">{itemIndex + 1}</td>
                        <td className="">{item[0]}</td>
                        <td className="">{area.reference || "-"}</td>
                        <td className="">{selection.area || "-"}</td>
                        <td className="">{area.measurement?.width}</td>
                        <td className="">{area.measurement?.height}</td>
                        <td className="">{area.measurement?.quantity}</td>
                        <td className="">{"Rate"}</td>
                        <td className="">{"Tailor"}</td>
                        <td className="">                        <select
                          className="border px-2 py-1 rounded mr-2"
                          value={""}
                        
                        >
                          <option value="">Pending</option>
                          {statusArray.map((data, index) => (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          ))}

                        </select></td>
                        <td className="py-3">{"Remark"}</td>
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
