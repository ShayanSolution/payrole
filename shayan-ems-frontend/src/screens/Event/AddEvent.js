import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { isMobile } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../Redux/actions";
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

const AddEvent = () => {
  const employees = useSelector((state) => state.employees.payload);
  const dispatch = useDispatch();
  const [events, setEvent] = useState(null);
  const [event_name, setEventname] = useState(null);
  const [event_date, setEventdate] = useState(null);

  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      event: events,
      event_name: event_name,
      event_date: event_date,
    };

    dispatch(createEvent(payload));
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
              id="event"
              name="event"
              label="Event Title"
              multiline
              required
              placeholder="Upcoming Holiday/Event"
              value={events}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setEvent(e.target.value)}
              margin="normal"
            />
            <br />
            <TextField
              id="event_name"
              name="event_name"
              label="Event Name"
              multiline
              required
              value={event_name}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setEventname(e.target.value)}
              margin="normal"
            />
            <br />
            <TextField
              id="event_date"
              name="event_date"
              label="Event Date"
              required
              type="date"
              value={event_date}
              onChange={(e) => setEventdate(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
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

export default AddEvent;
