import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { FormControl, InputLabel, Paper, Select } from "@material-ui/core";
import { connect } from "react-redux";
import { updateContract } from "@redux/actions";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { ToastContainer, toast } from "react-toastify";

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
  minWidth: "530px",
  minHeight: "300px",
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
    maxWidth: 500,
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
    width: 450,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  switch: {
    marginLeft: theme.spacing.unit,
  },
  dropDownField: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: "15px !important",
    width: 200,
  },
  dropDownText: {
    marginLeft: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 0.5,
    fontSize: "1rem",
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 450,
  },
});

class ViewContract extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...this.state,
      employeeId: this.props.contractData.employeeId,
      _id: this.props.contractData._id,
    };
    const response = await this.props.updateContract(payload);
    const { message, success } = response.data;
    toast(message, {
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
    setTimeout(() => {
      this.props.openModal();
    }, 3000);
  };

  render() {
    const { classes } = this.props;
    return (
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
                <p>Contract Details</p>
              </div>
              <div style={modalBody}>
                <Paper className={classes.paper}>
                  <form
                    className={classes.form}
                    autoComplete="off"
                    onSubmit={this.handleSubmit}
                  >
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="filled-age-native-simple">
                        Contract
                      </InputLabel>
                      <Select
                        native
                        fullWidth
                        defaultValue={this.props.contractData.contract}
                        inputProps={{
                          name: "status",
                          id: "filled-age-native-simple",
                        }}
                        onChange={(e) => {
                          this.setState({
                            contract: e.target.value,
                          });
                        }}
                      >
                        <option value={"Internee"}>Internee</option>
                        <option value={"Probationary"}>Probationary</option>
                        <option value={"Permanent"}>Permanent</option>
                        <option value={"Resignation"}>Resignation</option>
                        <option value={"Hourly"}>Hourly</option>
                      </Select>
                    </FormControl>

                    <TextField
                      id="started_at"
                      name="started_at"
                      label="Starting Date"
                      type="date"
                      required
                      // disabled
                      defaultValue={
                        this.props.contractData?.started_at?.split("T")[0]
                      }
                      onChange={(e) => {
                        this.setState({
                          started_at: e.target.value,
                        });
                      }}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      id="ended_at"
                      name="ended_at"
                      label="Ending Date"
                      type="date"
                      required
                      // disabled
                      defaultValue={
                        this.props.contractData?.ended_at?.split("T")[0]
                      }
                      onChange={(e) => {
                        this.setState({
                          ended_at: e.target.value,
                        });
                      }}
                      className={classes.textField}
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
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, { updateContract })(
  withStyles(styles)(ViewContract)
);
