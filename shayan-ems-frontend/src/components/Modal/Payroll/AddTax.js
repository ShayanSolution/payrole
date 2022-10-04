import React, { useState } from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper, TextField, Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { updatePayroll } from "@redux/actions";
import { ToastContainer, toast } from "react-toastify";
import { NO_CHANGES_MADE } from "@utils/constants";
import withStyles from "@material-ui/core/styles/withStyles";

const AddTax = (props) => {
  const { payrollData, classes } = props;
  const [tax, setTax] = useState(0);

  const handleChange = (e) => {
    setTax(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tax) {
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
      ...payrollData,
      tax: Number(tax),
    };

    const response = await props.updatePayroll(finalData);
    const { message, success } = response.data;

    if (success) {
      const payloadsInStorage = JSON.parse(localStorage.getItem("payrolls"));
      const updatedPayrolls = payloadsInStorage.payload.map((item) => {
        if (item._id === payrollData._id) {
          item.tax = finalData.tax;
        }
        return item;
      });
      localStorage.setItem(
        "payrolls",
        JSON.stringify({ ...payloadsInStorage, payload: updatedPayrolls })
      );
    }

    toast.success(message, {
      position: "bottom-left",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      type: success ? "success" : "error",
    });

    setTimeout(() => {
      props.openModal();
    }, 1000);
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
          style={modalStyle}
        >
          <Fade in={true}>
            <Paper elevation={3} variant="normal" square>
              <div style={modalHeader}>
                <p>Add Tax</p>
              </div>
              <div style={modalBody}>
                <Paper className={classes.paper}>
                  <form
                    className={classes.form}
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <TextField
                      id="tax"
                      name="tax"
                      label="Tax"
                      type="number"
                      value={tax}
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
                          onClick={props.openModal}
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

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};

const modalHeader = {
  background: "#232F3E",
  color: "white",
  textAlign: "center",
  paddingTop: "10px",
  paddingBottom: "0.02px",
};
const modalBody = {
  padding: "10px",
  minWidth: "250px",
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
    width: 200,
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

const mapStateToProps = (state) => {
  return {
    posts: state.payload,
    users: state.users,
  };
};
export default connect(mapStateToProps, {
  updatePayroll,
})(withStyles(styles)(AddTax));
