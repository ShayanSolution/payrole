import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../Redux/actions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import DeleteCourse from "../../components/Modal/Courses/DeleteCourse";
import UpdateCourse from "../../components/Modal/Courses/UpdateCourse";

const ViewCourses = () => {
  const dispatch = useDispatch();
  const { payload } = useSelector((state) => state.course);
  const [data, setData] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [course, setCourse] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let processedPayload = [];

  const columns = [
    {
      name: "courses_title",
      label: "Course",
    },
    {
      name: "course_link",
      label: "Course Link",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return <a href={value}>{value}</a>;
        },
      },
    },
    {
      name: "course_desc",
      label: "Course Desc",
      options: {
        filter: true,
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
            courses_title: data.courses_title,
            course_link: data.course_link,
            course_desc: data.course_desc,
          };
        });
      setData(processedPayload);
    } else {
      dispatch(fetchCourses());
    }
  }, [payload]);

  const deleteModal = (courseId) => {
    setCloseModal(!closeModal);
    setCourse(payload.find((course) => course.courses_title === courseId));
  };

  const updateModal = (courseId) => {
    setShowUpdateModal(!showUpdateModal);
    setCourse(payload.find((course) => course.courses_title === courseId));
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
            title={"Course List"}
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
        <UpdateCourse
          openModal={() => setShowUpdateModal(null)}
          courseData={course}
        />
      )}
      {closeModal && (
        <DeleteCourse
          openModal={() => setCloseModal(!closeModal)}
          courseData={course}
        />
      )}
    </>
  );
};

export default ViewCourses;
