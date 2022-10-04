import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, fetchSuggestions } from "../../Redux/actions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteSuggestion from "@components/Modal/Suggestions/DeleteSuggestion";
import UpdateSuggestion from "@components/Modal/Suggestions/UpdateSuggestion";
import ViewSuggestion from "@components/Modal/Suggestions/ViewSuggestion";

const Suggestions = () => {
  const dispatch = useDispatch();
  const { payload } = useSelector((state) => state.suggestion);
  const [data, setData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const employees = useSelector((state) => state.employees.payload);
  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${"0" + `${new Date().getMonth() + 1}`}`
  );
  const [employeeId, setEmployeeId] = useState(null);
  const [checkbox, setCheckbox] = useState([
    {
      label: "Approved",
      value: false,
    },
    {
      label: "Declined",
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
      fetchSuggestions({
        month: date,
        employee: employeeId,
        suggestion_status: status,
      })
    );
  };
  let processedPayload = [];

  const columns = [
    {
      name: "_id",
      label: "Suggestion Id",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "employee_name",
      label: "Emoployee Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "suggestion_date",
      label: "Date",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "suggestion_message",
      label: "Desc.",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "suggestion_status",
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
      dispatch(fetchSuggestions({ month: date }));
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
          };
        })
        .filter(
          (each) =>
            checkbox.find(
              (eachBox) =>
                eachBox.label.toLowerCase() === each.suggestion_status
            ).value
        );
      if (employeeId) {
        processedPayload = processedPayload.filter(
          (item) => item.employee_id?._id === employeeId
        );
      }

      setData(processedPayload);
    } else {
      dispatch(fetchSuggestions({ month: date }));
    }
  }, [payload]);

  const deleteModal = (suggestionId) => {
    setCloseModal(!closeModal);
    setSuggestion(
      payload.find((suggestion) => suggestion._id === suggestionId)
    );
  };
  const visiblityModal = (suggestionId) => {
    setShowViewModal(!showViewModal);
    setSuggestion(
      payload.find((suggestion) => suggestion._id === suggestionId)
    );
  };

  const updateModal = (suggestionId) => {
    setShowUpdateModal(!showUpdateModal);
    setSuggestion(
      payload.find((suggestion) => suggestion._id === suggestionId)
    );
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
          <MUIDataTable
            title={"Suggestion List"}
            data={data}
            columns={columns}
            options={{
              selectableRows: false,
              rowHover: false,
              filter: false,
              print: false,
              download: false,
            }}
          />
        </Card>
      )}
      {showUpdateModal && (
        <UpdateSuggestion
          openModal={() => setShowUpdateModal(null)}
          data={suggestion}
        />
      )}
      {showViewModal && (
        <ViewSuggestion
          openModal={() => setShowViewModal(null)}
          data={suggestion}
        />
      )}
      {closeModal && (
        <DeleteSuggestion
          openModal={() => setCloseModal(!closeModal)}
          data={suggestion}
        />
      )}
    </>
  );
};

export default Suggestions;
