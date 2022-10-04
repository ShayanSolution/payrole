import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { updateShift } from "@redux/actions";
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

class updateShifts extends React.Component {
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

    const response = await this.props.updateShift(
      this.state,
      this.props.shiftData._id
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
  render() {
    const { classes, shiftData } = this.props;
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
                  <p>Update Shift Status</p>
                </div>
                <div style={modalBody}>
                  <Paper className={classes.paper}>
                    <form
                      className={classes.form}
                      autoComplete="off"
                      onSubmit={this.updateForm}
                    >
                      <TextField
                        id="shift_name"
                        name="shift_name"
                        label="Shift Name"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={shiftData.shift_name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="working_hours"
                        name="working_hours"
                        label="Working Hours"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={shiftData.working_hours}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="start_time"
                        name="start_time"
                        label="Start Time"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={shiftData.start_time}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="end_time"
                        name="end_time"
                        label="End Time"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={shiftData.end_time}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                      <TextField
                        id="no_of_hours"
                        name="no_of_hours"
                        label="Hours"
                        fullWidth
                        required
                        className={classes.textField}
                        defaultValue={shiftData.no_of_hours}
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
                            type="submit"
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
    employees: state.shift?.length && state.shift[0].payload,
  };
};

export default connect(mapStateToProps, { updateShift })(
  withStyles(styles)(updateShifts)
);
