import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
} from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { isMobile } from "@utils/utils";
import { makeStyles } from "@material-ui/core/styles";
import { createshift } from "../../Redux/actions";
import { CircularProgress } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { fetchEmployees } from "../../Redux/actions";

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
  mediumTextField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 225,
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
  missing_number_of_hours: {
    margin: "18px 0 -12px 18px",
    fontSize: "12px",
    width: 215,
  },
  //   hr: {
  //     marginTop: theme.spacing.unit * 2,
  //     marginLeft: theme.spacing.unit,
  //     marginRight: theme.spacing.unit,
  //     width: 470,
  //     textAlign: "center",
  //   },
  heading: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },
}));

const Time = () => {
  const dispatch = useDispatch();
  const [shift, setShift] = useState(null);
  const shifts = useSelector((state) => state.shift.payload);
  const employees = useSelector((state) => state.employees.payload);
  const [employeeId, setEmployeeId] = useState(null);
  const [noOfDays, setNoOfDays] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [noOfhours, setNoOfhours] = useState(null);
  const [checkbox, setCheckbox] = useState([
    {
      label: "Mon",
      value: false,
    },
    {
      label: "Tue",
      value: false,
    },
    {
      label: "Wed",
      value: false,
    },
    {
      label: "Thu",
      value: false,
    },
    {
      label: "Fri",
      value: false,
    },
    {
      label: "Sat",
      value: false,
    },
    {
      label: "Sun",
      value: false,
    },
  ]);
  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);
  const classes = useStyles();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      shift_name: shift,
      employee_shift: employeeId,
      working_hours: noOfDays,
      start_time: dateStart,
      end_time: dateEnd,
      no_of_hours: noOfhours,
      working_days: checkbox,
    };
    dispatch(createshift(payload));
  };

  const handleChange = (position) => {
    const updatedCheckbox = checkbox.map((item, index) => {
      return index === position ? { ...item, value: !item.value } : item;
    });
    setCheckbox(updatedCheckbox);
  };

  return (
    <>
      {!shifts ? (
        <CircularProgress />
      ) : (
        <Paper className={`${classes.paper} shift-paper`}>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="shift_name"
              name="shift_name"
              label="Shift Name"
              required
              type="text"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl className={classes.formControl}>
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
                    <option
                      value={employee.first_name + " " + employee.last_name}
                      key={i}
                    >
                      {employee.first_name} {employee.last_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              id="working_days"
              name="working_days"
              label="Working Hours"
              required
              type="number"
              value={noOfDays}
              onChange={(e) => setNoOfDays(e.target.value)}
              className={
                isMobile() ? classes.TextField : classes.mediumTextField
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="start_time"
              name="start_time"
              label="Start Time"
              required
              type="time"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="end_time"
              name="end_time"
              label="End Time"
              required
              type="time"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <InputLabel className={classes.missing_number_of_hours}>
              Checkout Missing after # of hours of shift
            </InputLabel>
            <TextField
              id="missing_number_of_hours"
              name="missing_number_of_hours"
              required
              placeholder="hh"
              type="text"
              value={noOfhours}
              onChange={(e) => setNoOfhours(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <h6 className={classes.heading}>Working Hours</h6>
            {checkbox.map((value, key) => {
              return (
                <FormControlLabel
                  key={key}
                  value={value.value}
                  control={
                    <Checkbox
                      color="primary"
                      onChange={() => handleChange(key)}
                    />
                  }
                  label={`${value.label}`}
                  className={classes.checkbox}
                  labelPlacement="end"
                />
              );
            })}
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

export default Time;
