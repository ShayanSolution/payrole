// import { Button } from "@material-ui/core";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";

import { PayrollPrint } from "./PayrollPrint";

const SinglePrintPayroll = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <PrintIcon
        type="submit"
        variant="contained"
        color="action"
        onClick={handlePrint}
      >
        Print
      </PrintIcon>
      {props.payrollData[0] !== undefined && (
        <div className="row" style={{ display: "none" }}>
          <PayrollPrint ref={componentRef} payrollData={props.payrollData} />
        </div>
      )}
    </div>
  );
};

export default SinglePrintPayroll;
