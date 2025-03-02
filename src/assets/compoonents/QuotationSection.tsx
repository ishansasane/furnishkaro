const QuotationSection = ({  }: any) => {
    return (
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Quotation</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>MRP</th>
              <th>Sale Rate</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Tax (%)</th>
              <th>Tax Amount</th>
              <th>Total</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  };
  
  export default QuotationSection;
  