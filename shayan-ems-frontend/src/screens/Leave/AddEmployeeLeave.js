import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { CircularProgress, Select } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { isMobile } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, createLeave } from "../../Redux/actions";
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

const AddEmployeeLeave = () => {
  const employees = useSelector((state) => state.employees.payload);
  const dispatch = useDispatch();

  const [employeeId, setEmployeeId] = useState(
    employees.length > 0 && employees[0]._id
  );
  const [type, setType] = useState("Sick");
  const [noOfDays, setNoOfDays] = useState(null);
  const [prevDate, setPrevDate] = useState(null);
  const [nextDate, setNextDate] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dateJoin, setDateJoin] = useState(null);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    } else {
      setEmployeeId(employees[0]._id);
    }
  }, [employees]);

  useEffect(() => {
    //get date for previous three months
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    const threeMonthBackDate = moment(currentDate.toLocaleDateString()).format(
      "YYYY-MM-DD"
    );
    setPrevDate(threeMonthBackDate);

    //get date for next three months
    var newCurrentDate = new Date();
    newCurrentDate.setMonth(newCurrentDate.getMonth() + 3);
    var threeMonthAfterDate = moment(
      newCurrentDate.toLocaleDateString()
    ).format("YYYY-MM-DD");
    setNextDate(threeMonthAfterDate);
  }, []);

  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      employee_id: employeeId,
      type: type,
      no_of_days: noOfDays,
      status: "pending",
      date_start: dateStart,
      date_end: dateEnd,
      date_join: dateJoin,
      approved_at: dateJoin,
      approved_by: "Admin",
      reason: reason,
    };

    dispatch(createLeave(payload));
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
            <FormControl className={classes.formControl}>
              <Select
                native
                required
                fullWidth
                onChange={(e) => setEmployeeId(e.target.value)}
                inputProps={{
                  name: "employeeId",
                  id: "filled-age-native-simple",
                }}
              >
                {employees.map(function (employee, i) {
                  return (
                    <option value={employee._id} key={i}>
                      {employee.first_name} {employee.last_name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.selectHalfFormControl}>
              <InputLabel htmlFor="filled-age-native-simple">Type</InputLabel>
              <Select
                native
                required
                fullWidth
                className={classes.halfSelectField}
                onChange={(e) => setType(e.target.value)}
                inputProps={{
                  name: "employeeId",
                  id: "filled-age-native-simple",
                }}
              >
                <option value="Sick"> Sick </option>
                <option value="Casual"> Casual </option>
                <option value="Marriage"> Marriage </option>
              </Select>
            </FormControl>
            <TextField
              id="no_of_days"
              name="no_of_days"
              label="No. of days"
              required
              type="number"
              value={noOfDays}
              onChange={(e) => setNoOfDays(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="start_date"
              name="start_date"
              label="Start Date"
              required
              type="date"
              InputProps={{
                inputProps: {
                  min: prevDate,
                  max: nextDate,
                },
              }}
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="end_date"
              name="end_date"
              label="End Date"
              required
              type="date"
              InputProps={{
                inputProps: {
                  min: dateStart,
                },
              }}
              disabled={!dateStart}
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date_join"
              name="date_join"
              label="Date Join"
              required
              type="date"
              InputProps={{
                inputProps: {
                  min: dateEnd,
                },
              }}
              value={dateJoin}
              disabled={!dateEnd}
              onChange={(e) => setDateJoin(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="reason"
              name="reason"
              label="Reason"
              placeholder="Enter Reason"
              multiline
              required
              value={reason}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setReason(e.target.value)}
              margin="normal"
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

export default AddEmployeeLeave;
