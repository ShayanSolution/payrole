import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createCourse } from "../../Redux/actions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 500,
    margin: "auto",
    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
  },
  form: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 450,
  },
  halfTextField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 205,
  },
  halfSelectField: {
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 205,
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  switch: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 450,
  },
  selectHalfFormControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 215,
  },
}));

const AddCourses = () => {
  const employees = useSelector((state) => state.employees.payload);
  const dispatch = useDispatch();
  const [courses_title, setCourse] = useState(null);
  const [course_link, setCourselink] = useState(null);
  const [course_desc, setCoursedesc] = useState(null);

  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      courses_title: courses_title,
      course_link: course_link,
      course_desc: course_desc,
    };

    dispatch(createCourse(payload));
  };

  return (
    <>
      {!employees ? (
        <CircularProgress />
      ) : (
        <Paper className={classes.paper}>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="courses_title"
              name="courses_title"
              label="Course Title"
              multiline
              required
              value={courses_title}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setCourse(e.target.value)}
              margin="normal"
            />
            <br />
            <TextField
              id="course_link"
              name="course_link"
              label="Course Link"
              multiline
              required
              value={course_link}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setCourselink(e.target.value)}
              margin="normal"
            />
            <br />
            <TextField
              id="course_desc"
              name="course_desc"
              label="Course Desc"
              multiline
              required
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              margin="normal"
              value={course_desc}
              onChange={(e) => setCoursedesc(e.target.value)}
            />
            <br />
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-end"
            >
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      <ToastContainer
        position="bottom-left"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={false}
        pauseOnHover={false}
        draggable={false}
        theme="dark"
      />
    </>
  );
};

export default AddCourses;
