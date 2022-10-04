import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { MenuItem, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { updateSuggestion } from "../../../Redux/actions";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { ToastContainer, toast } from "react-toastify";
import { NO_CHANGES_MADE } from "@utils/constants";
import {
  modalStyle,
  modalBody,
  modalHeader,
  styles,
} from "@styles/styledComponents";
class UpdateSuggestion extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
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
    const response = await this.props.updateSuggestion(
      this.state,
      this.props.data._id
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
  status = [
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "approved",
      label: "Approved",
    },
    {
      value: "declined",
      label: "Declined",
    },
  ];

  render() {
    const { classes, data } = this.props;
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
                  <p>Update Suggestion Status</p>
                </div>
                <div style={modalBody}>
                  <Paper className={classes.paper}>
                    <form
                      className={classes.form}
                      autoComplete="off"
                      onSubmit={this.updateForm}
                    >
                      <TextField
                        name="suggestion_status"
                        id="outlined-select-currency"
                        select
                        label="Select Status"
                        className={classes.textField}
                        defaultValue={data.request_status}
                        onChange={this.handleChange}
                        helperText="Please select status"
                      >
                        {this.status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
    employees: state.employees?.length && state.employees[0].payload,
  };
};

export default connect(mapStateToProps, { updateSuggestion })(
  withStyles(styles)(UpdateSuggestion)
);
