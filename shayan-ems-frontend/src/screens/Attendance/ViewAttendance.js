// import { Button } from "@material-ui/core";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Exemptions from "../../components/Modal/Attendance/Exemptions";
import { fetchAttendance, fetchEmployees } from "../../Redux/actions";
import Done from "@material-ui/icons/Done";
import Error from "@material-ui/icons/Error";
import Tooltip from "@material-ui/core/Tooltip";
const ViewAttendance = () => {
  const { payload } = useSelector((state) => state.attendance);
  const employees = useSelector((state) => state.employees.payload);
  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${("0" + new Date().getMonth()).slice(-2)}`
  );
  const [exemptModal, setexemptModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [checkbox, setCheckbox] = useState([
    {
      label: "Late",
      value: false,
    },
    {
      label: "Half leave",
      value: false,
    },
    {
      label: "Full leave",
      value: false,
    },
  ]);

  const handleChange = (position) => {
    const updatedCheckbox = checkbox.map((item, index) => {
      return index === position ? { ...item, value: !item.value } : item;
    });
    setCheckbox(updatedCheckbox);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (!payload.length > 0) {
      dispatch(fetchAttendance({ month: date }));
    }
    if (!employees || employees.length === 0) {
      dispatch(fetchEmployees());
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const status = checkbox
      .filter((check) => check.value)
      .map((item) => item.label);
    dispatch(
      fetchAttendance({ month: date, employee: employeeId, status: status })
    );
  };

  const columns = [
    {
      name: "_id",
      label: "id",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "week",
      label: "Day",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "name",
      label: "Employee Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "clock_In",
      label: "Clock In",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "clock_Out",
      label: "Clock Out",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "late",
      label: "Late Arrivals",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "absent",
      label: "Absent",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "exempt",
      label: "Exempted",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "sum_over_time",
      label: "SumOverTime",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "reason",
      label: "Reason",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },

    {
      name: "status",
      label: "Leave Status",
      options: {
        filterList: [],
        display: true,
        customBodyRender: (value) => {
          if (value === "Full leave" || value === "Half leave")
            return (
              <Tooltip title="OK">
                <Done style={{ color: "green", marginLeft: "25px" }} />
              </Tooltip>
            );
          if (value === "Late")
            return (
              <Tooltip title="Late Arrival">
                <Error color="error" style={{ marginLeft: "25px" }} />
              </Tooltip>
            );
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          if (tableMeta.rowData[10] === "Late" && !tableMeta.rowData[8]) {
            return (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setexemptModal({ id: tableMeta.rowData[0] })}
              >
                Exempt
              </Button>
            );
          } else if (tableMeta.rowData[8]) {
            return (
              <Button
                onClick={() =>
                  setexemptModal({
                    id: tableMeta.rowData[0],
                    reason: tableMeta.rowData[11],
                  })
                }
              >
                Unexempt
              </Button>
            );
          }
          if (
            tableMeta.rowData[10] === "Full leave" ||
            tableMeta.rowData[10] === "Half leave"
          ) {
            return <Button>Mark</Button>;
          }
          return <></>;
        },
      },
    },
  ];
  // const names = ["Late", "Half leave", "Full leave"];

  // function getStyles(name, status, theme) {
  //   return {
  //     fontWeight:
  //       status.indexOf(name) === -1
  //         ? theme.typography.fontWeightRegular
  //         : theme.typography.fontWeightMedium,
  //   };
  // }

  return (
    <Card>
      <div className="row justify-content-end mui-data-table">
        <form onSubmit={handleSubmit} className="d-flex flex-column my-2">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mx-3 mt-1">
              <label>Select Month</label>
              <input
                className="form-control"
                required
                type="month"
                defaultValue={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
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
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mx-3 mt-3 d-flex">
              {checkbox.map((value, key) => {
                return (
                  <FormControlLabel
                    value={value.value}
                    key={key}
                    control={
                      <Checkbox
                        color="primary"
                        onChange={() => handleChange(key)}
                      />
                    }
                    label={`${value.label}`}
                    // className={classes.checkbox}
                    labelPlacement="end"
                  />
                );
              })}
            </div>
            <div className="mx-2 mt-2 ">
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
          title={"Attendance"}
          options={{
            selectableRows: false,
            rowHover: false,
            filter: false,
            print: false,
            download: false,
            responsive: "scroll",
          }}
          data={payload}
          columns={columns}
        />
      </div>
      {exemptModal && (
        <Exemptions
          exempt={exemptModal}
          closeModal={() => setexemptModal(false)}
        />
      )}
    </Card>
  );
};

export default ViewAttendance;
