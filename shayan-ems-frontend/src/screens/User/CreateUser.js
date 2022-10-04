import React from "react";
import { connect } from "react-redux";
import { createEmployee } from "../../Redux/actions";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import * as Yup from "yup";
import {
  omitFields,
  validateEmail,
  validateNationalId,
  validateNumber,
  validateName,
} from "@utils/utils";
import { Select } from "@material-ui/core";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";

const styles = (theme) => ({
  paper: {
    maxWidth: 1100,
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

class CreateUser extends React.Component {
  userSchema = Yup.object().shape({
    email: Yup.string()
      .email("The e-mail must be a valid email address.")
      .required("The e-mail field is required."),
  });

  constructor(props) {
    super(props);
    this.initialState = {
      email: null,
      smsCredentials: true,
      emailCredentials: true,
      isSubmitting: false,
      status: "Probationary",
      checkbox: false,
      role: "Admin",
      validation: {
        personal_email: null,
        official_email: null,
        national_id_number: null,
        mobile_number: null,
        first_name: null,
        last_name: null,
        father_name: null,
        residential_number: null,
      },
    };

    this.state = this.initialState;
  }
  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };
  hasError = (field) => {
    return this.state.validation[field] != null;
  };

  isFormValid = () => {
    let isFormValid = true;
    let validationErrors = {
      personal_email: null,
      official_email: null,
      national_id_number: null,
      mobile_number: null,
      first_name: null,
      last_name: null,
      father_name: null,
      residential_number: null,
    };

    if (!validateName(this.state.first_name)) {
      validationErrors.first_name = "Only alphabets and spaces are allowed";
      isFormValid = false;
    }
    if (!validateName(this.state.last_name)) {
      validationErrors.last_name = "Only alphabets and spaces are allowed";
      isFormValid = false;
    }
    if (!validateName(this.state.father_name)) {
      validationErrors.father_name = "Only alphabets and spaces are allowed";
      isFormValid = false;
    }
    if (!validateNumber(this.state.residential_number)) {
      validationErrors.residential_number =
        "Invalid Residential Number. Number be like ####-#######";
      isFormValid = false;
    }
    if (!validateEmail(this.state.personal_email)) {
      validationErrors.personal_email = "Invalid Email Id";
      isFormValid = false;
    }
    if (!validateEmail(this.state.official_email)) {
      validationErrors.official_email = "Invalid Email Id";
      isFormValid = false;
    }
    if (!validateNationalId(this.state.national_id_number)) {
      validationErrors.national_id_number =
        "Invalid National Id. National Id Card No be like #####-#######-#";
      isFormValid = false;
    }
    if (!validateNumber(this.state.mobile_number)) {
      validationErrors.mobile_number =
        "Invalid Phone Number. Mobile No be like ####-#######";
      isFormValid = false;
    }
    this.setState({
      validation: validationErrors,
    });

    return isFormValid;
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.isFormValid()) {
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    let data = {
      ...this.state,
      notifyBy: [],
    };
    let payload;
    if (!this.state.checkbox) {
      payload = omitFields(data, ["password", "role"]);
    }
    payload = omitFields(data, [
      "smsCredentials",
      "emailCredentials",
      "isSubmitting",
      "notifyBy",
      "checkbox",
    ]);

    const result = await this.props.createEmployee(payload);
    const { message, success } = result.data;
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
      if (success) {
        this.props.history.push("/employees");
      }
    }, 3000);
  };

  render() {
    const { classes } = this.props;
    return (
      <>
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
              error={this.hasError("first_name")}
              className={classes.textField}
              value={this.state.first_name}
              onChange={this.handleChange}
              helperText={this.state.validation.first_name}
              margin="normal"
            />
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name"
              fullWidth
              required
              error={this.hasError("last_name")}
              className={classes.textField}
              value={this.state.last_name}
              onChange={this.handleChange}
              helperText={this.state.validation.last_name}
              margin="normal"
            />
            <TextField
              id="father_name"
              name="father_name"
              label="Father Name"
              fullWidth
              required
              error={this.hasError("father_name")}
              className={classes.textField}
              value={this.state.father_name}
              onChange={this.handleChange}
              helperText={this.state.validation.father_name}
              margin="normal"
            />
            <TextField
              id="personal_email"
              name="personal_email"
              label="Personal Email"
              fullWidth
              required
              className={classes.textField}
              error={this.hasError("personal_email")}
              value={this.state.email}
              onChange={this.handleChange}
              helperText={this.state.validation.personal_email}
              margin="normal"
            />
            <TextField
              id="official_email"
              name="official_email"
              label="Official Email"
              fullWidth
              required
              className={classes.textField}
              error={this.hasError("official_email")}
              value={this.state.official_email}
              onChange={this.handleChange}
              helperText={this.state.validation.official_email}
              margin="normal"
            />
            <TextField
              id="mobile_number"
              name="mobile_number"
              label="Mobile No"
              fullWidth
              required
              className={classes.textField}
              error={this.hasError("mobile_number")}
              value={this.state.phone}
              onChange={this.handleChange}
              helperText={this.state.validation.mobile_number}
              margin="normal"
            />
            <TextField
              id="residential_number"
              name="residential_number"
              label="Residential Number"
              fullWidth
              required
              error={this.hasError("residential_number")}
              className={classes.textField}
              value={this.state.residential_number}
              onChange={this.handleChange}
              helperText={this.state.validation.residential_number}
              margin="normal"
            />
            <TextField
              id="national_id_number"
              name="national_id_number"
              label="National ID Number"
              fullWidth
              required
              className={classes.textField}
              error={this.hasError("national_id_number")}
              value={this.state.national_id_number}
              onChange={this.handleChange}
              helperText={this.state.validation.national_id_number}
              margin="normal"
            />
            <TextField
              id="date_of_birth"
              name="date_of_birth"
              label="Date Of Birth"
              type="date"
              required
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
              type="text"
              fullWidth
              required
              className={classes.textField}
              value={this.state.residential_address}
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
              value={this.state.permanent_address}
              onChange={this.handleChange}
              margin="normal"
            />
            <TextField
              id="joining_date"
              name="joining_date"
              label="Joining Date"
              type="date"
              required
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
              type="number"
              defaultValue={0}
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              value={this.state.salary}
              onChange={this.handleChange}
              margin="normal"
            />
            <TextField
              id="medical_allowance"
              name="medical_allowance"
              label="Medical Allowance"
              fullWidth
              required
              type="number"
              defaultValue={0}
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              value={this.state.medical_allowance}
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
              error={this.hasError("job_title")}
              value={this.state.job_title}
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
              error={this.hasError("account_No")}
              value={this.state.account_No}
              onChange={this.handleChange}
              margin="normal"
            />

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="filled-age-native-simple">
                Contract
              </InputLabel>
              <Select
                native
                required
                fullWidth
                defaultValue={"Probationary"}
                onChange={this.handleChange}
                inputProps={{
                  name: "status",
                  id: "filled-age-native-simple",
                }}
              >
                <option value={"Probationary"}>Probationary</option>
                <option value={"Internee"}>Internee</option>
                <option value={"Permanent"}>Permanent</option>
                <option value={"Hourly"}>Hourly</option>
              </Select>
            </FormControl>
            <FormControlLabel
              value="start"
              control={
                <Checkbox
                  color="primary"
                  className={classes.checkbox}
                  onChange={() =>
                    this.setState({ checkbox: !this.state.checkbox })
                  }
                />
              }
              label="Administrator"
              labelPlacement="end"
            />
            <br />
            {this.state.checkbox && (
              <>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    native
                    required={this.state.checkbox}
                    fullWidth
                    defaultValue={"Admin"}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "role",
                      id: "role",
                    }}
                  >
                    <option value={"Admin"}>Admin</option>
                    <option value={"HR"}>HR</option>
                  </Select>
                </FormControl>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  fullWidth
                  required={this.state.checkbox}
                  InputProps={{
                    autoComplete: "new-password",
                  }}
                  type="password"
                  className={classes.textField}
                  // error={this.hasError("")}
                  value={this.state.password}
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
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <ToastContainer />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.payload,
    users: state.users,
  };
};

export default connect(mapStateToProps, {
  createEmployee,
})(withStyles(styles)(CreateUser));
