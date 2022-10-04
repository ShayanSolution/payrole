import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import TableFooter from "@mui/material/TableFooter";
import { TableCell, TableRow } from "@mui/material";
import TablePagination from "@material-ui/core/TablePagination";

import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaves, fetchEmployees } from "../../Redux/actions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteLeave from "../../components/Modal/Leaves/DeleteLeave";
import ViewLeave from "../../components/Modal/Leaves/ViewLeave";
import UpdateLeave from "../../components/Modal/Leaves/UpdateLeave";

const Leave = () => {
  const dispatch = useDispatch();
  const { payload } = useSelector((state) => state.leaves);
  const [data, setData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [leave, setLeave] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const employees = useSelector((state) => state.employees.payload);
  const [employeeId, setEmployeeId] = useState(null);
  const [daysCount, setDaysCount] = useState(0);
  const [showDays, setshowDays] = useState(false);
  const [checkbox, setCheckbox] = useState([
    {
      label: "granted",
      value: false,
    },
    {
      label: "rejected",
      value: false,
    },
    {
      label: "exempted",
      value: false,
    },
    {
      label: "pending",
      value: true,
    },
  ]);

  const handleChange = (position) => {
    const updatedCheckbox = checkbox.map((item, index) => {
      return index === position ? { ...item, value: !item.value } : item;
    });
    setCheckbox(updatedCheckbox);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const status = checkbox
      .filter((check) => check.value)
      .map((item) => item.label);
    dispatch(fetchLeaves({ employee: employeeId, status: status }));
  };
  let processedPayload = [];

  const columns = [
    {
      name: "_id",
      label: "Leave Id",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "leave_type",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "date_start",
      label: "Start Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "date_end",
      label: "End Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "no_of_days",
      label: "No. of Days",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "date_join",
      label: "Joining Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          return (
            <>
              <VisibilityIcon
                color="action"
                fontSize="small"
                cursor="pointer"
                onClick={() => visiblityModal(tableMeta.rowData[0])}
              />
              <EditSharpIcon
                color="action"
                fontSize="small"
                cursor="pointer"
                onClick={() => updateModal(tableMeta.rowData[0])}
              />
              <DeleteIcon
                color="action"
                fontSize="small"
                cursor="pointer"
                onClick={() => deleteModal(tableMeta.rowData[0])}
              />
            </>
          );
        },
      },
    },
  ];

  useEffect(() => {
    setDaysCount(0);
    if (!payload.length > 0) {
      dispatch(fetchLeaves());
    }
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }
    if (payload) {
      processedPayload = payload
        .filter((employee) => {
          if (!employee.isSoftDeleted) {
            return employee;
          }
        })
        .map((data) => {
          return {
            ...data,
            first_name: data.employee_id?.first_name,
            last_name: data.employee_id?.last_name,
            leave_type: data.type,
            date_start: moment(data.date_start).format("DD/MM/YYYY"),
            date_end: moment(data.date_end).format("DD/MM/YYYY"),
            no_of_days: Math.abs(data.no_of_days),
            date_join: moment(data.date_join).format("DD/MM/YYYY"),
          };
        })
        .filter(
          (each) =>
            checkbox.find((eachBox) => eachBox.label === each.status).value
        );

      if (employeeId) {
        processedPayload = processedPayload.filter(
          (item) => item.employee_id?._id === employeeId
        );

        setshowDays(true); 


      } else setshowDays(false);
      
      setData(processedPayload);
    } else {
      dispatch(fetchLeaves());
    }
  }, [payload, checkbox]);

  const deleteModal = (leaveId) => {
    setCloseModal(!closeModal);
    setLeave(payload.find((leave) => leave._id === leaveId));
  };
  const visiblityModal = (leaveId) => {
    setShowViewModal(!showViewModal);
    setLeave(payload.find((leave) => leave._id === leaveId));
  };

  const updateModal = (leaveId) => {
    setShowUpdateModal(!showUpdateModal);
    setLeave(payload.find((leave) => leave._id === leaveId));
  };

  function handleTableChange(action, tableState) {
    const totalDays = calculateTotalDays(tableState.displayData);
    setDaysCount(totalDays);
  }

  const calculateTotalDays = (data) => {
    const totalDays = data.map((item) => item.data[6]).reduce((total, currentValue) => (total += currentValue), 0);
    return totalDays;
  };

  return (
    <>
      {!payload ? (
        <div className="LoaderWrapper">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <Card>
          <div className="row justify-content-end mui-data-table">
            <form onSubmit={handleSubmit} className="d-flex flex-column my-2">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="mx-3 my-2">
                  <label>Employees</label>
                  <Select
                    native
                    fullWidth
                    value={employeeId}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setEmployeeId(null);
                      } else {
                        setEmployeeId(e.target.value);
                      }
                    }}
                    inputProps={{
                      name: "employeeId",
                      id: "filled-age-native-simple",
                    }}
                  >
                    <option value="">All Employees</option>
                    {employees.map(function (employee, i) {
                      return (
                        <option value={employee._id} key={i}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div className="mx-3 mt-3">
                  {checkbox.map((value, key) => {
                    return (
                      <FormControlLabel
                        key={key}
                        value={value.value}
                        control={
                          <Checkbox
                            color="primary"
                            onChange={() => handleChange(key)}
                            checked={value.value}
                          />
                        }
                        label={`${value.label}`}
                        labelPlacement="end"
                      />
                    );
                  })}
                </div>
                <div className="mx-2 mt-2">
                  <Button
                    className="mx-2"
                    color="primary"
                    variant="outlined"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <MUIDataTable
              title={"Leave List"}
              data={data}
              columns={columns}
              options={{
                selectableRows: "none",
                rowHover: false,
                filter: false,
                print: false,
                download: false,
                responsive: "vertical",
                onTableChange: handleTableChange,
                customFooter: (
                  count,
                  page,
                  rowsPerPage,
                  changeRowsPerPage,
                  changePage
                ) => {
                  return (
                    <TableFooter>
                      <TableRow>
                        {showDays ? (
                          <TableCell>Total No. of Days: {daysCount}</TableCell>
                        ) : (
                          <TableCell></TableCell>
                        )}

                        <TablePagination
                          count={count}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onChangeRowsPerPage={(event) =>
                            changeRowsPerPage(event.target.value)
                          }
                          onChangePage={(_, page) => changePage(page)}
                        />
                      </TableRow>
                    </TableFooter>
                  );
                },
              }}
            />
          </div>
        </Card>
      )}
      {showUpdateModal && (
        <UpdateLeave
          openModal={() => setShowUpdateModal(null)}
          leaveData={leave}
        />
      )}
      {showViewModal && (
        <ViewLeave openModal={() => setShowViewModal(null)} leaveData={leave} />
      )}
      {closeModal && (
        <DeleteLeave
          openModal={() => setCloseModal(!closeModal)}
          leaveData={leave}
        />
      )}
    </>
  );
};

export default Leave;
