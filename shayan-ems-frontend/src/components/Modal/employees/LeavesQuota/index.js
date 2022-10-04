import React, { useState } from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper, TextField, Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { NO_CHANGES_MADE } from "@utils/constants";
import withStyles from "@material-ui/core/styles/withStyles";
import { ToastContainer, toast } from "react-toastify";
import { updateEmployee } from "@redux/actions";
import styles from "./styles";

const LeavesQuota = (props) => {
  const { employeeData, classes, openModal } = props;
  const [quota, setQuota] = useState();

  const handleChange = (e) => setQuota(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      quota === null ||
      quota === undefined ||
      Number(quota) === employeeData.yearly_quota
    ) {
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

    const finalData = {
      ...employeeData,
      yearly_quota: Number(quota),
    };

    const response = await props.updateEmployee(finalData);
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
    setTimeout(() => openModal(), 2000);
  };

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
          className={classes.modalStyle}
        >
          <Fade in={true}>
            <Paper elevation={3} variant="normal" square>
              <div className={classes.modalHeader}>
                <p>Add Yearly Quota</p>
              </div>
              <div className={classes.modalBody}>
                <Paper className={classes.paper}>
                  <form
                    className={classes.form}
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <TextField
                      id="tax"
                      name="tax"
                      label="Yearly Quota"
                      type="number"
                      value={quota}
                      fullWidth
                      required
                      className={classes.textField}
                      onChange={handleChange}
                      margin="normal"
                    />

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
                          onClick={openModal}
                        >
                          Close
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.submitButton}
                        >
                          Add
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
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  updateEmployee,
})(withStyles(styles)(LeavesQuota));
