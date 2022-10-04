import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { MenuItem, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { updateLeave } from "@redux/actions";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { ToastContainer, toast } from "react-toastify";
import { NO_CHANGES_MADE } from "@utils/constants";

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};

const modalBody = {
  paddingLeft: "15px",
  paddingRight: "15px",
  paddingBottom: "15px",
  minWidth: "300px",
};

const modalHeader = {
  background: "#232F3E",
  color: "white",
  textAlign: "center",
  paddingTop: "11px",
  paddingBottom: "0.02px",
};

const styles = (theme) => ({
  paper: {
    maxWidth: 750,
    margin: "auto",
    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
    boxShadow: "none !important",
  },
  form: {
    marginTop: theme.spacing.unit,
  },

  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 300,
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
    width: 300,
  },
});

class UpdateEmployee extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "status" && value !== "exempted") {
      console.log("exempted is not selected");
      this.setState({
        exempt_reason: "",
      });
    }
    this.setState({ [name]: value });
  };
  updateForm = async (event) => {
    event.preventDefault();
    if (!this.state) {
      toast(NO_CHANGES_MADE, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        type: "info",
      });
      return;
    }

    const response = await this.props.updateLeave(
      this.state,
      this.props.leaveData._id
    );

    const { message, success } = response.data;
    toast(message, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      type: success ? "success" : "error",
    });
    setTimeout(() => {
      this.props.openModal();
    }, 1000);
  };
  currencies = [
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "granted",
      label: "Granted",
    },
    {
      value: "rejected",
      label: "Rejected",
    },
    {
      value: "exempted",
      label: "Exempted",
    },
  ];

  render() {
    const { classes, leaveData } = this.props;

    return (
      <>
        <div>
          <Modal
            open={true}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            style={modalStyle}
          >
            <Fade in={true}>
              <Paper elevation={1} variant="normal" square>
                <div style={modalHeader}>
                  <p>Update Leave Status</p>
                </div>
                <div style={modalBody}>
                  <Paper className={classes.paper}>
                    <form
                      className={classes.form}
                      autoComplete="off"
                      onSubmit={this.updateForm}
                    >
                      <TextField
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={leaveData.employee_id.first_name}
                        onChange={this.handleChange}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        id="last_name"
                        name="last_name"
                        label="Last Name"
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                        className={classes.textField}
                        defaultValue={leaveData.employee_id.last_name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        name="status"
                        id="outlined-select-currency"
                        select
                        label="Select Status"
                        className={classes.textField}
                        defaultValue={leaveData.status}
                        onChange={this.handleChange}
                        helperText="Please select status"
                      >
                        {this.currencies.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="date_start"
                        name="date_start"
                        label="Start date"
                        InputProps={{
                          readOnly: true,
                        }}
                        type="date"
                        defaultValue={
                          new Date(leaveData.date_start)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={this.handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="date_end"
                        name="date_end"
                        label="End date"
                        type="date"
                        InputProps={{
                          readOnly: true,
                        }}
                        defaultValue={
                          new Date(leaveData.date_end)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={this.handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="no_of_days"
                        name="no_of_days"
                        label="No. of Days"
                        fullWidth
                        required
                        className={classes.textField}
                        InputProps={{
                          readOnly: true,
                        }}
                        defaultValue={Math.abs(leaveData.no_of_days)}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      {(this.state?.status === "exempted" ||
                        leaveData.status === "exempted") && (
                        <TextField
                          id="exempt_reason"
                          name="exempt_reason"
                          label="Exempt Reason"
                          fullWidth
                          required
                          className={classes.textField}
                          defaultValue={leaveData.exempt_reason}
                          InputProps={{}}
                          onChange={this.handleChange}
                          margin="normal"
                        />
                      )}
                      <br />

                      <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="flex-end"
                      >
                        <Grid item>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            onClick={this.props.openModal}
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                          >
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Paper>
                </div>
              </Paper>
            </Fade>
          </Modal>
        </div>
        <ToastContainer />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees?.length && state.employees[0].payload,
  };
};

export default connect(mapStateToProps, { updateLeave })(
  withStyles(styles)(UpdateEmployee)
);
