import React from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchEmployees,
  deleteEmployee,
  fetchEmployee,
  fetchLeaves,
} from "../../../Redux/actions";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SvgIcon from "@material-ui/core/SvgIcon";
import ViewEmployee from "@components/Modal/employees/ViewEmployee";
import UpdateEmployee from "@components/Modal/employees/UpdateEmployee";
import LeavesQuota from "@components/Modal/employees/LeavesQuota";
import { Button, CircularProgress } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import ViewContract from "@components/Modal/employees/ViewContract";
import AdjustmentModal from "@components/Modal/Adjustments/AdjustmentModal";
import DeleteEmployee from "@components/Modal/employees/DeleteEmployee";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { ItemStyles } from "./styles";
import { formatDate } from "../../../utils/utils";

const Item = styled(Paper)(ItemStyles);

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          name: "_id",
          label: "Employee ID",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "contract_id",
          label: "Contract ID",
          options: {
            filter: true,
            sort: true,
            display: false,
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
          name: "date_of_birth",
          label: "DOB",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "deleted_at",
          label: "Deleted At",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "updated_at",
          label: "Updated At",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "father_name",
          label: "Father Name",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "first_name",
          label: "First Name",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "last_name",
          label: "Last Name",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "isSoftDeleted",
          label: "Deleted",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "job_title",
          label: "Job Title",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "account_No",
          label: "Account No",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "joining_date",
          label: "Joining Date",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "mobile_number",
          label: "Mobile Number",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "national_id_number",
          label: "CNIC No",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "official_email",
          label: "Official Email",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "permanent_address",
          label: "Permanent Address",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "personal_email",
          label: "Personal Email",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "residential_address",
          label: "Residential Address",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "residential_number",
          label: "Residential Number",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "salary",
          label: "Salary",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "contract",
          label: "Contract Status",
          options: {
            filter: true,
            sort: true,
            display: false,
          },
        },
        {
          name: "yearly_quota",
          label: "Yearly Quota",
          options: {
            filter: true,
            sort: true,
            display: true,
          },
        },
        {
          name: "availed_leaves",
          label: "Availed Leaves",
          options: {
            filter: true,
            sort: true,
            display: true,
          },
        },
        {
          name: "status",
          label: "Contract",
          options: {
            customBodyRender: (value, tableMeta) => {
              return (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.viewContractModal(tableMeta.rowData[0])}
                >
                  View Contract
                </Button>
              );
            },
          },
        },
        {
          name: "status",
          label: "Actions",
          options: {
            customBodyRender: (value, tableMeta) => {
              return (
                <Stack direction="row" spacing={1}>
                  <Item>
                    <VisibilityIcon
                      color="action"
                      fontSize="small"
                      cursor="pointer"
                      onClick={() =>
                        this.openEmployeeModal(tableMeta.rowData[0], false)
                      }
                    />
                  </Item>
                  <Item>
                    <EditSharpIcon
                      color="action"
                      fontSize="small"
                      cursor="pointer"
                      onClick={() =>
                        this.openEmployeeModal(tableMeta.rowData[0], true)
                      }
                    />
                  </Item>
                  <Item>
                    <DeleteIcon
                      color="action"
                      fontSize="small"
                      cursor="pointer"
                      onClick={() => this.deleteModal(tableMeta.rowData[0])}
                    />
                  </Item>
                  <Item>
                    <AccountBalanceIcon
                      color="action"
                      fontSize="small"
                      cursor="pointer"
                      onClick={() => this.openQuotaModal(tableMeta.rowData[0])}
                    />
                  </Item>
                  <Item>
                    <SvgIcon
                      color="action"
                      fontSize="small"
                      cursor="pointer"
                      viewBox="0 0 640 512"
                      onClick={() => {
                        this.setState({ employee_id: tableMeta.rowData[0] });
                        this.toggleAdjustmentModal();
                      }}
                    >
                      <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64H337.9c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5V384c0 35.3-28.7 64-64 64H302.1c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5V128c0-35.3 28.7-64 64-64zm64 64H96v64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64h64V320zM320 352c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96z" />
                    </SvgIcon>
                  </Item>
                </Stack>
              );
            },
          },
        },
      ],
      modalOpen: false,
      contractModal: false,
      closeModal: false,
      leaveModal: false,
      userData: "",
      contractData: "",
      employeesData: [],
      employeeData: "",
      isUpdateModal: false,
      isLoading: true,
      data: [],
      adjustmentModal: false,
      employee_id: null,
    };
  }

  fetchData = (data) => {
    const result = data
      .filter((employee) => {
        if (!employee.isSoftDeleted) {
          return employee;
        }
      })
      .map((employee) => {
        const singleEmployeeLeaves = this.props.leaves
          .filter(
            (item) =>
              item.employee_id?._id === employee._id &&
              new Date(item.date_end).getMonth() + 1 ===
                new Date().getMonth() + 1
          )
          .reduce((pre, curr) => pre + curr.no_of_days, 0);
        return {
          ...employee,
          availed_leaves: -singleEmployeeLeaves,
          joining_date: formatDate(employee.joining_date),
          updated_at: formatDate(employee.updated_at),
          created_at: formatDate(employee.created_at),
          deleted_at: formatDate(employee.deleted_at),
        };
      });

    return result;
  };

  componentDidMount = async () => {
    if (this.props.employees.length === 0) {
      await this.props.fetchEmployees();
    }
    if (!this.props.leaves.length) {
      await this.props.fetchLeaves();
    }
    this.setState({
      isLoading: false,
      data: this.fetchData(this.props.employees),
    });
  };

  openQuotaModal = (employeeId) => {
    const { employees } = this.props;
    const requiredEmployee = employees.find(
      (employee) => employee._id === employeeId
    );
    this.setState({
      leaveModal: true,
      employeeData: requiredEmployee,
    });
  };

  openEmployeeModal = (employeeId, updateFlag) => {
    this.openModal();
    const { employees } = this.props;
    this.setState({
      isUpdateModal: updateFlag,
      employeeData: employees.find((employee) => employee._id === employeeId),
    });
  };
  viewContractModal = async (employeeId) => {
    const requestedEmployee = this.props.employees.find(
      (emp) => emp._id === employeeId
    );
    if (requestedEmployee) {
      const contract = {
        ...requestedEmployee.contract_id,
        employeeId,
      };
      this.setState({
        contractModal: true,
        contractData: contract,
      });
    } else {
      toast.error("No employee found");
    }
  };
  deleteModal = (employeeId) => {
    const { employees } = this.props;
    this.setState({
      closeModal: true,
      employeeData: employees.find((employee) => employee._id === employeeId),
    });
  };
  openModal = async () => {
    const response = await this.props.fetchEmployees();
    const { payload } = response.data;
    this.setState({
      modalOpen: !this.state.modalOpen,
      data: this.fetchData(payload),
    });
  };
  openContractModal = () => {
    this.setState({
      contractModal: !this.state.contractModal,
      data: this.fetchData(this.props.employees),
    });
  };
  toggleAdjustmentModal = () => {
    this.setState({
      adjustmentModal: !this.state.adjustmentModal,
    });
  };
  openCloseDeleteModal = async () => {
    this.setState({
      closeModal: !this.state.closeModal,
      data: this.fetchData(this.props.employees),
    });
  };

  openCloseQuotaModal = async () => {
    this.setState({
      leaveModal: !this.state.leaveModal,
      data: this.fetchData(this.props.employees),
    });
  };

  render() {
    return (
      <>
        {!this.state.isLoading ? (
          <div className="mui-data-table">
            <MUIDataTable
              title={"Employees"}
              options={{
                selectableRows: false,
                rowHover: false,
                filter: false,
                print: false,
                download: false,
                responsive: "scroll",
              }}
              data={this.state.data}
              columns={this.state.columns}
            />
          </div>
        ) : (
          <div className="LoaderWrapper">
            <CircularProgress color="primary" />
          </div>
        )}

        {this.state.modalOpen &&
          (this.state.isUpdateModal ? (
            <UpdateEmployee
              openModal={this.openModal}
              employeeData={this.state.employeeData}
            />
          ) : (
            <ViewEmployee
              openModal={this.openModal}
              employeeData={this.state.employeeData}
            />
          ))}

        {this.state.contractModal && (
          <ViewContract
            openModal={this.openContractModal}
            contractData={this.state.contractData}
          />
        )}

        {this.state.closeModal && (
          <DeleteEmployee
            openModal={this.openCloseDeleteModal}
            employeeData={this.state.employeeData}
          />
        )}

        {this.state.leaveModal && (
          <LeavesQuota
            openModal={this.openCloseQuotaModal}
            employeeData={this.state.employeeData}
          />
        )}
        {this.state.adjustmentModal && (
          <AdjustmentModal
            employee_id={this.state.employee_id}
            toggleAdjustmentModal={this.toggleAdjustmentModal}
          />
        )}
        <ToastContainer />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    employees: state.employees?.payload,
    success: state.employees?.length && state.employees[0].success,
    leaves: state.leaves?.payload,
  };
};

export default connect(mapStateToProps, {
  fetchEmployees,
  deleteEmployee,
  fetchEmployee,
  fetchLeaves,
})(UserList);
