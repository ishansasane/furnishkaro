/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const QuotationTable = ({
  selections,
  items,
  quantities,
  handleQuantityChange,
  additionalItems,
  handleAddMiscItem,
  handleItemNameChange,
  handleItemQuantityChange,
  handleItemRateChange,
  handleItemTaxChange,
  handleItemRemarkChange,
  handleDeleteMiscItem,
  projectData,
  setAdditionalItems
}) => {
  useEffect(() => {
    const cloned = JSON.parse(JSON.stringify(projectData.additionalItems));
    setAdditionalItems(cloned);
  }, [projectData]);

  return (
    <div className="flex flex-col p-6 border rounded-lg w-full shadow-2xl">
      <p className="text-[1.3vw] font-semibold">Quotation</p>

      <div className="flex flex-col gap-3 w-full">
        {selections.map((selection, mainindex) => (
          <div key={mainindex} className="w-full">
            <p className="text-[1.1vw] font-semibold mb-2">{selection.area}</p>
            <table className="w-full border-collapse mb-6 text-[0.95vw]">
              <thead>
                <tr className="flex justify-between w-full bg-gray-100 p-2 border-b font-semibold">
                  <td className="w-[10%]">Sr. No.</td>
                  <td className="w-[45%]">Product Name</td>
                  <td className="w-[45%]">Size</td>
                  <td className="w-[20%]">MRP</td>
                  <td className="w-[20%]">Quantity</td>
                  <td className="w-[20%]">Subtotal</td>
                  <td className="w-[20%]">Tax Rate (%)</td>
                  <td className="w-[20%]">Tax Amount</td>
                  <td className="w-[20%]">Total</td>
                </tr>
              </thead>
              <tbody>
                {selection.areacollection && selection.areacollection.length > 0 ? (
                  selection.areacollection.map((collection, collectionIndex) => {
                    const pg = collection.productGroup;
                    if (!Array.isArray(pg) || pg.length < 2) return null;

                    const relevantPG = pg.length > 2 ? pg.slice(1, -2) : [];
                    const matchedItems = relevantPG.map((pgItem) => {
                      const matched = items.find((item) => item[0] === pgItem);
                      return matched || pgItem;
                    });

                    const validMatchedItems = matchedItems.filter((el) => Array.isArray(el));

                    return validMatchedItems.map((item, itemIndex) => {
                      const key = `${mainindex}-${collectionIndex}-${itemIndex}`;
                      const qty = selection.areacollection[collectionIndex]?.quantities?.[itemIndex] || 0;
                      return (
                        <tr key={key} className="flex justify-between w-full border-b p-2">
                          <td className="w-[10%]">{itemIndex + 1}</td>
                          <td className="w-[45%]">
                            {item[0] + " * " + collection.measurement.quantity}
                          </td>
                          <td className="w-[45%]">
                            {collection.measurement.width + "*" + collection.measurement.height + " " + collection.measurement.unit}
                          </td>
                          <td className="w-[20%]">{item[4] * collection.measurement.quantity}</td>
                          <td className="w-[20%]">
                            <div className="flex flex-col">
                              <input
                                type="text"
                                value={selection.areacollection[collectionIndex]?.quantities?.[itemIndex]}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    key,
                                    e.target.value,
                                    mainindex,
                                    collectionIndex,
                                    collection.measurement.quantity,
                                    item[4],
                                    item[5],
                                    itemIndex
                                  )
                                }
                                className="border w-[40%] px-2 py-1 rounded"
                              />
                              <p className=" text-[0.8vw] text-gray-600">{item[3]}</p>
                            </div>
                          </td>
                          <td className="w-[20%]">{item[4] * collection.measurement.quantity * qty}</td>
                          <td className="w-[20%]">{item[5]}</td>
                          <td className="w-[20%]">{collection.totalTax[itemIndex]}</td>
                          <td className="w-[20%]">{collection.totalAmount[itemIndex]}</td>
                        </tr>
                      );
                    });
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-2 text-gray-500">
                      No product data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Miscellaneous Section */}
      <div className="border p-6 rounded-lg w-full flex flex-col">
        <p className="text-[1.1vw] font-semibold">Miscellaneous</p>
        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between items-center mt-4">
            <button
              className="flex flex-row gap-2 rounded-xl bg-sky-50 hover:bg-sky-100 items-center px-2 py-1"
              onClick={handleAddMiscItem}
            >
              <FaPlus className="text-sky-500 mt-1" />
              Add Item
            </button>
          </div>

          <table className="mt-3 w-full">
            <thead>
              <tr className="ml-3 flex text-[1.1vw] w-full justify-between">
                <td className="w-[3vw]">SR</td>
                <td className="w-[6vw]">Item Name</td>
                <td className="w-[6vw]">Quantity</td>
                <td className="w-[6vw]">Rate</td>
                <td className="w-[6vw]">Net Rate</td>
                <td className="w-[6vw]">Tax (%)</td>
                <td className="w-[6vw]">Tax Amount</td>
                <td className="w-[6vw]">Total Amount</td>
                <td className="w-[6vw]">Remark</td>
                <td className="w-[6vw]">Actions</td>
              </tr>
            </thead>

            <tbody className="flex flex-col w-full">
              {additionalItems.map((item, i) => (
                <tr key={i} className="w-full flex flex-row justify-between mt-2">
                  <td className="text-center w-[3vw]">{i + 1}</td>
                  <td>
                    <input
                      onChange={(e) => handleItemNameChange(i, e.target.value)}
                      className="pl-2 w-[6vw] border rounded-lg"
                      value={item[0] || ""}
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      onChange={(e) => handleItemQuantityChange(i, e.target.value)}
                      className="pl-2 w-[6vw] border rounded-lg"
                      value={item[1] || ""}
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      onChange={(e) => handleItemRateChange(i, e.target.value)}
                      className="pl-2 w-[6vw] border rounded-lg"
                      value={item[2] || ""}
                      type="text"
                    />
                  </td>
                  <td className="w-[6vw] text-center">{item[3]}</td>
                  <td>
                    <input
                      onChange={(e) => handleItemTaxChange(i, e.target.value)}
                      className="pl-2 w-[6vw] border rounded-lg"
                      value={item[4] || ""}
                      type="text"
                    />
                  </td>
                  <td className="w-[6vw] text-center">{item[5] || 0}</td>
                  <td className="w-[6vw] text-center">{item[6] || 0}</td>
                  <td>
                    <input
                      onChange={(e) => handleItemRemarkChange(i, e.target.value)}
                      className="pl-2 w-[6vw] border rounded-lg"
                      value={item[7] || ""}
                      type="text"
                    />
                  </td>
                  <td className="w-[6vw] text-center">
                    <button onClick={() => handleDeleteMiscItem(i)}>
                      <FaTrash className="text-red-500 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotationTable;
