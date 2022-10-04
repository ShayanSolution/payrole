import React from "react";
import { connect } from "react-redux";
import {
  fetchPayrolls,
  deletePayroll,
  updatePayroll,
  fetchAttendance,
} from "../../Redux/actions";
import MUIDataTable from "mui-datatables";
import { Button, CircularProgress } from "@material-ui/core";
import GeneratePayroll from "./PrintAble/GeneratePayroll";
import { currencyFormat, getMonthName, matchIdInArray } from "@utils/utils";
import SinglePrintPayroll from "./PrintAble/SinglePrintPayroll";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import EmailConfirmation from "@components/Modal/Email/EmailConfirmation";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import DeletePayroll from "@components/Modal/Payroll/DeletePayroll";
import AddTax from "@components/Modal/Payroll/AddTax";
import { calculateTime } from "@utils/utils";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
class Payroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          name: "employee_id",
          label: "Employee ID",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "employee_name",
          label: "Employee Name",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "formatted_total_salary",
          label: "Total Salary (PKR)",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "formatted_deductions",
          label: "Deductions (PKR)",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "created_at",
          label: "Created At",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "formatted_late_arrivals",
          label: "Late Arrivals",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "formatted_final_salary",
          label: "Final Salary (PKR)",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "salary_date",
          label: "Salary Date",
          options: {
            filter: true,
            sort: true,
            display: true,
          },
        },
        {
          name: "_id",
          label: "Payroll Id",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "status",
          label: "Actions",
          options: {
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                  <Stack direction="row" spacing={1}>
                    <Item>
                      {" "}
                      <SinglePrintPayroll
                        payrollData={[
                          matchIdInArray(this.state.data, tableMeta.rowData[8]),
                        ]}
                      />
                    </Item>
                    <Item>
                      <MailIcon
                        color="action"
                        cursor="pointer"
                        onClick={() =>
                          this.sendEmail(
                            tableMeta.rowData[0],
                            tableMeta.rowData[7]
                          )
                        }
                      >
                        Email
                      </MailIcon>
                    </Item>
                    <Item>
                      <DeleteIcon
                        color="action"
                        cursor="pointer"
                        onClick={() => this.deleteModal(tableMeta.rowData[0])}
                      >
                        Delete
                      </DeleteIcon>
                    </Item>
                    {process.env.REACT_APP_MANUAL_TAX_DEDUCTION !== "FALSE" && (
                      <Item>
                        <AccountBalanceIcon
                          color="action"
                          cursor="pointer"
                          onClick={() => this.taxModal(tableMeta.rowData[8])}
                        >
                          Add Tax
                        </AccountBalanceIcon>
                      </Item>
                    )}
                  </Stack>
                </>
              );
            },
          },
        },
      ],
      isLoading: true,
      emailModal: false,
      closeModal: false,
      taxModal: false,
      payrollData: {},
      employeeEmail: "",
      data: [],
      month: `${new Date().getFullYear()}-${(
        "0" +
        (Number(new Date().getMonth()) + 1)
      ).slice(-2)}`,
    };
  }

  createProcessedPayload = (payload) => {
    const processedPayload = payload.map((data) => {
      const singleEmployeeAttendance = this.props.attendance
        .filter((item) => item.employee_id === data.employee_id._id)
        .map((item) => item.sum_over_time);
      const sumOfTime = calculateTime(singleEmployeeAttendance);
      let positiveSum = Math.abs(
        data.adjustments?.reduce(
          (pre, curr) => (curr.value < 0 ? pre + curr.value : pre),
          0
        )
      );
      return {
        ...data,
        employee_id: data.employee_id._id,
        employee: data.employee_id,
        formatted_deductions:
          data.tax > 0
            ? currencyFormat(data.deductions + data.tax + positiveSum)
            : currencyFormat(data.deductions + positiveSum),
        formatted_final_salary: currencyFormat(data.final_salary - data.tax),
        formatted_total_salary: currencyFormat(
          data.total_salary +
            data.employee_id.medical_allowance +
            data.adjustments?.reduce(
              (pre, curr) => (curr.value > 0 ? pre + curr.value : pre),
              0
            )
        ),
        salary_date:
          getMonthName(new Date(data.salary_date).getMonth()) +
          " " +
          new Date(data.salary_date).getFullYear(),
        no_of_hours: sumOfTime,
      };
    });
    return processedPayload;
  };

  componentDidMount = async () => {
    await this.props.fetchPayrolls(this.state.month);

    if (!this.props.attendance.length) {
      await this.props.fetchAttendance(this.state.month);
    }
    const processedPayload = this.createProcessedPayload(this.props.payrolls);

    this.setState({
      isLoading: false,
      data: processedPayload,
    });
  };

  handlePayload = () => {
    const payloads = JSON.parse(localStorage.getItem("payrolls")).payload;
    let processedPayload = [];
    if (payloads.length) {
      processedPayload = this.createProcessedPayload(payloads);
    } else processedPayload = [];

    processedPayload = processedPayload.filter((employee) => {
      if (!employee.isSoftDeleted) {
        return employee;
      }
    });
    this.setState({
      data: processedPayload,
    });
  };

  deleteModal = (employeeId) => {
    this.openCloseDeleteModal2();
    const foundEmployee = this.state.data.find(
      (payroll) => payroll.employee_id === employeeId
    );
    this.setState({
      employeeData: foundEmployee,
    });
  };

  taxModal = (payrollId) => {
    this.openCloseTaxModal();
    const { payrolls } = this.props;
    const foundPayroll = payrolls.find((payroll) => payroll._id === payrollId);
    this.setState({
      payrollData: foundPayroll,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      data: [],
    });
    await this.props.fetchPayrolls(this.state.month);
    const processedPayload = this.createProcessedPayload(this.props.payrolls);

    this.setState({
      isLoading: false,
      data: processedPayload,
    });
  };
  sendEmail = async (employee, salaryDate) => {
    this.openCloseDeleteModal();
    this.setState({
      employeeData: { ...employee, salary_date: salaryDate },
    });
  };

  openCloseDeleteModal = () => {
    this.setState({
      emailModal: !this.state.emailModal,
    });
  };

  openCloseDeleteModal2 = () => {
    this.handlePayload();
    this.setState({
      closeModal: !this.state.closeModal,
    });
  };

  openCloseTaxModal = () => {
    this.handlePayload();
    this.setState({
      taxModal: !this.state.taxModal,
    });
  };

  render() {
    return (
      <>
        {!this.state.isLoading ? (
          <>
            <div className="mui-data-table">
              <MUIDataTable
                title={"Payroll"}
                options={{
                  selectableRows: false,
                  rowHover: false,
                  filter: false,
                  print: false,
                  download: false,
                  responsive: "scroll",
                  customToolbar: () => (
                    <div className="mb-4 d-flex flex-column flex-sm-row justify-content-end align-items-start ">
                      <form
                        className="d-flex mx-3"
                        onSubmit={this.handleSubmit}
                      >
                        <input
                          className="form-control"
                          required
                          type="month"
                          defaultValue={this.state.month}
                          onChange={(e) =>
                            this.setState({ month: e.target.value })
                          }
                        />
                        <Button
                          className="mx-2"
                          color="primary"
                          variant="outlined"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </form>
                      <GeneratePayroll payrollData={this.state.data} />
                    </div>
                  ),
                }}
                data={this.state.data}
                columns={this.state.columns}
              />
            </div>
            {this.state.emailModal && (
              <EmailConfirmation
                openModal={this.openCloseDeleteModal}
                employeeData={this.state.employeeData}
              />
            )}
            {this.state.closeModal && (
              <DeletePayroll
                openModal={this.openCloseDeleteModal2}
                employeeData={this.state.employeeData}
              />
            )}
            {this.state.taxModal && (
              <AddTax
                openModal={this.openCloseTaxModal}
                payrollData={this.state.payrollData}
              />
            )}
          </>
        ) : (
          <div className="LoaderWrapper">
            <CircularProgress color="primary" />
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    success: state.payrolls?.length && state.payrolls[0].success,
    payrolls: state.payrolls.payload,
    attendance: state.attendance.payload,
  };
};

export default connect(mapStateToProps, {
  fetchPayrolls,
  deletePayroll,
  updatePayroll,
  fetchAttendance,
})(Payroll);
