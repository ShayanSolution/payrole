import { Button } from "@material-ui/core";
import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

import { PayrollPrint } from "./PayrollPrint";

const GeneratePayroll = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [payrollData, setPayrollData] = useState(props.payrollData);
  useEffect(() => {
    setPayrollData(props.payrollData);
  }, [props.payrollData, payrollData]);

  return (
    <div className="ms-3 ms-sm-0 mt-3 mt-sm-0">
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handlePrint}
      >
        Generate Payslip
      </Button>
      <div className="row" style={{ display: "none" }}>
        <PayrollPrint ref={componentRef} payrollData={payrollData} />
      </div>
    </div>
  );
};

export default GeneratePayroll;
