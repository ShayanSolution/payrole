import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
// import moment from "moment";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../Redux/actions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteEvent from "../../components/Modal/Events/DeleteEvent";
import ViewEvents from "../../components/Modal/Events/ViewEvent";
import UpdateEvent from "../../components/Modal/Events/UpdateEvent";

const ViewEvent = () => {
  const dispatch = useDispatch();
  const { payload } = useSelector((state) => state.event);
  const [data, setData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [event, setEvent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let processedPayload = [];

  const columns = [
    {
      name: "_id",
      label: "ID",
      options: {
        display: false,
      },
    },
    {
      name: "event",
      label: "Event",
      options: {
        display: true,
      },
    },
    {
      name: "event_name",
      label: "Event Name",
      options: {
        display: true,
      },
    },
    {
      name: "Date",
      label: "Event Date",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "Day",
      label: "Day",
      options: {
        filter: false,
        sort: true,
        display: true,
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
            event: data.event,
            event_name: data.event_name,
            Date: data.Date,
            Day: data.Day,
          };
        });
      setData(processedPayload);
    } else {
      dispatch(fetchEvents());
    }
  }, [payload]);

  const deleteModal = (eventId) => {
    setCloseModal(!closeModal);
    setEvent(payload.find((event) => event.event === eventId));
  };
  const visiblityModal = (eventId) => {
    setShowViewModal(!showViewModal);
    setEvent(payload.find((event) => event.event === eventId));
  };

  const updateModal = (eventId) => {
    setShowUpdateModal(!showUpdateModal);
    setEvent(payload.find((event) => event._id === eventId));
  };

  return (
    <>
      {!payload ? (
        <div className="LoaderWrapper">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="mui-data-table">
          <MUIDataTable
            title={"Event List"}
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
      )}
      {showUpdateModal && (
        <UpdateEvent
          openModal={() => setShowUpdateModal(null)}
          eventData={event}
        />
      )}
      {showViewModal && (
        <ViewEvents
          openModal={() => setShowViewModal(null)}
          eventData={event}
        />
      )}
      {closeModal && (
        <DeleteEvent
          openModal={() => setCloseModal(!closeModal)}
          eventData={event}
        />
      )}
    </>
  );
};

export default ViewEvent;
