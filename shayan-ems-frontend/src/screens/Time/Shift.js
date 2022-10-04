// import { Card } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShifts } from "../../Redux/actions";
import MUIDataTable from "mui-datatables";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteShift from "../../components/Modal/Shifts/DeleteShift";
import ViewShift from "../../components/Modal/Shifts/ViewShift";
import UpdateShift from "../../components/Modal/Shifts/UpdateShift";
import { CircularProgress } from "@material-ui/core";

const Shift = () => {
  const dispatch = useDispatch();
  const shift = useSelector((state) => state.shift);
  const [closeModal, setCloseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [shifts, setShift] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  let processedPayload = [];
  const initCols = [
    {
      name: "shift_name",
      label: "Shift Name",
      options: {
        filterList: [],
      },
    },
    {
      name: "employee_shift",
      label: "Employee Name",
      options: {
        display: true,
      },
    },
    {
      name: "start_time",
      label: "Start Time",
      options: {
        display: true,
      },
    },
    {
      name: "end_time",
      label: "End Time",
      options: {
        display: true,
      },
    },
    {
      name: "no_of_hours",
      label: "Working Days",
      options: {
        filter: false,
        sort: true,
        sortDirection: "asc",
      },
    },
    {
      name: "working_hours",
      label: "Working Hours",
      options: {
        filter: false,
        sort: true,
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

  const options = {
    filter: true,
    selectableRows: false,
    rowHover: false,
    print: false,
    download: false,
    responsive: "scroll",
  };

  useEffect(() => {
    if (shift.payload) {
      processedPayload = shift.payload
        .filter((employee) => {
          if (!employee.isSoftDeleted) {
            return employee;
          }
        })
        .map((data) => {
          const no_days_obj = data.working_days.filter(
            (data) => data.value === true
          );
          const days = no_days_obj.map(function (key) {
            return key.label + ",";
          });
          return {
            ...data,
            shift_name: data.shift_name,
            working_hours: data.working_hours,
            start_time: data.start_time,
            end_time: data.end_time,
            no_of_hours: days,
            working_days: data.working_days,
          };
        });
      setData(processedPayload);
    } else {
      dispatch(fetchShifts());
    }
  }, [shift.payload]);

  const deleteModal = (shiftId) => {
    setCloseModal(!closeModal);
    setShift(shift.payload.find((shift) => shift.shift_name === shiftId));
  };
  const visiblityModal = (shiftId) => {
    setShowViewModal(!showViewModal);
    setShift(shift.payload.find((shift) => shift.shift_name === shiftId));
  };
  const updateModal = (shiftId) => {
    setShowUpdateModal(!showUpdateModal);
    setShift(shift.payload.find((shift) => shift.shift_name === shiftId));
  };

  return (
    <>
      {!shift.payload ? (
        <div className="LoaderWrapper">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="mui-data-table shift-list">
          <MUIDataTable
            title={"Shift List"}
            data={data}
            columns={initCols}
            options={options}
          />
        </div>
      )}
      {showUpdateModal && (
        <UpdateShift
          openModal={() => setShowUpdateModal(null)}
          shiftData={shifts}
        />
      )}
      {showViewModal && (
        <ViewShift
          openModal={() => setShowViewModal(null)}
          shiftData={shifts}
        />
      )}
      {closeModal && (
        <DeleteShift
          openModal={() => setCloseModal(!closeModal)}
          shiftData={shifts}
        />
      )}
    </>
  );
};

export default Shift;
