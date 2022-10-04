import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { updateEmployee } from "@redux/actions";
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
    maxHeight: "90vh",
    margin: "auto",
    overflow: "auto",
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
    this.setState({
      [name]: value,
    });
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
    delete this.props.employeeData["password"];
    let payload = {
      ...this.props.employeeData,
      ...this.state,
    };
    const response = await this.props.updateEmployee(payload);
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
    }, 3000);
  };

  render() {
    const { classes, employeeData } = this.props;

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
                  <p>Update Employee</p>
                </div>
                <div style={modalBody}>
                  <Paper className={classes.paper}>
                    <form
                      className={classes.form}
                      autoComplete="off"
                      onSubmit={this.handleSubmit}
                    >
                      <TextField
                        id="first_name"
                        name="first_name"
                        label="First Name"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.first_name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="last_name"
                        name="last_name"
                        label="Last Name"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.last_name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="father_name"
                        name="father_name"
                        label="Father Name"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.father_name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="personal_email"
                        name="personal_email"
                        label="Personal Email"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.personal_email}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="official_email"
                        name="official_email"
                        label="Official Email"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.official_email}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="mobile_number"
                        name="mobile_number"
                        label="Mobile No"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.mobile_number}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="residential_number"
                        name="residential_number"
                        label="Residential Number"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.residential_number}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="national_id_number"
                        name="national_id_number"
                        label="National ID Number"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.national_id_number}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="date_of_birth"
                        name="date_of_birth"
                        label="Date Of Birth"
                        type="date"
                        defaultValue={employeeData.date_of_birth}
                        onChange={this.handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="residential_address"
                        name="residential_address"
                        label="Residential Address"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.residential_address}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="permanent_address"
                        name="permanent_address"
                        label="Permanent Address"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.permanent_address}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="joining_date"
                        name="joining_date"
                        label="Joining Date"
                        type="date"
                        defaultValue={
                          new Date(employeeData.joining_date)
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
                        id="salary"
                        name="salary"
                        label="Salary"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.salary}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="medical_allowance"
                        name="medical_allowance"
                        label="Medical Allowance"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.medical_allowance}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="job_title"
                        name="job_title"
                        label="Job Title"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.job_title}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="account_No"
                        name="account_No"
                        label="Account Number"
                        fullWidth
                        type="number"
                        required
                        className={classes.textField}
                        defaultValue={employeeData.account_No}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="machine_no"
                        name="machine_no"
                        label="Machine Number"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={employeeData.machine_no}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="password"
                        name="password"
                        label="Password"
                        fullWidth
                        required
                        className={classes.textField}
                        onChange={this.handleChange}
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
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            onClick={this.props.openModal}
                          >
                            Close
                          </Button>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            onClick={this.updateForm}
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

export default connect(mapStateToProps, { updateEmployee })(
  withStyles(styles)(UpdateEmployee)
);
