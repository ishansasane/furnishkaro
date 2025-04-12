import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

interface MeasurementSectionProps {
  selections: any[];
  units: string[];
  handleRemoveArea: (index: number) => void;
  handleReferenceChange: (mainIndex: number, index: number, value: string) => void;
  handleunitchange: (mainIndex: number, index: number, value: string) => void;
  handlewidthchange: (mainIndex: number, index: number, value: string) => void;
  handleheightchange: (mainIndex: number, index: number, value: string) => void;
  handlequantitychange: (mainIndex: number, index: number, value: string) => void;
}

const MeasurementSection: React.FC<MeasurementSectionProps> = ({
  selections,
  units,
  handleRemoveArea,
  handleReferenceChange,
  handleunitchange,
  handlewidthchange,
  handleheightchange,
  handlequantitychange
}) => {
  return (
    <div className="rounded-lg border shadow-2xl w-full flex flex-col p-6">
      <p className="text-[1.2vw]">Measurements</p>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col border rounded-lg w-[15vw]">
          <p className="text-[1.1vw] pl-5 pt-2">Area</p>
          {selections.map((selection, index) => (
            <div key={index} className="flex items-center pl-5">
              <p className="text-[1.1vw]">{selection.area}</p>
              <button className={`${selection.area == "" ? "hidden" : ""} mb-3 text-red-500 hover:text-red-700`} onClick={() => handleRemoveArea(index)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="w-[85vw] flex flex-col border rounded-lg">
          <div className="flex p-2 gap-3">
            <p className="text-[1.1vw] mt-2">Default Unit</p>
            <div className="flex items-center gap-2 mb-4">
              <select
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                value=""
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col p-3">
            {selections.map((selection, mainindex) => (
              <div key={mainindex} className="">
                <p className="text-[1.2vw]">{selection.area}</p>
                {selection.areacollection.map((collection, index) => (
                  <div key={index} className="flex p-3 justify-between border rounded-lg">
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Product Group</p>
                        <input type="text" className="w-[10vw] rounded-lg border px-2 py-2" value={collection.productGroup[0]} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Reference</p>
                        <input
                          type="text"
                          onChange={(e) => handleReferenceChange(mainindex, index, e.target.value)}
                          className="rounded-lg border px-2 py-2 w-[10vw]"
                          value={collection.reference}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Measurement</p>
                        <div className="flex items-center gap-2 mb-4">
                          <select
                            onChange={(e) => handleunitchange(mainindex, index, e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                            value={collection.measurement.unit == undefined ? "" : collection.measurement.unit}
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Width</p>
                        <input
                          onChange={(e) => handlewidthchange(mainindex, index, e.target.value)}
                          type="text"
                          className="rounded-lg border px-2 py-2 w-[6vw]"
                          value={collection.measurement.width}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Height</p>
                        <input
                          onChange={(e) => handleheightchange(mainindex, index, e.target.value)}
                          type="text"
                          className="rounded-lg border px-2 py-2 w-[6vw]"
                          value={collection.measurement.height}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[1.1vw]">Quantity</p>
                        <input
                          type="text"
                          onChange={(e) => handlequantitychange(mainindex, index, e.target.value)}
                          className="rounded-lg border px-2 py-2 w-[6vw]"
                          value={collection.measurement.quantity}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[1.1vw]">Actions</p>
                      <div className="flex flex-row gap-2">
                        <FaTrash className="text-red-500" />
                        <FaPlus className="text-blue-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementSection;
