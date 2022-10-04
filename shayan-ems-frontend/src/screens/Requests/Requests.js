import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
// import moment from "moment";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, fetchRequests } from "../../Redux/actions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteRequest from "../../components/Modal/Requests/DeleteRequest";
import UpdateRequest from "../../components/Modal/Requests/UpdateRequest";
import ViewRequest from "../../components/Modal/Requests/ViewRequest";

const Requests = () => {
  const dispatch = useDispatch();
  const { payload } = useSelector((state) => state.requests);
  const [data, setData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [request, setRequest] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const employees = useSelector((state) => state.employees.payload);
  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${(
      "0" +
      (Number(new Date().getMonth()) + 1)
    ).slice(-2)}`
  );
  const [employeeId, setEmployeeId] = useState(null);
  const [checkbox, setCheckbox] = useState([
    {
      label: "Granted",
      value: false,
    },
    {
      label: "Rejected",
      value: false,
    },
    {
      label: "Pending",
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
      .map((item) => item.label.toLowerCase());
    dispatch(
      fetchRequests({
        month: date,
        employee: employeeId,
        request_status: status,
      })
    );
  };
  let processedPayload = [];

  const columns = [
    {
      name: "_id",
      label: "Request Id",
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
      name: "request_title",
      label: "Title",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "request_purpose",
      label: "Purpose",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "request_date",
      label: "Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "request_status",
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
    if (!payload.length > 0) {
      dispatch(fetchRequests({ month: date }));
    }
    if (!employees || employees.length === 0) {
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
            first_name: data.first_name,
            last_name: data.last_name,
            request_title: data.request_title,
            request_purpose: data.request_purpose,
            request_desc: data.request_desc,
            request_date: data.request_date,
            request_status: data.request_status,
          };
        })
        .filter(
          (each) =>
            checkbox.find(
              (eachBox) => eachBox.label.toLowerCase() === each.request_status
            ).value
        );
      if (employeeId) {
        processedPayload = processedPayload.filter(
          (item) => item.employee_id?._id === employeeId
        );
      }
      setData(processedPayload);
    } else {
      dispatch(fetchRequests({ month: date }));
    }
  }, [payload]);

  const deleteModal = (requestId) => {
    setCloseModal(!closeModal);
    setRequest(payload.find((request) => request._id === requestId));
  };
  const visiblityModal = (requestId) => {
    setShowViewModal(!showViewModal);
    setRequest(payload.find((request) => request._id === requestId));
  };

  const updateModal = (requestId) => {
    setShowUpdateModal(!showUpdateModal);
    setRequest(payload.find((request) => request._id === requestId));
  };

  return (
    <>
      {!payload ? (
        <div className="LoaderWrapper">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <Card>
          <div className="row justify-content-end">
            <form onSubmit={handleSubmit} className="d-flex flex-column my-2">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
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
              <div className="d-flex flex-wrap justify-content-between align-items-center">
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
          <div className="mui-data-table">
            <MUIDataTable
              title={"Request List"}
              data={data}
              columns={columns}
              options={{
                selectableRows: false,
                rowHover: false,
                filter: false,
                print: false,
                download: false,
                responsive: "scroll",
              }}
            />
          </div>
        </Card>
      )}
      {showUpdateModal && (
        <UpdateRequest
          openModal={() => setShowUpdateModal(null)}
          requestData={request}
        />
      )}
      {showViewModal && (
        <ViewRequest
          openModal={() => setShowViewModal(null)}
          requestData={request}
        />
      )}
      {closeModal && (
        <DeleteRequest
          openModal={() => setCloseModal(!closeModal)}
          requestData={request}
        />
      )}
    </>
  );
};

export default Requests;
