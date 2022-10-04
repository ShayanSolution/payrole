import React from "react";
import { numbersToWords, currencyFormat, getMonthName } from "@utils/utils";
import moment from "moment";
import ObjectRender from "../ObjectRender";
import LeaveModule from "./LeaveModule";

export class PayrollPrint extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col-11" style={PayrollWrapper}>
        {this.props.payrollData.map(function (payroll) {
          let finalValue = payroll.tax
            ? payroll.final_salary - payroll.tax + payroll.bonus
            : payroll.final_salary + payroll.bonus;

          payroll.getLateArrivals = () =>
            payroll.late_arrivals - payroll.exemptions;
          return (
            <React.Fragment key={payroll._id}>
              <br />
              <br />
              <br />
              <h5 style={PayrollHeader}>
                {`Shayan Solutions Payslip for ${getMonthName(
                  new Date(payroll.salary_date).getMonth()
                )} ${new Date(payroll.salary_date).getFullYear()}`}
              </h5>
              <br />
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Emp. Name: </b>
                      {payroll.employee_name}
                    </h5>
                  </div>
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Total Hours: </b>
                      {payroll.employee.contract === "Hourly"
                        ? payroll.total_salary / payroll.employee.salary
                        : payroll.no_of_hours[0]}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Designation: </b>
                      {payroll.job_title}
                    </h5>
                  </div>
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Mode of payment: </b>
                      {payroll.employee?.account_No?.length
                        ? "Bank Transfer"
                        : "Cash"}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Contract: </b>
                      {payroll.employee.contract}
                    </h5>
                  </div>
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Late Arrivals: </b>
                      {payroll.getLateArrivals()}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Joining date: </b>
                      {moment(payroll.employee?.joining_date).format(
                        "DD MMMM YYYY"
                      )}
                    </h5>
                  </div>
                  <div className="col-6">
                    <h5 style={fieldsLabel}>
                      <b>Exemptions: </b>
                      {payroll.exemptions}
                    </h5>
                  </div>
                </div>
              </div>
              <br />
              <br />

              <ObjectRender payroll={payroll} />
              <br />
              <br />
              <br />

              <div className="container">
                <div className="row">
                  <div className="col-6" style={finalSalary}>
                    {payroll.deduction_note && (
                      <h5 className="p-1" style={fieldsLabel}>
                        <b>Deduction : </b>
                        {payroll.deduction_note}
                      </h5>
                    )}
                  </div>
                  <div className="col-6"></div>
                </div>
                <div className="row">
                  <div className="col-6" style={finalSalary}>
                    <div className="col-10">
                      <h6>Leaves Summary</h6>
                      <LeaveModule payroll={payroll} />
                    </div>
                  </div>
                  <div className="col-6">
                    <h5 style={notesLabel}>
                      {payroll.notes?.trim() === "" ? (
                        <></>
                      ) : (
                        <>
                          <b>Note: </b>
                          {payroll?.notes?.length &&
                            payroll.notes
                              .trim()
                              ?.split("\n")
                              .map((item, key) => (
                                <span style={Notes} key={key}>
                                  &nbsp; {item}
                                  <br />
                                  &emsp;&emsp;&ensp; &nbsp;
                                </span>
                              ))}
                        </>
                      )}
                    </h5>
                  </div>
                </div>
                <br />

                <br />
                <div className="row">
                  <div className="col-6">
                    <h5 className="p-1" style={fieldsLabel}>
                      <b>Net Pay: </b>
                      {currencyFormat(finalValue)}
                    </h5>
                    <h5 className="mt-4" style={slipFooter}>
                      CEO Signature: _____________________
                    </h5>
                  </div>
                  <div className="col-6">
                    <h5 className="p-1" style={salaryInWords}>
                      <b>In Words: </b>
                      <span style={Notes}>
                        Rupees {numbersToWords(finalValue)} only
                      </span>
                    </h5>
                    <h5 className="mt-2" style={slipFooter}>
                      Employee Signature: _____________________
                    </h5>
                  </div>
                </div>
                <br />
                <br />
                <br />

                <div
                  className="row"
                  style={{
                    minHeight: "85px",
                  }}
                >
                  <div className="col"></div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

const PayrollWrapper = {
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "0px 25px 0px 25px",
  marginLeft: "75px",
};

const PayrollHeader = {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",
};

const fieldsLabel = {
  fontWeight: 500,
  fontSize: "14px",
  textAlign: "left",
};

const finalSalary = {
  display: "flex",
  fontSize: "14px",
};

const salaryInWords = {
  textTransform: "capitalize",
  fontWeight: 500,
  fontSize: "14px",
  textAlign: "left",
};

const slipFooter = {
  fontWeight: "bold",
  fontSize: "14px",
  textAlign: "left",
};

const notesLabel = {
  fontWeight: 500,
  fontSize: "14px",
  textAlign: "left",
  // minHeight: "75px",
};

const Notes = {
  fontWeight: 500,
  fontSize: "12px",
};
