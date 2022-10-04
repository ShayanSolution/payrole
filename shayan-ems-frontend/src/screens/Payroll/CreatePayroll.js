import React from "react";
import { connect } from "react-redux";
import { fetchEmployees, createPayroll } from "../../Redux/actions";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import * as Yup from "yup";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Select,
} from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import { isMobile, matchIdInArray } from "@utils/utils";

const styles = (theme) => ({
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
});

class CreatePayroll extends React.Component {
  userSchema = Yup.object().shape({
    email: Yup.string()
      .email("The e-mail must be a valid email address.")
      .required("The e-mail field is required."),
  });

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      employeeId: "",
      late_arrivals: 0,
      exemptions: 2,
      bonus_note: "",
      deduction_note: "",
      advance_deduction: 0,
      checkbox: false,
      contract: "",
    };
  }

  componentDidMount = async () => {
    const response = await this.props.fetchEmployees();
    const { payload } = response.data;
    const activeEmployee = this.activeEmployees(payload);

    this.setState({
      isLoading: false,
      data: activeEmployee,
      contract: activeEmployee[0].contract,
      employeeId: activeEmployee[0]._id,
    });
  };

  activeEmployees = (employees) => {
    return employees.filter((employee) => {
      if (!employee.isSoftDeleted) {
        return employee;
      }
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "employeeId") {
      const employee = matchIdInArray(this.state.data, value);

      this.setState({
        contract: employee.contract,
        late_arrivals: 0,
      });
    }
    this.setState({
      [name]: value,
    });
  };
  hasError = (field) => {
    return this.state.validation[field] != null;
  };

  handleSubmit = async (event, type) => {
    event.preventDefault();
    if (type === "all") {
      const { data, salary_date } = this.state;
      const employees = data.filter(
        (employee) => employee.contract !== "Hourly"
      );
      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        const payload = {
          employee_id: emp._id,
          employee_name: `${emp.first_name} ${emp.last_name}`,
          job_title: emp.job_title,
          bonus_note: "",
          deduction_note: "",

          // exemptions: !exemptions ? "2" : exemptions,
          salary: emp.salary,
          medical_allowance: emp.medical_allowance,
          // late_arrivals: late_arrivals,
          salary_date: salary_date,
          advance_deduction: "0",
          incentive: "0",
          contract: emp.contract,
          joining_date: emp.joining_date,
          yearly_quota: emp.yearly_quota,
          // no_of_hours: no_of_hours,
        };

        const response = await this.props.createPayroll(payload);
        if (!response.data.success) {
          toast.success(response.data.message, {
            position: "bottom-left",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
            type: response.data.success ? "success" : "error",
          });
        }
      }
    } else {
      const {
        data,
        employeeId,
        salary_date,
        bonus_note,
        deduction_note,
        advance_deduction,
        contract,
        created_at,
        no_of_hours,
        incentive,
      } = this.state;
      const employee = matchIdInArray(data, employeeId);

      const {
        salary,
        first_name,
        last_name,
        job_title,
        joining_date,
        medical_allowance,
        yearly_quota,
      } = employee;

      const payload = {
        employee_id: employeeId,
        employee_name: `${first_name} ${last_name}`,
        job_title: job_title,
        bonus_note: bonus_note,
        deduction_note: deduction_note,
        // exemptions: !exemptions ? "2" : exemptions,
        salary: salary,
        medical_allowance,
        // late_arrivals: late_arrivals,
        salary_date: salary_date,
        advance_deduction: !advance_deduction ? "0" : advance_deduction,
        incentive: !incentive ? "0" : incentive,
        contract,
        created_at: created_at,
        no_of_hours: no_of_hours,
        joining_date,
        yearly_quota,
      };

      const response = await this.props.createPayroll(payload);
      const { success, message } = response.data;
      toast.success(message, {
        position: "bottom-left",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        type: success ? "success" : "error",
      });
      if (success) {
        this.setState({
          bonus_note: "",
          deduction_note: "",
          late_arrivals: "",
          exemptions: "",
          employeeId: data[0]._id,
        });
      }
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        {this.state.isLoading ? (
          <CircularProgress />
        ) : (
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Paper className={classes.paper}>
              <form
                className={classes.form}
                autoComplete="off"
                onSubmit={this.handleSubmit}
              >
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="filled-age-native-simple">
                    Employee Name
                  </InputLabel>
                  <Select
                    native
                    required
                    fullWidth
                    value={this.state.employeeId}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "employeeId",
                      id: "filled-age-native-simple",
                    }}
                  >
                    {this.state.data.map(function (employee, i) {
                      return (
                        <option value={employee._id} key={i}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  id="salary_date"
                  name="salary_date"
                  label="Choose Month"
                  required
                  type="month"
                  onChange={this.handleChange}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {this.state.contract !== "Hourly" ? (
                  <>
                    {" "}
                    {/* <TextField
                      id="late_arrivals"
                      name="late_arrivals"
                      label="Late Arrivals"
                      fullWidth
                      required
                      value={this.state.late_arrivals}
                      type="number"
                      placeholder="0"
                      InputProps={{ inputProps: { min: 0, max: 31 } }}
                      className={
                        isMobile() ? classes.TextField : classes.halfTextField
                      }
                      onChange={this.handleChange}
                      margin="normal"
                    />
                    <TextField
                      id="exemptions"
                      name="exemptions"
                      label="Exemptions"
                      fullWidth
                      required
                      type="number"
                      value={this.state.exemptions}
                      InputProps={{ inputProps: { min: 2 } }}
                      className={
                        isMobile() ? classes.TextField : classes.halfTextField
                      }
                      onChange={this.handleChange}
                      margin="normal"
                    /> */}
                  </>
                ) : (
                  <>
                    <TextField
                      id="no_of_hours"
                      name="no_of_hours"
                      label="No of Hours"
                      fullWidth
                      required
                      type="float"
                      placeholder="0"
                      className={
                        isMobile() ? classes.TextField : classes.halfTextField
                      }
                      onChange={this.handleChange}
                      margin="normal"
                    />
                  </>
                )}
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox
                      color="primary"
                      onChange={() =>
                        this.setState({ checkbox: !this.state.checkbox })
                      }
                    />
                  }
                  label="Advance"
                  className={classes.checkbox}
                  labelPlacement="end"
                />
                <br />
                {this.state.checkbox && (
                  <>
                    <TextField
                      id="advance_deduction"
                      name="advance_deduction"
                      label="Advance Deductions"
                      type="number"
                      defaultValue={0}
                      className={
                        isMobile() ? classes.TextField : classes.halfTextField
                      }
                      onChange={this.handleChange}
                      margin="normal"
                    />
                    <TextField
                      id="incentive"
                      name="incentive"
                      label="Incentive"
                      type="number"
                      defaultValue={0}
                      className={
                        isMobile() ? classes.TextField : classes.halfTextField
                      }
                      onChange={this.handleChange}
                      margin="normal"
                    />
                    <TextField
                      id="bonus_note"
                      name="bonus_note"
                      label="Bonus Note"
                      multiline
                      value={this.state.bonus_note}
                      type="text"
                      InputProps={{ inputProps: { min: 0 } }}
                      className={classes.textField}
                      onChange={this.handleChange}
                      margin="normal"
                    />
                    <TextField
                      id="deduction_note"
                      name="deduction_note"
                      label="Deduction Note"
                      multiline
                      value={this.state.deduction_note}
                      type="text"
                      InputProps={{ inputProps: { min: 0 } }}
                      className={classes.textField}
                      onChange={this.handleChange}
                      margin="normal"
                    />
                  </>
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
            <Paper className={classes.paper}>
              <form
                className={classes.form}
                autoComplete="off"
                onSubmit={(e) => this.handleSubmit(e, "all")}
              >
                <p className={classes.textField}>
                  Click on Generate Payroll to create the payroll of all
                  employees
                </p>
                <TextField
                  id="salary_date"
                  name="salary_date"
                  label="Choose Month"
                  required
                  type="month"
                  onChange={this.handleChange}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <br />
                <br />

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
                      Generate Payroll
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </div>
        )}

        <ToastContainer />
      </>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  fetchEmployees,
  createPayroll,
})(withStyles(styles)(CreatePayroll));
